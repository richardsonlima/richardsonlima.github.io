/* Case study de arquitetura Python: plataforma de ingestao e analise de transacoes financeiras.
   Desenho de referencia, didatico: os numeros sao alvos de projeto para discutir trade-offs,
   nao medicoes de um sistema especifico. Campos com sufixo _en sao lidos por I18N.pick. */

/* ---------- Estagios (visao end-to-end + detalhe expansivel) ---------- */
window.PIPELINE_STAGES = [
  /* ---------- 01 . Ingestao assincrona ---------- */
  {
    title: 'Ingestão assíncrona', title_en: 'Asynchronous ingestion',
    sub: 'Recebe eventos de várias fontes sem bloquear, com fila limitada e backpressure.',
    sub_en: 'Receives events from many sources without blocking, using a bounded queue and backpressure.',
    tags: [{k:'env',t:'I/O-BOUND'},{k:'dsp',t:'asyncio'}],
    purpose: 'A borda do sistema é dominada por <strong>espera de rede</strong>: milhares de conexões, cada uma ociosa quase o tempo todo. É o caso clássico do <code>asyncio</code>: uma thread, um event loop, muitas corrotinas. O ponto crítico não é throughput, é o que acontece quando o consumidor fica mais lento que o produtor. Sem limite, a fila vira memória até o OOM. Com <strong>fila limitada</strong>, o <code>put</code> suspende o produtor e a pressão sobe até a fonte.',
    purpose_en: 'The edge of the system is dominated by <strong>network waiting</strong>: thousands of connections, each idle most of the time. This is the textbook case for <code>asyncio</code>: one thread, one event loop, many coroutines. The critical point is not throughput, it is what happens when the consumer gets slower than the producer. Without a limit, the queue turns into memory until the OOM killer arrives. With a <strong>bounded queue</strong>, <code>put</code> suspends the producer and the pressure travels back to the source.',
    flow: ['fonte (HTTP/stream)', 'fila limitada', 'N workers', 'validação', 'lote em disco'],
    patterns: [
      { name: 'Event loop + corrotinas', id: 'asyncio', note: 'um loop atende milhares de conexões; nada de código bloqueante dentro de <code>async def</code>.', note_en: 'one loop serves thousands of connections; no blocking code inside <code>async def</code>.' },
      { name: 'Produtor/consumidor com backpressure', id: 'async-patterns', note: '<code>Queue(maxsize=N)</code>, <code>Semaphore</code>, <code>TaskGroup</code> e cancelamento estruturado.', note_en: '<code>Queue(maxsize=N)</code>, <code>Semaphore</code>, <code>TaskGroup</code> and structured cancellation.' },
      { name: 'Mensageria e eventos', id: 'eventos-message-bus', note: 'a fonte publica fatos; o sistema reage. Desacopla quem produz de quem consome.', note_en: 'the source publishes facts and the system reacts. It decouples producers from consumers.' },
      { name: 'Observer', id: 'observer', note: 'hooks de métricas e auditoria sem acoplar o worker a quem observa.', note_en: 'metric and audit hooks without coupling the worker to its observers.' }
    ],
    code: `import asyncio
from collections.abc import AsyncIterator, Awaitable, Callable


async def ingerir(
    fonte: AsyncIterator[bytes],
    gravar: Callable[[bytes], Awaitable[None]],
    *,
    workers: int = 8,
    maxsize: int = 1_000,
) -> None:
    fila: asyncio.Queue[bytes | None] = asyncio.Queue(maxsize=maxsize)

    async def produtor() -> None:
        async for msg in fonte:
            await fila.put(msg)      # fila cheia suspende a fonte: backpressure
        for _ in range(workers):
            await fila.put(None)     # um sentinela de fim por worker

    async def worker() -> None:
        while (msg := await fila.get()) is not None:
            await gravar(msg)

    async with asyncio.TaskGroup() as tg:    # Python 3.11+
        tg.create_task(produtor())
        for _ in range(workers):
            tg.create_task(worker())`,
    pitfalls: [
      '<strong>Fila sem limite.</strong> <code>Queue()</code> sem <code>maxsize</code> esconde o problema até o processo morrer por memória.',
      '<strong>Código bloqueante no loop.</strong> Um <code>requests.get</code> ou um <code>json.loads</code> gigante congela todas as conexões. Use <code>httpx.AsyncClient</code>, <code>asyncio.to_thread</code> ou um pool de processos.',
      '<strong>Tarefas órfãs.</strong> <code>create_task</code> sem guardar a referência pode ser coletada; prefira <code>TaskGroup</code>, que também propaga erro e cancela as irmãs.',
      '<strong>Falha parcial sem política.</strong> Decida antes: retry com backoff e jitter, dead-letter, ou descarte com métrica.'
    ],
    pitfalls_en: [
      '<strong>Unbounded queue.</strong> <code>Queue()</code> without <code>maxsize</code> hides the problem until the process dies from memory.',
      '<strong>Blocking code in the loop.</strong> A <code>requests.get</code> or a huge <code>json.loads</code> freezes every connection. Use <code>httpx.AsyncClient</code>, <code>asyncio.to_thread</code> or a process pool.',
      '<strong>Orphan tasks.</strong> <code>create_task</code> without keeping the reference can be garbage collected; prefer <code>TaskGroup</code>, which also propagates errors and cancels siblings.',
      '<strong>Partial failure without a policy.</strong> Decide up front: retry with backoff and jitter, dead-letter, or drop with a metric.'
    ],
    metrics: [
      ['Profundidade da fila', 'perto de zero em regime; sustentada no limite indica consumidor lento'],
      ['Latência do event loop', 'lag do loop em milissegundos; picos indicam código bloqueante'],
      ['Taxa de erro por fonte', 'retries, dead-letter e descartes contados por causa'],
      ['Conexões abertas', 'dentro do limite do ALB, do broker e dos file descriptors']
    ],
    metrics_en: [
      ['Queue depth', 'near zero in steady state; sustained at the limit means a slow consumer'],
      ['Event loop latency', 'loop lag in milliseconds; spikes point to blocking code'],
      ['Error rate per source', 'retries, dead-letters and drops counted by cause'],
      ['Open connections', 'within the limits of the load balancer, the broker and file descriptors']
    ]
  },

  /* ---------- 02 . Dominio e validacao ---------- */
  {
    title: 'Domínio e validação', title_en: 'Domain and validation',
    sub: 'Valida na borda, converte para o modelo de domínio e isola o núcleo de qualquer I/O.',
    sub_en: 'Validates at the edge, converts to the domain model and keeps the core free of any I/O.',
    tags: [{k:'dsp',t:'ARQUITETURA'},{k:'env',t:'CPU LEVE'}],
    purpose: 'Dado externo é hostil por padrão. A arquitetura <strong>hexagonal</strong> separa três regiões: a borda (adapters que falam JSON, Kafka, HTTP), o núcleo (entidades e <em>value objects</em> sem I/O) e as portas (<code>Protocol</code> que o núcleo exige do mundo). O <strong>Pydantic</strong> fica só na borda, onde transforma bytes em tipos validados. Dentro do núcleo, o dinheiro é um <code>Dinheiro</code> imutável, nunca um <code>float</code>, e o domínio é testável sem banco, sem rede e sem mock de framework.',
    purpose_en: 'External data is hostile by default. <strong>Hexagonal</strong> architecture separates three regions: the edge (adapters that speak JSON, Kafka, HTTP), the core (entities and <em>value objects</em> with no I/O) and the ports (the <code>Protocol</code> classes the core demands from the world). <strong>Pydantic</strong> stays at the edge, turning bytes into validated types. Inside the core, money is an immutable <code>Dinheiro</code>, never a <code>float</code>, and the domain is testable with no database, no network and no framework mocks.',
    flow: ['bytes', 'Pydantic (borda)', 'value objects', 'entidade Transação', 'porta Repositório'],
    patterns: [
      { name: 'Hexagonal (ports and adapters)', id: 'hexagonal', note: 'o núcleo depende de portas, os adapters dependem do núcleo, nunca o contrário.', note_en: 'the core depends on ports, adapters depend on the core, never the reverse.' },
      { name: 'DDD tático', id: 'ddd-tatico', note: 'entidades, value objects e agregados com invariantes explícitas.', note_en: 'entities, value objects and aggregates with explicit invariants.' },
      { name: 'Dataclasses e Pydantic', id: 'dataclasses-pydantic', note: 'Pydantic para dado externo, <code>dataclass(frozen=True, slots=True)</code> para o núcleo.', note_en: 'Pydantic for external data, <code>dataclass(frozen=True, slots=True)</code> for the core.' },
      { name: 'Protocols como portas', id: 'protocols-abc', note: 'interface estrutural: o adapter não precisa herdar de nada.', note_en: 'structural interface: the adapter does not need to inherit from anything.' },
      { name: 'Erros como parte do design', id: 'clean-errors', note: 'exceções de domínio nomeadas, sem <code>except Exception</code> genérico.', note_en: 'named domain exceptions, no blanket <code>except Exception</code>.' }
    ],
    code: `from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from typing import Protocol

from pydantic import BaseModel, ConfigDict, field_validator


@dataclass(frozen=True, slots=True)
class Dinheiro:
    """Value object: igualdade por valor, imutável, sem float."""
    centavos: int
    moeda: str

    def __post_init__(self) -> None:
        if len(self.moeda) != 3 or not self.moeda.isupper():
            raise ValueError("moeda deve seguir ISO 4217, ex.: BRL")

    def __add__(self, outro: "Dinheiro") -> "Dinheiro":
        if outro.moeda != self.moeda:
            raise ValueError("não some moedas diferentes")
        return Dinheiro(self.centavos + outro.centavos, self.moeda)


class TransacaoIn(BaseModel):
    """DTO da borda: valida o que veio de fora."""
    model_config = ConfigDict(frozen=True, extra="forbid")

    id: str
    conta: str
    valor: Decimal
    moeda: str
    ocorrida_em: datetime

    @field_validator("valor")
    @classmethod
    def _positivo(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("valor deve ser positivo")
        return v

    def para_dominio(self) -> "Transacao":
        centavos = int(self.valor * 100)
        return Transacao(self.id, self.conta, Dinheiro(centavos, self.moeda), self.ocorrida_em)


@dataclass(frozen=True, slots=True)
class Transacao:
    id: str
    conta: str
    valor: Dinheiro
    ocorrida_em: datetime


class RepositorioTransacoes(Protocol):
    """Porta: o núcleo declara o que precisa; um adapter entrega."""
    def adicionar(self, lote: list[Transacao]) -> None: ...`,
    pitfalls: [
      '<strong>float para dinheiro.</strong> <code>0.1 + 0.2 != 0.3</code>. Use inteiro em centavos ou <code>Decimal</code> com contexto controlado.',
      '<strong>Pydantic no núcleo.</strong> Vincular o domínio ao framework de validação faz toda regra de negócio depender de uma lib de borda.',
      '<strong>Validação em um lugar só.</strong> Validar na borda e de novo no domínio parece redundante; não é. A borda checa formato, o domínio protege invariantes.',
      '<strong>Hexagonal cerimonial.</strong> Em um script de 200 linhas, portas e adapters são overhead. A arquitetura se paga quando há mais de um adapter ou testes lentos.'
    ],
    pitfalls_en: [
      '<strong>float for money.</strong> <code>0.1 + 0.2 != 0.3</code>. Use integer cents or <code>Decimal</code> with a controlled context.',
      '<strong>Pydantic in the core.</strong> Binding the domain to the validation framework makes every business rule depend on an edge library.',
      '<strong>One place to validate.</strong> Validating at the edge and again in the domain looks redundant; it is not. The edge checks format, the domain protects invariants.',
      '<strong>Ceremonial hexagonal.</strong> In a 200-line script, ports and adapters are overhead. The architecture pays off when there is more than one adapter or tests are slow.'
    ],
    metrics: [
      ['Taxa de rejeição na borda', 'por motivo (schema, valor, moeda); mudança brusca indica fonte quebrada'],
      ['Cobertura de testes do núcleo', 'alta e rápida: o domínio roda sem I/O, em milissegundos'],
      ['Violações de dependência', 'zero imports do núcleo para adapters, checado por import-linter'],
      ['Custo de validação', 'microssegundos por evento; meça antes de trocar de biblioteca']
    ],
    metrics_en: [
      ['Edge rejection rate', 'by reason (schema, amount, currency); a sharp change points to a broken source'],
      ['Core test coverage', 'high and fast: the domain runs without I/O, in milliseconds'],
      ['Dependency violations', 'zero imports from the core into adapters, enforced by import-linter'],
      ['Validation cost', 'microseconds per event; measure before swapping libraries']
    ]
  },

  /* ---------- 03 . Processamento em larga escala ---------- */
  {
    title: 'Processamento em larga escala', title_en: 'Large-scale processing',
    sub: 'Transforma e agrega volumes maiores que a RAM com Polars, Arrow e processos.',
    sub_en: 'Transforms and aggregates volumes larger than RAM with Polars, Arrow and processes.',
    tags: [{k:'ml',t:'CPU-BOUND'},{k:'envc',t:'POLARS · ARROW'}],
    purpose: 'Aqui o gargalo muda: não é espera, é <strong>CPU e memória</strong>. Loops Python sobre milhões de linhas pagam o custo do interpretador a cada objeto. A saída é empurrar o trabalho para um motor colunar (<strong>Polars</strong> sobre <strong>Arrow</strong>), que opera em lotes vetorizados, em várias threads e sem GIL. O modo <em>lazy</em> monta um plano e o otimizador aplica <em>predicate</em> e <em>projection pushdown</em>, lendo só as colunas e partições necessárias. Para o que não cabe em um grafo de expressões, <code>multiprocessing</code> contorna o GIL com um processo por partição.',
    purpose_en: 'The bottleneck changes here: it is no longer waiting, it is <strong>CPU and memory</strong>. Python loops over millions of rows pay the interpreter cost on every object. The way out is to push work into a columnar engine (<strong>Polars</strong> on <strong>Arrow</strong>), which operates on vectorized batches, across threads and without the GIL. Lazy mode builds a plan and the optimizer applies <em>predicate</em> and <em>projection pushdown</em>, reading only the columns and partitions it needs. For what does not fit an expression graph, <code>multiprocessing</code> sidesteps the GIL with one process per partition.',
    flow: ['scan_parquet (lazy)', 'filter + project', 'group_by', 'collect streaming', 'Parquet de saída'],
    patterns: [
      { name: 'Polars lazy + expressões', id: 'polars', note: 'plano otimizado, paralelismo por padrão, sem laço Python por linha.', note_en: 'optimized plan, parallel by default, no per-row Python loop.' },
      { name: 'Arrow como formato de troca', id: 'arrow-parquet', note: 'memória colunar compartilhada entre Polars, DuckDB e Pandas, com cópia mínima.', note_en: 'columnar memory shared across Polars, DuckDB and Pandas, with minimal copying.' },
      { name: 'Out-of-core', id: 'out-of-core', note: 'processe em chunks ou em streaming quando o dado excede a RAM.', note_en: 'process in chunks or streaming when data exceeds RAM.' },
      { name: 'multiprocessing', id: 'multiprocessing', note: 'um processo por partição para trabalho CPU-bound fora do motor colunar.', note_en: 'one process per partition for CPU-bound work outside the columnar engine.' },
      { name: 'Profiling antes de otimizar', id: 'profiling', note: 'meça com cProfile, py-spy e <code>timeit</code>; otimize o que o perfil apontar.', note_en: 'measure with cProfile, py-spy and <code>timeit</code>; optimize what the profile points at.' }
    ],
    code: `import polars as pl
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path


def resumo_diario(origem: str) -> pl.DataFrame:
    """Agrega sem materializar o arquivo inteiro: tudo lazy até o collect."""
    return (
        pl.scan_parquet(origem)
        .filter(pl.col("moeda") == "BRL")
        .with_columns(pl.col("ocorrida_em").dt.date().alias("dia"))
        .group_by("conta", "dia")
        .agg(
            pl.col("valor_centavos").sum().alias("total_centavos"),
            pl.len().alias("quantidade"),
        )
        .collect(engine="streaming")   # a API de streaming varia entre versões do Polars
    )


def processar_particao(caminho: Path) -> int:
    """Trabalho CPU-bound que não cabe em expressões: um processo por arquivo."""
    resumo_diario(str(caminho)).write_parquet(caminho.with_suffix(".resumo.parquet"))
    return caminho.stat().st_size


def processar_tudo(pasta: Path) -> int:
    with ProcessPoolExecutor() as pool:           # contorna o GIL
        return sum(pool.map(processar_particao, sorted(pasta.glob("*.parquet"))))


if __name__ == "__main__":                        # obrigatório em spawn (macOS, Windows)
    print(processar_tudo(Path("lote")))`,
    pitfalls: [
      '<strong>Voltar ao laço Python.</strong> <code>map_elements</code> e <code>apply</code> chamam Python por linha e anulam o ganho. Prefira expressões nativas.',
      '<strong>collect cedo demais.</strong> Materializar o DataFrame no meio do pipeline joga fora o pushdown e a economia de memória.',
      '<strong>Tipos errados.</strong> Dinheiro como float perde precisão; como <code>Int64</code> em centavos é exato e rápido. Strings repetidas viram <code>Categorical</code>.',
      '<strong>Processos sem medir.</strong> Serializar dados entre processos (pickle) pode custar mais que o cálculo. Passe caminhos, não DataFrames.'
    ],
    pitfalls_en: [
      '<strong>Going back to the Python loop.</strong> <code>map_elements</code> and <code>apply</code> call Python per row and erase the gain. Prefer native expressions.',
      '<strong>Calling collect too early.</strong> Materializing the DataFrame mid-pipeline throws away pushdown and the memory savings.',
      '<strong>Wrong dtypes.</strong> Money as float loses precision; as <code>Int64</code> cents it is exact and fast. Repeated strings become <code>Categorical</code>.',
      '<strong>Processes without measuring.</strong> Serializing data between processes (pickle) can cost more than the computation. Pass paths, not DataFrames.'
    ],
    metrics: [
      ['Throughput', 'linhas por segundo por núcleo, medido em dado realista'],
      ['Pico de memória', 'RSS máximo, com memray ou o monitor do container; deve ficar abaixo do limite'],
      ['Utilização de CPU', 'todos os núcleos ocupados indica paralelismo real; um núcleo só indica gargalo serial'],
      ['Tempo por partição', 'distribuição, não só a média; a cauda mostra partições desbalanceadas']
    ],
    metrics_en: [
      ['Throughput', 'rows per second per core, measured on realistic data'],
      ['Peak memory', 'maximum RSS, with memray or the container monitor; must stay below the limit'],
      ['CPU utilization', 'all cores busy means real parallelism; a single busy core means a serial bottleneck'],
      ['Time per partition', 'the distribution, not only the mean; the tail exposes unbalanced partitions']
    ]
  },

  /* ---------- 04 . Armazenamento analitico ---------- */
  {
    title: 'Armazenamento analítico', title_en: 'Analytical storage',
    sub: 'Parquet particionado como fonte da verdade e DuckDB para consultar sem servidor.',
    sub_en: 'Partitioned Parquet as the source of truth and DuckDB to query with no server.',
    tags: [{k:'env',t:'COLUNAR'},{k:'dsp',t:'PARQUET · DUCKDB'}],
    purpose: 'Para análise, o formato importa mais que o banco. <strong>Parquet</strong> guarda dados em colunas, comprimidos, com estatísticas por <em>row group</em> que permitem pular blocos inteiros. Particionar por data (<code>ano=2026/mes=10/</code>) faz a consulta ler só o mês pedido. O <strong>DuckDB</strong> executa SQL direto sobre esses arquivos, no próprio processo, sem servidor para operar, e conversa com Arrow e Polars sem copiar. O lake fica barato e aberto; o motor é trocável.',
    purpose_en: 'For analytics, the format matters more than the database. <strong>Parquet</strong> stores data in compressed columns with per-<em>row group</em> statistics that let the reader skip whole blocks. Partitioning by date (<code>year=2026/month=10/</code>) makes a query read only the requested month. <strong>DuckDB</strong> runs SQL directly over those files, in-process, with no server to operate, and talks to Arrow and Polars without copying. The lake stays cheap and open; the engine is replaceable.',
    flow: ['lote processado', 'escrita Parquet', 'partição ano/mês', 'catálogo', 'consulta DuckDB'],
    patterns: [
      { name: 'Parquet e Arrow', id: 'arrow-parquet', note: 'formato colunar com compressão, pushdown de filtro e esquema embutido.', note_en: 'columnar format with compression, filter pushdown and an embedded schema.' },
      { name: 'DuckDB embutido', id: 'duckdb', note: 'SQL analítico em processo, lendo Parquet local ou em objeto remoto.', note_en: 'in-process analytical SQL, reading local or remote-object Parquet.' },
      { name: 'Pipelines de dados', id: 'pipelines-dados', note: 'escrita idempotente por partição: reprocessar o mesmo dia produz o mesmo resultado.', note_en: 'idempotent per-partition writes: reprocessing the same day produces the same result.' },
      { name: 'Repository', id: 'repository-uow', note: 'o núcleo escreve pela porta; o adapter decide Parquet, banco ou outro destino.', note_en: 'the core writes through the port; the adapter decides Parquet, a database or another sink.' }
    ],
    code: `import duckdb

con = duckdb.connect()

# Escrita particionada: um diretório por ano e mês, compressão zstd.
con.execute("""
    COPY (
        SELECT *, year(ocorrida_em) AS ano, month(ocorrida_em) AS mes
        FROM read_parquet('bruto/*.parquet')
    ) TO 'lake/transacoes'
    (FORMAT parquet, PARTITION_BY (ano, mes), COMPRESSION zstd, OVERWRITE_OR_IGNORE)
""")

# Leitura: o filtro por ano e mês vira poda de partição, só os arquivos do mês são abertos.
mensal = con.execute(
    """
    SELECT conta, sum(valor_centavos) AS total_centavos, count(*) AS quantidade
    FROM read_parquet('lake/transacoes/**/*.parquet', hive_partitioning = true)
    WHERE ano = ? AND mes = ?
    GROUP BY conta
    ORDER BY total_centavos DESC
    """,
    [2026, 10],
).pl()          # resultado como DataFrame Polars, via Arrow`,
    pitfalls: [
      '<strong>Arquivos pequenos demais.</strong> Milhares de Parquet de poucos KB matam a leitura. Compacte em arquivos na casa das centenas de MB.',
      '<strong>Partição com cardinalidade alta.</strong> Particionar por <code>conta</code> gera milhões de diretórios. Particione por data; ordene dentro do arquivo.',
      '<strong>Evolução de esquema sem plano.</strong> Renomear coluna quebra leitores antigos. Versione o contrato e prefira colunas novas opcionais.',
      '<strong>DuckDB como OLTP.</strong> Ele é um motor analítico; escritores concorrentes e transações pequenas e frequentes pedem outro banco.'
    ],
    pitfalls_en: [
      '<strong>Files too small.</strong> Thousands of few-KB Parquet files kill read performance. Compact into files in the hundreds of MB.',
      '<strong>High-cardinality partitions.</strong> Partitioning by <code>account</code> creates millions of directories. Partition by date; sort within the file.',
      '<strong>Schema evolution without a plan.</strong> Renaming a column breaks old readers. Version the contract and prefer new optional columns.',
      '<strong>DuckDB as OLTP.</strong> It is an analytical engine; concurrent writers and small frequent transactions call for another database.'
    ],
    metrics: [
      ['Bytes lidos por consulta', 'deve acompanhar a janela pedida, não o tamanho do lake'],
      ['Partições podadas', 'fração de arquivos ignorados pelo filtro; baixa indica partição mal escolhida'],
      ['Razão de compressão', 'tamanho em disco sobre tamanho lógico, por codec'],
      ['Latência p95 da consulta', 'medida por tipo de consulta, em dado quente e frio']
    ],
    metrics_en: [
      ['Bytes read per query', 'should track the requested window, not the size of the lake'],
      ['Partitions pruned', 'fraction of files skipped by the filter; low means a poorly chosen partition'],
      ['Compression ratio', 'on-disk size over logical size, per codec'],
      ['Query p95 latency', 'measured per query type, on hot and cold data']
    ]
  },

  /* ---------- 05 . Servico e consumo ---------- */
  {
    title: 'Serviço e consumo', title_en: 'Serving and consumption',
    sub: 'FastAPI na frente, read models por CQRS e cache para as consultas quentes.',
    sub_en: 'FastAPI in front, CQRS read models and a cache for hot queries.',
    tags: [{k:'envc',t:'API'},{k:'dsp',t:'CQRS'}],
    purpose: 'Quem consulta não deve pagar o custo de quem escreve. Com <strong>CQRS</strong>, o lado de escrita mantém o modelo de domínio e o lado de leitura expõe <em>read models</em> já agregados (o resumo diário por conta), otimizados para a pergunta. A API <strong>FastAPI</strong> só traduz HTTP para chamadas de uma camada de serviço; as dependências entram por <code>Depends</code>, o que torna trocar o leitor em teste uma linha. O <strong>cache</strong> entra como decorator sobre a mesma porta, sem o endpoint saber.',
    purpose_en: 'Whoever reads should not pay the cost of whoever writes. With <strong>CQRS</strong>, the write side keeps the domain model and the read side exposes already-aggregated <em>read models</em> (the daily summary per account), optimized for the question. The <strong>FastAPI</strong> app only translates HTTP into calls to a service layer; dependencies enter through <code>Depends</code>, which makes swapping the reader in a test a one-liner. The <strong>cache</strong> enters as a decorator over the same port, without the endpoint knowing.',
    flow: ['HTTP', 'FastAPI + Depends', 'camada de serviço', 'read model (cache)', 'DuckDB / Parquet'],
    patterns: [
      { name: 'FastAPI e contratos', id: 'fastapi-servicos', note: 'schemas Pydantic, injeção por <code>Depends</code>, OpenAPI gerado do código.', note_en: 'Pydantic schemas, injection via <code>Depends</code>, OpenAPI generated from the code.' },
      { name: 'CQRS e read models', id: 'cqrs-event-sourcing', note: 'modelos de leitura separados do modelo de escrita, cada um otimizado para o seu uso.', note_en: 'read models separated from the write model, each optimized for its own use.' },
      { name: 'Service layer', id: 'service-layer', note: 'casos de uso fora do controller: a regra não depende do framework web.', note_en: 'use cases outside the controller: the rule does not depend on the web framework.' },
      { name: 'Decorator para cache', id: 'decorator-pattern', note: 'um leitor que embrulha outro e guarda resultados, mesma interface.', note_en: 'a reader that wraps another and stores results, same interface.' },
      { name: 'Injeção de dependência', id: 'injecao-dependencia', note: 'a composição acontece em um só lugar, na raiz da aplicação.', note_en: 'composition happens in a single place, at the application root.' }
    ],
    code: `import time
from datetime import date
from typing import Annotated, Protocol

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


class ResumoConta(BaseModel):
    conta: str
    total_centavos: int
    quantidade: int


class LeitorResumos(Protocol):
    async def obter(self, conta: str, dia: date) -> ResumoConta | None: ...


class LeitorComCache:
    """Decorator: mesma interface do leitor real, com TTL em memória."""

    def __init__(self, interno: LeitorResumos, ttl_s: float = 30.0) -> None:
        self._interno = interno
        self._ttl = ttl_s
        self._cache: dict[tuple[str, date], tuple[float, ResumoConta | None]] = {}

    async def obter(self, conta: str, dia: date) -> ResumoConta | None:
        chave = (conta, dia)
        achado = self._cache.get(chave)
        if achado and time.monotonic() - achado[0] < self._ttl:
            return achado[1]
        valor = await self._interno.obter(conta, dia)
        self._cache[chave] = (time.monotonic(), valor)
        return valor


def leitor() -> LeitorResumos:
    # raiz de composição: aqui entra o adapter real (DuckDB sobre o lake)
    raise NotImplementedError


@app.get("/contas/{conta}/resumo/{dia}", response_model=ResumoConta)
async def resumo(
    conta: str, dia: date, leitor: Annotated[LeitorResumos, Depends(leitor)]
) -> ResumoConta:
    achado = await leitor.obter(conta, dia)
    if achado is None:
        raise HTTPException(status_code=404, detail="sem movimento no dia")
    return achado`,
    pitfalls: [
      '<strong>Consulta bloqueante em endpoint async.</strong> Rodar DuckDB ou Polars direto em <code>async def</code> trava o loop. Use <code>def</code> (thread pool do FastAPI) ou <code>asyncio.to_thread</code>.',
      '<strong>Cache sem invalidação.</strong> TTL curto é honesto; cache eterno vira dado errado. Defina a defasagem aceitável do read model.',
      '<strong>Cache em memória por processo.</strong> Com vários workers, cada um tem o seu. Para compartilhar, use Redis.',
      '<strong>CQRS sem necessidade.</strong> Dois modelos custam consistência eventual e mais código. Só vale quando leitura e escrita têm formas e cargas diferentes.'
    ],
    pitfalls_en: [
      '<strong>Blocking query in an async endpoint.</strong> Running DuckDB or Polars directly inside <code>async def</code> stalls the loop. Use <code>def</code> (FastAPI thread pool) or <code>asyncio.to_thread</code>.',
      '<strong>Cache without invalidation.</strong> A short TTL is honest; an eternal cache becomes wrong data. Define the staleness the read model may have.',
      '<strong>Per-process in-memory cache.</strong> With several workers, each has its own. To share, use Redis.',
      '<strong>CQRS without need.</strong> Two models cost eventual consistency and more code. It only pays off when reads and writes have different shapes and loads.'
    ],
    metrics: [
      ['Latência p50, p95 e p99', 'por rota; o p99 é o que o usuário sente nos piores dias'],
      ['Taxa de acerto do cache', 'hit ratio por rota; baixo indica chave ruim ou TTL curto demais'],
      ['Defasagem do read model', 'tempo entre o evento e a visibilidade na consulta'],
      ['Taxa de erro 5xx', 'contra o SLO, com orçamento de erro explícito']
    ],
    metrics_en: [
      ['p50, p95 and p99 latency', 'per route; p99 is what the user feels on the worst days'],
      ['Cache hit ratio', 'per route; low means a bad key or too short a TTL'],
      ['Read model staleness', 'time between the event and its visibility in queries'],
      ['5xx error rate', 'against the SLO, with an explicit error budget']
    ]
  }
];

/* ---------- Arquitetura em producao: AWS ---------- */
window.ARCH_AWS = {
  layers: [
    { t: 'Ingestão', t_en: 'Ingestion',
      d: '<b>API Gateway</b> ou <b>ALB</b> na borda e <b>Kinesis Data Streams</b> (ou <b>Amazon MSK</b>) como buffer durável. Os consumidores asyncio rodam em <b>ECS Fargate</b> e escalam pelo atraso do stream.',
      d_en: '<b>API Gateway</b> or an <b>ALB</b> at the edge and <b>Kinesis Data Streams</b> (or <b>Amazon MSK</b>) as the durable buffer. The asyncio consumers run on <b>ECS Fargate</b> and scale on stream lag.' },
    { t: 'Validação e domínio', t_en: 'Validation and domain',
      d: 'Container Python no <b>Fargate</b> com Pydantic na borda e o núcleo hexagonal. Evento inválido vai para uma fila <b>SQS</b> de dead-letter e um bucket de quarentena, com alarme.',
      d_en: 'Python container on <b>Fargate</b> with Pydantic at the edge and the hexagonal core. An invalid event goes to an <b>SQS</b> dead-letter queue and a quarantine bucket, with an alarm.' },
    { t: 'Processamento', t_en: 'Processing',
      d: 'Jobs Polars em <b>AWS Batch</b> ou tarefas ECS agendadas por <b>EventBridge</b> e <b>Step Functions</b>. Quando o volume pede cluster, <b>EMR Serverless</b> com PySpark.',
      d_en: 'Polars jobs on <b>AWS Batch</b> or ECS tasks scheduled by <b>EventBridge</b> and <b>Step Functions</b>. When volume calls for a cluster, <b>EMR Serverless</b> with PySpark.' },
    { t: 'Armazenamento', t_en: 'Storage',
      d: '<b>S3</b> com Parquet particionado por data, <b>Glue Data Catalog</b> para o esquema e <b>Athena</b> para SQL ad hoc. <b>Lake Formation</b> controla acesso por tabela e coluna.',
      d_en: '<b>S3</b> with date-partitioned Parquet, the <b>Glue Data Catalog</b> for the schema and <b>Athena</b> for ad hoc SQL. <b>Lake Formation</b> controls access by table and column.' },
    { t: 'Serviço e consumo', t_en: 'Serving and consumption',
      d: 'API <b>FastAPI</b> em <b>ECS Fargate</b> atrás de um ALB. Read models em <b>DynamoDB</b> ou <b>Aurora PostgreSQL</b>; cache quente em <b>ElastiCache</b> (Redis).',
      d_en: '<b>FastAPI</b> app on <b>ECS Fargate</b> behind an ALB. Read models in <b>DynamoDB</b> or <b>Aurora PostgreSQL</b>; hot cache in <b>ElastiCache</b> (Redis).' },
    { t: 'Segurança', t_en: 'Security',
      d: '<b>IAM</b> com privilégio mínimo por serviço, <b>KMS</b> para criptografia, <b>Secrets Manager</b> para credenciais e <b>VPC endpoints</b> para o tráfego não sair para a internet.',
      d_en: '<b>IAM</b> with least privilege per service, <b>KMS</b> for encryption, <b>Secrets Manager</b> for credentials and <b>VPC endpoints</b> so traffic never leaves for the internet.' },
    { t: 'Observabilidade', t_en: 'Observability',
      d: '<b>OpenTelemetry</b> (via AWS Distro) para traces, <b>CloudWatch</b> para métricas, logs estruturados e alarmes ligados aos SLOs, <b>X-Ray</b> para ver o caminho da requisição.',
      d_en: '<b>OpenTelemetry</b> (via the AWS Distro) for traces, <b>CloudWatch</b> for metrics, structured logs and SLO-based alarms, <b>X-Ray</b> to see the request path.' },
    { t: 'Entrega contínua', t_en: 'Continuous delivery',
      d: 'GitHub Actions ou <b>CodePipeline</b> e <b>CodeBuild</b>: lint, tipos, testes, build da imagem para o <b>ECR</b> e deploy gradual no ECS com rollback automático.',
      d_en: 'GitHub Actions or <b>CodePipeline</b> and <b>CodeBuild</b>: lint, types, tests, image build to <b>ECR</b> and a gradual ECS deploy with automatic rollback.', cicd: true }
  ],
  map: [
    ['Buffer de eventos', 'fila asyncio na borda', 'Kinesis Data Streams / MSK', 'Durabilidade e replay; o consumidor escala pelo atraso'],
    ['Execução dos consumidores', 'workers asyncio', 'ECS Fargate', 'Container sem servidor para operar; escala por métrica'],
    ['Erros e quarentena', 'dead-letter local', 'SQS DLQ + S3', 'Evento ruim não trava o fluxo e fica auditável'],
    ['Orquestração', 'script de lote', 'Step Functions / EventBridge', 'Reprocesso por partição, retry e histórico de execução'],
    ['Processamento pesado', 'Polars + processos', 'AWS Batch / EMR Serverless', 'Computação elástica; sobe só enquanto o job roda'],
    ['Lake analítico', 'Parquet em disco', 'S3 + Glue Catalog + Athena', 'Armazenamento barato, esquema catalogado, SQL sem servidor'],
    ['Cache', 'LeitorComCache em memória', 'ElastiCache (Redis)', 'Cache compartilhado entre todos os workers'],
    ['Segredos e criptografia', 'variáveis de ambiente', 'Secrets Manager + KMS', 'Rotação, auditoria e nada de segredo em imagem'],
    ['Telemetria', 'logs e contadores', 'CloudWatch + X-Ray + ADOT', 'Métricas, traces e alarmes no mesmo lugar']
  ],
  map_en: [
    ['Event buffer', 'asyncio queue at the edge', 'Kinesis Data Streams / MSK', 'Durability and replay; the consumer scales on lag'],
    ['Consumer runtime', 'asyncio workers', 'ECS Fargate', 'Containers with no servers to operate; scales on a metric'],
    ['Errors and quarantine', 'local dead-letter', 'SQS DLQ + S3', 'A bad event does not block the flow and stays auditable'],
    ['Orchestration', 'batch script', 'Step Functions / EventBridge', 'Per-partition reprocessing, retries and execution history'],
    ['Heavy processing', 'Polars + processes', 'AWS Batch / EMR Serverless', 'Elastic compute; it only runs while the job runs'],
    ['Analytical lake', 'Parquet on disk', 'S3 + Glue Catalog + Athena', 'Cheap storage, cataloged schema, serverless SQL'],
    ['Cache', 'in-memory LeitorComCache', 'ElastiCache (Redis)', 'A cache shared across all workers'],
    ['Secrets and encryption', 'environment variables', 'Secrets Manager + KMS', 'Rotation, auditing and no secret baked into an image'],
    ['Telemetry', 'logs and counters', 'CloudWatch + X-Ray + ADOT', 'Metrics, traces and alarms in one place']
  ]
};

/* ---------- Arquitetura em producao: open source / on-prem ---------- */
window.ARCH_OSS = {
  layers: [
    { t: 'Ingestão', t_en: 'Ingestion',
      d: '<b>Apache Kafka</b> (ou <b>Redpanda</b>) como log durável; consumidores com <b>aiokafka</b> ou <b>confluent-kafka</b>, empacotados em containers e escalados no <b>Kubernetes</b>.',
      d_en: '<b>Apache Kafka</b> (or <b>Redpanda</b>) as the durable log; consumers with <b>aiokafka</b> or <b>confluent-kafka</b>, packaged as containers and scaled on <b>Kubernetes</b>.' },
    { t: 'Validação e domínio', t_en: 'Validation and domain',
      d: 'Mesmo núcleo Python do desenho em nuvem: Pydantic na borda, hexagonal por dentro. Eventos rejeitados vão para um tópico de dead-letter no próprio Kafka.',
      d_en: 'The same Python core as the cloud design: Pydantic at the edge, hexagonal inside. Rejected events go to a dead-letter topic in Kafka itself.' },
    { t: 'Processamento', t_en: 'Processing',
      d: '<b>Polars</b> em jobs agendados pelo <b>Airflow</b>, <b>Dagster</b> ou <b>Prefect</b>. Para escalar além de uma máquina, <b>Dask</b>, <b>Ray</b> ou <b>Spark</b> no cluster.',
      d_en: '<b>Polars</b> in jobs scheduled by <b>Airflow</b>, <b>Dagster</b> or <b>Prefect</b>. To scale beyond one machine, <b>Dask</b>, <b>Ray</b> or <b>Spark</b> on the cluster.' },
    { t: 'Armazenamento', t_en: 'Storage',
      d: '<b>MinIO</b> (API S3) com Parquet particionado, opcionalmente com <b>Apache Iceberg</b> para transações e evolução de esquema. <b>DuckDB</b> consulta direto, <b>Trino</b> quando muitos usuários.',
      d_en: '<b>MinIO</b> (S3 API) with partitioned Parquet, optionally with <b>Apache Iceberg</b> for transactions and schema evolution. <b>DuckDB</b> queries directly, <b>Trino</b> when there are many users.' },
    { t: 'Serviço e consumo', t_en: 'Serving and consumption',
      d: '<b>FastAPI</b> com Uvicorn atrás de Nginx ou Traefik. Read models em <b>PostgreSQL</b>; cache em <b>Redis</b> (ou Valkey).',
      d_en: '<b>FastAPI</b> with Uvicorn behind Nginx or Traefik. Read models in <b>PostgreSQL</b>; cache in <b>Redis</b> (or Valkey).' },
    { t: 'Segurança', t_en: 'Security',
      d: '<b>HashiCorp Vault</b> para segredos, TLS mútuo entre serviços, <b>NetworkPolicy</b> do Kubernetes e <b>Keycloak</b> para identidade.',
      d_en: '<b>HashiCorp Vault</b> for secrets, mutual TLS between services, Kubernetes <b>NetworkPolicy</b> and <b>Keycloak</b> for identity.' },
    { t: 'Observabilidade', t_en: 'Observability',
      d: '<b>OpenTelemetry</b> com <b>Prometheus</b> (métricas), <b>Grafana</b> (painéis e alertas), <b>Loki</b> (logs) e <b>Tempo</b> ou <b>Jaeger</b> (traces).',
      d_en: '<b>OpenTelemetry</b> with <b>Prometheus</b> (metrics), <b>Grafana</b> (dashboards and alerts), <b>Loki</b> (logs) and <b>Tempo</b> or <b>Jaeger</b> (traces).' },
    { t: 'Entrega contínua', t_en: 'Continuous delivery',
      d: 'GitLab CI ou GitHub Actions: <b>ruff</b>, <b>mypy</b>, <b>pytest</b>, build da imagem em registry próprio e deploy declarativo com <b>Argo CD</b> e <b>Helm</b>.',
      d_en: 'GitLab CI or GitHub Actions: <b>ruff</b>, <b>mypy</b>, <b>pytest</b>, image build into your own registry and declarative deploy with <b>Argo CD</b> and <b>Helm</b>.', cicd: true }
  ],
  map: [
    ['Buffer de eventos', 'fila asyncio na borda', 'Kafka / Redpanda', 'Log durável com replay e particionamento por chave'],
    ['Execução dos consumidores', 'workers asyncio', 'Kubernetes + HPA/KEDA', 'Escala pelo atraso do consumidor, sem lock-in'],
    ['Erros e quarentena', 'dead-letter local', 'Tópico DLQ no Kafka', 'Mesmo mecanismo do fluxo, reprocessável'],
    ['Orquestração', 'script de lote', 'Airflow / Dagster / Prefect', 'Agendamento, dependências e reprocesso por partição'],
    ['Processamento pesado', 'Polars + processos', 'Dask / Ray / Spark', 'Escala horizontal quando uma máquina não basta'],
    ['Lake analítico', 'Parquet em disco', 'MinIO + Iceberg + DuckDB/Trino', 'Armazenamento compatível com S3 e SQL aberto'],
    ['Cache', 'LeitorComCache em memória', 'Redis / Valkey', 'Cache compartilhado e expiração por TTL'],
    ['Segredos e criptografia', 'variáveis de ambiente', 'Vault + TLS mútuo', 'Segredos dinâmicos e identidade entre serviços'],
    ['Telemetria', 'logs e contadores', 'Prometheus + Grafana + Loki + Tempo', 'Pilha aberta de métricas, logs e traces']
  ],
  map_en: [
    ['Event buffer', 'asyncio queue at the edge', 'Kafka / Redpanda', 'Durable log with replay and key partitioning'],
    ['Consumer runtime', 'asyncio workers', 'Kubernetes + HPA/KEDA', 'Scales on consumer lag, no lock-in'],
    ['Errors and quarantine', 'local dead-letter', 'DLQ topic in Kafka', 'Same mechanism as the main flow, reprocessable'],
    ['Orchestration', 'batch script', 'Airflow / Dagster / Prefect', 'Scheduling, dependencies and per-partition reprocessing'],
    ['Heavy processing', 'Polars + processes', 'Dask / Ray / Spark', 'Horizontal scale when one machine is not enough'],
    ['Analytical lake', 'Parquet on disk', 'MinIO + Iceberg + DuckDB/Trino', 'S3-compatible storage and open SQL'],
    ['Cache', 'in-memory LeitorComCache', 'Redis / Valkey', 'Shared cache with TTL expiry'],
    ['Secrets and encryption', 'environment variables', 'Vault + mutual TLS', 'Dynamic secrets and service-to-service identity'],
    ['Telemetry', 'logs and counters', 'Prometheus + Grafana + Loki + Tempo', 'An open stack for metrics, logs and traces']
  ]
};

/* ---------- Licoes transferiveis ---------- */
(function () {
  var I = function (p) { return '<svg class="vi" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" ><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + p + '</g></svg>'; };
  window.PRINCIPLES = [
    { icon: I('<circle cx="12" cy="12" r="8.4"/><path d="M12 7.5v5l3 2"/>'),
      title: 'Meça antes de otimizar', title_en: 'Measure before optimizing',
      desc: 'O gargalo quase nunca está onde a intuição aponta. <b>Perfil primeiro</b> (cProfile, py-spy, memray), hipótese depois, mudança por último. Otimização sem medição é só código mais difícil de ler.',
      desc_en: 'The bottleneck is almost never where intuition points. <b>Profile first</b> (cProfile, py-spy, memray), hypothesis second, change last. Optimization without measurement is just code that is harder to read.',
      tag: 'estágios 01, 03 · profiling', tag_en: 'stages 01, 03 · profiling' },
    { icon: I('<path d="M4 7h16M4 12h16M4 17h10"/>'),
      title: 'Escolha o modelo de concorrência pelo gargalo', title_en: 'Pick the concurrency model by the bottleneck',
      desc: 'I/O-bound pede <b>asyncio</b>, CPU-bound pede <b>processos</b> ou um motor vetorizado, código C que solta o GIL pede <b>threads</b>. Misturar sem saber qual é o gargalo é o erro mais comum.',
      desc_en: 'I/O-bound calls for <b>asyncio</b>, CPU-bound calls for <b>processes</b> or a vectorized engine, C code that releases the GIL calls for <b>threads</b>. Mixing them without knowing the bottleneck is the most common mistake.',
      tag: 'estágios 01, 03 · concorrência', tag_en: 'stages 01, 03 · concurrency' },
    { icon: I('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>'),
      title: 'Dependências apontam para dentro', title_en: 'Dependencies point inward',
      desc: 'O núcleo conhece só abstrações que ele mesmo define. <b>Frameworks, bancos e filas</b> são detalhes substituíveis na borda. É o que deixa testar a regra de negócio em milissegundos.',
      desc_en: 'The core knows only abstractions it defines itself. <b>Frameworks, databases and queues</b> are replaceable details at the edge. That is what lets you test business rules in milliseconds.',
      tag: 'estágio 02 · hexagonal, DIP', tag_en: 'stage 02 · hexagonal, DIP' },
    { icon: I('<path d="M5 4h14v16H5z"/><path d="M9 9h6M9 13h6M9 17h3"/>'),
      title: 'Valide na borda, confie no núcleo', title_en: 'Validate at the edge, trust the core',
      desc: 'Dado externo entra por <b>um funil</b> que valida e converte para tipos de domínio. Dali em diante, o código pode assumir invariantes em vez de revalidar a cada função.',
      desc_en: 'External data enters through <b>one funnel</b> that validates and converts to domain types. From there on, code can assume invariants instead of revalidating in every function.',
      tag: 'estágio 02 · Pydantic', tag_en: 'stage 02 · Pydantic' },
    { icon: I('<path d="M4 6h16v4H4zM4 14h16v4H4z"/><path d="M8 8h.01M8 16h.01"/>'),
      title: 'O formato é metade da performance', title_en: 'The format is half the performance',
      desc: 'Dado colunar, tipado e particionado (<b>Parquet</b> e <b>Arrow</b>) vence qualquer micro-otimização de laço. Escolher o layout certo reduz o que se lê antes de qualquer cálculo começar.',
      desc_en: 'Columnar, typed, partitioned data (<b>Parquet</b> and <b>Arrow</b>) beats any loop micro-optimization. Choosing the right layout shrinks what is read before any computation starts.',
      tag: 'estágios 03, 04 · dados', tag_en: 'stages 03, 04 · data' },
    { icon: I('<path d="M12 20v-7"/><path d="M12 13c-4 0-6.4-2.4-6.4-6.4C10 7 12 9 12 13z"/><path d="M12 15c0-3 2-5 5.4-5.4C17.4 13 15.4 15 12 15z"/>'),
      title: 'Padrão só quando a dor justifica', title_en: 'A pattern only when the pain justifies it',
      desc: 'Em Python, muito padrão do GoF vira <b>uma função, um dict de callables ou um Protocol</b>. CQRS, hexagonal e microsserviços custam complexidade: adote quando o problema aparecer, não antes.',
      desc_en: 'In Python, many GoF patterns collapse into <b>a function, a dict of callables or a Protocol</b>. CQRS, hexagonal and microservices cost complexity: adopt them when the problem shows up, not before.',
      tag: 'estágio 05 · pragmatismo', tag_en: 'stage 05 · pragmatism' }
  ];
})();
