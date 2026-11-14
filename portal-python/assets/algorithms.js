/* Catálogo de padrões e técnicas de Python, fichas técnicas
   Schema de cada item de window.ALGORITHMS:
   {
     id, name, paradigm, tag, idea, long, math, tags: [], use: [], skip: [], also,
     fw: [{q, a}] // 10 dimensões, as mesmas perguntas em todas as fichas
   }
   paradigm (ids de cor mantidos): supervised = Criacionais, unsupervised = Estruturais,
   semi = Comportamentais, self = Arquiteturais, rl = Concorrência e performance.
   math = a assinatura do padrão em uma linha. */

(function () {
  var FW_Q = [
    'Que problema resolve?',
    'Quais são os participantes?',
    'Qual a forma pythônica?',
    'Quando falha ou vira overengineering?',
    'Qual o custo (complexidade, indireção, performance)?',
    'Como testar?',
    'Exemplo real (stdlib ou lib famosa)?',
    'Qual a relação com SOLID?',
    'Padrões vizinhos e confusões comuns?',
    'Como explicar em entrevista?'
  ];

  var LIST = [];
  function P(id, name, paradigm, tag, idea, long, sig, tags, use, skip, also, ans) {
    LIST.push({
      id: id, name: name, paradigm: paradigm, tag: tag, idea: idea, long: long, math: sig,
      tags: tags, use: use, skip: skip, also: also,
      fw: FW_Q.map(function (q, i) { return { q: q, a: ans[i] }; })
    });
  }

  /* =================== CRIACIONAIS =================== */
  P('singleton', 'Singleton', 'supervised', 'Criacional · Instância única',
    'Garante uma única instância de uma classe e um ponto global de acesso.',
    'O padrão mais famoso e o mais abusado. Em Python, quase sempre um módulo já resolve, porque o módulo é importado uma vez e vira singleton de graça.',
    'Client → get_instance() → _instance (única por processo)',
    ['criacional', 'estado global', 'módulo'],
    ['Recurso realmente único por processo (pool de conexões, registry de configuração)', 'Cache compartilhado de leitura', 'Objeto caro de criar e imutável depois de pronto', 'Quando um módulo com estado de módulo não basta'],
    ['Quando serve só para evitar passar parâmetro (estado global disfarçado)', 'Código que precisa de testes isolados sem reset manual', 'Ambientes com vários processos ou workers (cada um terá a sua instância)', 'Quando injeção de dependência resolve o mesmo problema'],
    'Módulo como singleton, Borg (estado compartilhado), Registry, Dependency Injection.',
    [
      'Evita criar várias instâncias de algo que deve ser único (config, pool, logger raiz) e dá acesso a ela sem passar referência por toda a pilha.',
      'A classe singleton, o atributo de classe que guarda a instância e o ponto de acesso (get_instance, __new__ ou o próprio import do módulo).',
      'Usar um módulo: o import executa uma vez e o namespace do módulo é a instância. Alternativas: functools.cache sobre uma função de fábrica, ou __new__ com atributo de classe. Metaclasse é a opção mais pesada.',
      'Vira estado global mutável: acoplamento escondido, testes que vazam estado entre si e condições de corrida na criação lazy sem lock. Em multiprocessing e gunicorn, cada processo tem a sua cópia, então "único" é só por processo.',
      'Custo de execução quase zero. O custo real é de design: dependência oculta, difícil de substituir em teste e difícil de ler (quem mexeu nisso?).',
      'Injete a dependência nos testes em vez de importar o global; se for inevitável, forneça um reset (fixture que limpa o atributo de classe ou monkeypatch no módulo) e teste a criação concorrente com threads.',
      'logging.getLogger(name) devolve sempre a mesma instância por nome; o módulo sys, os valores None, True e Ellipsis; settings do Django (django.conf.settings, objeto lazy único).',
      'Viola SRP (controla a própria instância além de fazer o trabalho) e dificulta DIP, porque os clientes dependem da classe concreta global em vez de uma abstração injetada.',
      'Confunde-se com Borg (várias instâncias, um estado), com Registry (muitos objetos nomeados) e com simples variável global. Fábrica com cache é a versão mais honesta.',
      'Diga: "garante uma instância, mas em Python eu uso um módulo ou injeto uma instância criada no composition root. Singleton clássico com metaclasse é raro e eu justifico". Cite o problema de testes e de multiprocessamento.'
    ]);

  P('factory-method', 'Factory Method', 'supervised', 'Criacional · Delegação de criação',
    'Define uma interface de criação e deixa a subclasse (ou a função) decidir qual objeto instanciar.',
    'Separa o código que usa um produto do código que sabe qual classe concreta construir. Em Python, uma função que devolve objetos costuma bastar.',
    'Client → creator.create() → Product concreto',
    ['criacional', 'polimorfismo', 'função de fábrica'],
    ['Quando o cliente não deve conhecer a classe concreta', 'Quando a escolha do tipo depende de configuração ou entrada', 'Frameworks que deixam o usuário estender o que é criado', 'Classmethods como construtores alternativos (from_json, from_env)'],
    ['Quando só existe uma classe concreta e nada indica que haverá outra', 'Quando um dict de classes resolve em duas linhas', 'Hierarquias paralelas (Creator e Product) sem necessidade real', 'Quando o construtor com argumentos nomeados já é claro'],
    'Abstract Factory, Builder, classmethod como construtor alternativo, Registry.',
    [
      'Desacopla quem usa o objeto de quem decide a classe concreta, permitindo trocar ou estender produtos sem mexer no cliente.',
      'Product (interface), ConcreteProduct, Creator com o factory method e ConcreteCreator que o sobrescreve. O cliente fala só com Creator e Product.',
      'Uma função create_parser(fmt) que consulta um dict {nome: classe}, ou @classmethod como construtor alternativo (dict.fromkeys, datetime.fromisoformat). Classes são objetos de primeira classe, então passar a classe já é uma fábrica.',
      'Vira overengineering quando cria uma hierarquia de Creators para instanciar duas classes. Outro sinal: if/elif gigante dentro da fábrica que ninguém consegue estender sem editar (use registry).',
      'Uma chamada de função a mais, desprezível. A indireção extra é o custo de leitura: o leitor precisa descobrir qual classe sai de onde.',
      'Teste a fábrica com a tabela entrada → tipo esperado (parametrize) e teste os produtos isoladamente. No cliente, injete uma fábrica falsa que devolve um dublê.',
      'pathlib.Path(...) devolve PosixPath ou WindowsPath conforme o SO; dict.fromkeys, int.from_bytes, datetime.fromtimestamp; logging.getLogger; SQLAlchemy create_engine escolhendo o dialeto pela URL.',
      'OCP: novos produtos entram sem alterar o cliente. DIP: o cliente depende da abstração do produto. Com if/elif central, a fábrica continua violando OCP.',
      'Abstract Factory cria famílias de objetos; Factory Method cria um objeto e usa herança; Builder monta passo a passo; "Simple Factory" (função com if) nem é padrão do GoF.',
      'Diga: "centralizo a decisão de qual classe criar para o cliente depender só do contrato. Em Python costuma ser uma função ou um classmethod, não uma hierarquia de Creators". Mostre um exemplo de classmethod.'
    ]);

  P('abstract-factory', 'Abstract Factory', 'supervised', 'Criacional · Famílias de objetos',
    'Cria famílias de objetos relacionados sem acoplar o cliente às classes concretas.',
    'Garante que produtos que devem andar juntos (tema escuro: botão, janela, ícone) sejam criados consistentes entre si.',
    'Client → factory.create_a() / create_b() → família concreta',
    ['criacional', 'famílias', 'consistência'],
    ['Conjuntos de objetos que precisam combinar (drivers de um mesmo banco, widgets de um mesmo tema)', 'Trocar uma família inteira por configuração', 'Testes com uma família de dublês', 'Portabilidade entre plataformas ou provedores'],
    ['Quando há só um produto (use Factory Method ou função)', 'Quando as famílias não precisam ser consistentes entre si', 'Quando um dict de fábricas ou um módulo por backend resolve', 'Quando adicionar um novo tipo de produto força mexer em todas as fábricas'],
    'Factory Method, Builder, Prototype, Dependency Injection.',
    [
      'Entrega objetos de uma família coerente (por exemplo, repositório, unit of work e serializer de um mesmo backend) sem expor classes concretas e sem misturar famílias.',
      'AbstractFactory com um método por produto, ConcreteFactory por família, AbstractProduct por tipo e ConcreteProduct por família e tipo. O cliente só enxerga as abstrações.',
      'Uma classe ou um Protocol com métodos que devolvem produtos; ou, mais simples, um módulo por família com os mesmos nomes (duck typing), escolhido por importlib. Também funciona uma dataclass com callables como campos.',
      'Adicionar um tipo novo de produto obriga a editar todas as fábricas (a dimensão que o padrão torna rígida). Overengineering quando existe uma família só ou quando as famílias nunca variam em runtime.',
      'Muitas classes (produtos x famílias) e uma camada de indireção. Em runtime o custo é irrisório.',
      'Teste cada fábrica garantindo que todos os produtos da família são compatíveis entre si; no cliente, passe uma fábrica falsa. Um teste de contrato por Protocol vale para todas as famílias.',
      'Django database backends (cada backend traz conexão, cursor e introspecção do mesmo banco); a DB-API 2.0 (módulos sqlite3, psycopg com a mesma forma); matplotlib backends.',
      'OCP para novas famílias; DIP porque o cliente depende de abstrações. Pode violar OCP e ISP quando a fábrica abstrata cresce demais.',
      'Factory Method cria um produto via herança; Abstract Factory cria uma família via composição de objetos. Builder foca em montar um objeto complexo, não em famílias.',
      'Diga: "uma fábrica de fábricas não, uma fábrica de famílias: garante que os objetos criados combinam entre si". Dê o exemplo de backends de banco e admita que em Python um módulo por backend costuma bastar.'
    ]);

  P('builder', 'Builder', 'supervised', 'Criacional · Construção em passos',
    'Separa a construção de um objeto complexo da sua representação, montando por etapas.',
    'Resolve o construtor telescópico. Em Python, argumentos nomeados, dataclasses e valores padrão cobrem a maior parte dos casos.',
    'Director → builder.set_a().set_b().build() → Product',
    ['criacional', 'fluent', 'objeto complexo'],
    ['Objetos com muitos parâmetros opcionais e validação entre eles', 'Montagem em etapas (consulta SQL, request HTTP, pipeline)', 'Quando o mesmo processo gera representações diferentes', 'Objetos imutáveis que só ficam válidos no build()'],
    ['Quando kwargs com defaults e uma dataclass resolvem', 'Objetos simples com poucos campos', 'Quando o builder só repete os campos do produto', 'Quando a ordem dos passos não importa e não há validação'],
    'Factory Method, Fluent Interface, dataclasses com replace(), Prototype.',
    [
      'Constrói objetos com muitos parâmetros opcionais ou etapas ordenadas, validando o conjunto no final e evitando construtores com dez argumentos.',
      'Builder (com os passos), ConcreteBuilder, Product e, opcionalmente, Director que conhece a receita. O cliente chama os passos e depois build().',
      'Argumentos só-nomeados com defaults e dataclass(frozen=True, kw_only=True); dataclasses.replace() para variações; para fluent, métodos que devolvem self ou uma cópia. SQLAlchemy e pandas usam encadeamento de método.',
      'Overengineering quando o produto tem cinco campos e o builder duplica todos. Falha também quando o builder mutável é reutilizado e vaza estado entre builds.',
      'Alocação extra do builder e um método por campo. Para objetos grandes montados em loop, o custo pode aparecer; meça antes de se preocupar.',
      'Teste o build() com combinações válidas e inválidas (a validação é o ponto), a imutabilidade do produto e que dois builds seguidos não compartilham estado.',
      'SQLAlchemy select().where().order_by(); pathlib e urllib.parse.urlunparse; Pydantic model_validate; subprocess.run com kwargs; argparse monta o parser por chamadas sucessivas.',
      'SRP: separa montar de usar. OCP: novos builders sem tocar o produto. Mas o builder pode acumular responsabilidades se cada variante exigir um método novo.',
      'Factory cria de uma vez; Builder cria por passos. Prototype clona. Fluent Interface é uma técnica de API que o Builder costuma usar, mas não é o mesmo padrão.',
      'Diga: "uso Builder quando a criação tem passos ou validação cruzada; senão, kwargs e dataclass". Mencione que SQLAlchemy usa a ideia e que o produto final deve ser imutável.'
    ]);

  P('prototype', 'Prototype', 'supervised', 'Criacional · Clonagem',
    'Cria novos objetos copiando um exemplar existente em vez de instanciar do zero.',
    'Em Python, copy.copy e copy.deepcopy já são o padrão pronto, e __copy__ e __deepcopy__ customizam a clonagem.',
    'Client → prototype.clone() → cópia independente',
    ['criacional', 'copy', 'deepcopy'],
    ['Objetos caros de construir que variam pouco entre si', 'Configurações-base que viram variações', 'Estado inicial de testes (fixtures) clonado por caso', 'Evitar subclasses só para pré-configurar objetos'],
    ['Objetos baratos de criar', 'Grafos com ciclos e recursos externos (sockets, arquivos) sem __deepcopy__ definido', 'Quando a cópia rasa compartilha estado mutável sem querer', 'Quando dataclasses.replace() já resolve'],
    'copy.copy, copy.deepcopy, dataclasses.replace, Memento, Flyweight.',
    [
      'Evita o custo ou a complexidade de montar um objeto do zero, clonando um modelo já configurado e ajustando só o que difere.',
      'Prototype (com clone), ConcretePrototype e o cliente que clona. Opcionalmente, um registro de protótipos nomeados.',
      'copy.copy para cópia rasa, copy.deepcopy para profunda, __copy__ e __deepcopy__ para customizar; dataclasses.replace(obj, campo=novo) para variar imutáveis. Não precisa de interface clone().',
      'Cópia rasa de objeto com listas ou dicts compartilha o estado mutável (o clássico bug). deepcopy falha ou fica lento em objetos com recursos externos, locks e ciclos grandes.',
      'deepcopy é O(tamanho do grafo) e usa memo para ciclos; em objetos grandes pode ser mais lento que reconstruir. Meça com timeit.',
      'Teste que o clone é igual por valor mas distinto por identidade, que mutar o clone não altera o original e que campos mutáveis foram de fato copiados.',
      'copy.deepcopy em toda base de código; dataclasses.replace; pandas DataFrame.copy(deep=True); Django Model com pk=None para clonar registro; dict.copy e list.copy.',
      'OCP leve: novas variações sem novas subclasses. DIP: o cliente clona sem conhecer a classe concreta. O risco é violar encapsulamento ao copiar estado interno.',
      'Memento guarda estado para restaurar; Prototype gera objetos novos. Flyweight compartilha em vez de copiar. Cópia rasa versus profunda é a pegadinha.',
      'Diga: "em Python Prototype é copy e deepcopy, o ponto é saber a diferença entre rasa e profunda". Cite o bug de lista compartilhada entre clones.'
    ]);

  P('registry', 'Registry / Plugin', 'supervised', 'Criacional · Pythônico',
    'Registra classes ou funções por nome (decorator ou __init_subclass__) para criá-las ou despachá-las depois.',
    'O padrão pythônico de extensibilidade: o framework não conhece as extensões, elas se registram ao serem importadas.',
    '@register("nome") → REGISTRY[nome] = cls → REGISTRY[nome]()',
    ['pythonic', 'plugin', 'decorator'],
    ['Plugins e handlers descobertos por nome', 'Fábricas extensíveis sem if/elif central', 'Despacho por tipo de evento ou comando', 'Entry points de pacotes instaláveis'],
    ['Quando a lista de opções é fixa e pequena', 'Quando o registro depende de efeito colateral de import difícil de rastrear', 'Quando o estado global do registro atrapalha testes', 'Quando um dict explícito no composition root é mais claro'],
    'Factory Method, Singleton, Observer, functools.singledispatch, entry points.',
    [
      'Permite que novas implementações se anexem sem editar o código central, trocando if/elif por consulta a um dicionário.',
      'O registro (dict), o mecanismo de registro (decorator, __init_subclass__ ou entry point) e os itens registrados.',
      'Um decorator que insere a classe ou função no dict, ou __init_subclass__ para registrar subclasses automaticamente; importlib.metadata.entry_points para plugins de pacotes de terceiros; functools.singledispatch para despacho por tipo.',
      'Falha quando o módulo com o registro nunca é importado (a extensão some em silêncio), quando há nomes duplicados e quando o estado global suja os testes. Para três opções fixas é overengineering.',
      'Lookup em dict é O(1). O custo está em importar todos os plugins na partida e em depurar quem registrou o quê.',
      'Teste que o decorator registra e rejeita duplicados, e use fixture que salva e restaura o dict global. Teste a descoberta por entry points com um pacote falso.',
      'Flask route() e click.command() registram funções; pytest registra plugins por entry point; Django registra apps e admin.site.register; abc.ABC.register para virtual subclasses.',
      'OCP: é a implementação mais direta, estende sem modificar. Risco leve para DIP se os clientes importarem o registro global em vez de recebê-lo.',
      'Factory Method decide o que criar; Registry guarda as opções. Singleton tem uma instância; o registro costuma ser um singleton de módulo. Service Locator é a versão abusada.',
      'Diga: "o código central não conhece as extensões, elas se registram. Uso decorator ou __init_subclass__, e cuido de garantir o import e de limpar o estado nos testes".'
    ]);

  /* =================== ESTRUTURAIS =================== */
  P('adapter', 'Adapter', 'unsupervised', 'Estrutural · Compatibilidade',
    'Converte a interface de uma classe na interface que o cliente espera.',
    'Permite que código que não foi feito para trabalhar junto trabalhe: o cliente fala com o contrato dele, o adapter traduz para a API alheia.',
    'Client → Target.request() → Adapter → Adaptee.specific_request()',
    ['estrutural', 'integração', 'wrapper'],
    ['Integrar biblioteca de terceiros atrás de um contrato seu', 'Isolar o domínio de um SDK ou API externa', 'Trocar de provedor sem mexer no cliente', 'Código legado com interface incompatível'],
    ['Quando você controla as duas pontas e pode ajustar a interface', 'Quando o adapter só repassa chamadas sem traduzir nada', 'Quando a tradução perde informação essencial', 'Quando um Protocol estrutural já satisfaz o cliente'],
    'Facade, Proxy, Decorator, Bridge, Anti-corruption layer.',
    [
      'Faz duas interfaces incompatíveis conversarem sem alterar nenhuma delas, protegendo o domínio de detalhes de terceiros.',
      'Target (interface que o cliente usa), Adaptee (classe existente com interface diferente), Adapter (traduz) e Client.',
      'Uma classe que recebe o adaptee por composição e implementa o Protocol esperado; ou uma função que converte. Adapter de classe por herança múltipla é possível, mas composição é preferível. Duck typing reduz a necessidade.',
      'Overengineering quando o adapter apenas repassa. Falha quando a tradução é lossy (erros, unidades, paginação) e esconde diferenças importantes de semântica, como timeouts e retries.',
      'Uma chamada extra por operação e uma classe a mais para manter. A conversão de dados pode custar se for pesada.',
      'Teste contratual: o mesmo conjunto de testes roda contra o adapter e contra um fake do Target. Teste a tradução de erros e de tipos com tabelas de entrada e saída.',
      'io.TextIOWrapper adapta bytes para texto; Django storage backends (S3, local) sob a mesma API; SQLAlchemy dialects; requests.adapters.HTTPAdapter; logging.LoggerAdapter.',
      'DIP: o domínio depende do Target, não do SDK. OCP: novos adaptees sem mudar o cliente. SRP: a tradução fica isolada num lugar.',
      'Facade simplifica um subsistema inteiro (interface nova); Adapter converte para uma interface existente. Decorator mantém a mesma interface e acrescenta comportamento. Proxy também mantém a interface.',
      'Diga: "Adapter muda a forma, Decorator muda o comportamento, Facade simplifica". Use o exemplo de embrulhar um SDK de pagamento atrás de um Protocol seu.'
    ]);

  P('bridge', 'Bridge', 'unsupervised', 'Estrutural · Abstração e implementação',
    'Separa a abstração da implementação para que as duas variem de forma independente.',
    'Evita a explosão de subclasses quando há duas dimensões de variação (por exemplo, tipo de notificação x canal de envio).',
    'Abstraction → implementor (composição) → ConcreteImplementor',
    ['estrutural', 'composição', 'duas dimensões'],
    ['Duas hierarquias que variam de forma independente', 'Trocar a implementação em runtime', 'Evitar M x N subclasses', 'Isolar plataforma ou driver por trás de uma abstração estável'],
    ['Quando só uma dimensão varia', 'Quando a abstração e a implementação mudam sempre juntas', 'Quando uma função recebendo um callable resolve', 'Quando o custo de indireção não paga a flexibilidade'],
    'Strategy, Adapter, Abstract Factory, State.',
    [
      'Quando duas dimensões variam (ex.: formato x destino), a herança gera M x N classes; a Bridge troca isso por M + N usando composição.',
      'Abstraction (usa o implementor), RefinedAbstraction, Implementor (interface) e ConcreteImplementor. A ponte é o atributo que referencia o implementor.',
      'A abstração recebe no construtor um objeto que cumpre um Protocol (ou um callable). Na prática: Report(formatter, sink) em vez de PdfEmailReport, CsvFtpReport.',
      'Overengineering quando só existe uma implementação e nenhuma outra prevista. Falha se a interface do implementor for ampla demais e vazar detalhes de uma implementação.',
      'Uma indireção por chamada, desprezível; o custo é o número de peças e a dificuldade de saber qual combinação está montada.',
      'Teste a abstração com um implementor falso e teste cada implementor contra o mesmo contrato. Combinações relevantes entram como casos parametrizados.',
      'logging (Logger como abstração, Handlers como implementação); Django ORM (QuerySet sobre backends de banco); matplotlib (Figure sobre backends de renderização).',
      'OCP e DIP: abstração e implementação evoluem sem se tocar. SRP: cada hierarquia tem um motivo para mudar.',
      'Strategy é parecido na estrutura mas foca em trocar um algoritmo; Bridge desenha desde o início duas hierarquias. Adapter é aplicado depois, para reconciliar; Bridge é planejado antes.',
      'Diga: "Bridge é composição no lugar de herança quando existem dois eixos de variação". Mostre a conta M x N versus M + N.'
    ]);

  P('composite', 'Composite', 'unsupervised', 'Estrutural · Árvore',
    'Compõe objetos em árvores e trata item e grupo pela mesma interface.',
    'O cliente chama uma operação no topo e ela se propaga para os filhos, sem distinguir folha de composto.',
    'Component.op() ← Leaf | Composite(children).op() → child.op()',
    ['estrutural', 'árvore', 'recursão'],
    ['Hierarquias parte-todo (diretórios, menus, AST, organograma)', 'Operações que devem tratar item e grupo igual', 'Árvores de regras ou de validadores', 'UI com widgets aninhados'],
    ['Quando a estrutura é plana', 'Quando folhas e compostos têm operações muito diferentes', 'Quando a interface comum força métodos sem sentido nas folhas', 'Grafos com ciclos (não é árvore)'],
    'Decorator, Iterator, Visitor, Chain of Responsibility.',
    [
      'Trata uniformemente objetos individuais e grupos, permitindo operações recursivas sobre estruturas em árvore.',
      'Component (interface), Leaf (sem filhos), Composite (guarda filhos e delega) e Client.',
      'Uma classe com lista de filhos e o mesmo método da folha, ou duck typing com Protocol; generators com yield from para percorrer. O módulo ast e pathlib.Path.rglob são exemplos de árvores.',
      'Falha quando a interface comum obriga métodos como add() nas folhas, ou quando a recursão profunda estoura o limite (sys.getrecursionlimit). Ciclos geram recursão infinita.',
      'Operações são O(n) no tamanho da árvore; recursão consome pilha. Use iteração explícita para árvores muito profundas.',
      'Monte árvores pequenas à mão, teste a operação em folha, em composto vazio e em composto aninhado, e um caso com ciclo se ele for possível.',
      'ast.AST (nós aninhados); xml.etree.ElementTree.Element; pathlib com diretórios e arquivos; Django forms e formsets; pytest com módulos, classes e funções de teste em árvore.',
      'LSP: folhas e compostos devem ser substituíveis, e é aí que o padrão costuma ferir. OCP: novos tipos de nó sem alterar o cliente.',
      'Decorator tem um único filho e adiciona comportamento; Composite tem vários. Visitor percorre a estrutura que o Composite define. Iterator abstrai o percurso.',
      'Diga: "tratar o todo e a parte da mesma forma por recursão". Dê o exemplo do tamanho de um diretório e fale de limite de recursão.'
    ]);

  P('decorator', 'Decorator', 'unsupervised', 'Estrutural · Comportamento dinâmico',
    'Acrescenta comportamento a um objeto ou função sem alterar seu código, embrulhando-o.',
    'Em Python vira sintaxe de primeira classe com @. Cuidado para não confundir o padrão (objeto embrulhado) com a sintaxe de decorator de função, que implementa a mesma ideia.',
    '@dec → func = dec(func) → wrapper(*args, **kw) chama func',
    ['estrutural', 'pythonic', 'wrapper'],
    ['Logging, cache, retry, autorização, timing sobre funções', 'Empilhar comportamentos combináveis', 'Instrumentar sem tocar o código original', 'Registrar funções (decorator de registro)'],
    ['Quando a ordem de empilhamento é frágil e ninguém documenta', 'Quando perde assinatura e docstring por falta de functools.wraps', 'Quando a lógica de negócio fica escondida em camadas de decorators', 'Quando o comportamento deveria ser explícito na chamada'],
    'Proxy, Adapter, Chain of Responsibility, Composite, Middleware.',
    [
      'Estende comportamento dinamicamente e de forma combinável, sem herança e sem alterar a classe ou a função original.',
      'Component (interface), ConcreteComponent, Decorator (mesma interface, guarda o componente) e ConcreteDecorators. Em função: o decorator, a função embrulhada e o wrapper.',
      'Função que recebe função e devolve função, com @functools.wraps(func) para preservar nome, docstring e __wrapped__. Para parâmetros, uma fábrica de decorators (três níveis). Para classes, __call__. Em 3.12+, a tipagem usa ParamSpec.',
      'Falha quando se esquece functools.wraps, quando a ordem de empilhar altera o resultado (cache antes ou depois do retry?), quando mistura sync e async no mesmo wrapper e quando a depuração fica opaca.',
      'Cada camada adiciona uma chamada e um frame na stack; para código muito quente, o overhead aparece. Decorators de função rodam uma vez na definição, o wrapper roda a cada chamada.',
      'Teste o decorator com uma função trivial e verifique metadados (__name__), exceções propagadas, argumentos repassados e a ordem de empilhamento. Teste a função original via __wrapped__.',
      'functools.lru_cache, cache, wraps, singledispatch; contextlib.contextmanager; @property, @staticmethod, @classmethod; Flask route; tenacity retry; pytest fixtures e marks.',
      'OCP: estende sem modificar. SRP: cada decorator tem uma responsabilidade (cache, log). LSP: o wrapper deve respeitar o contrato da função original.',
      'Proxy controla o acesso ao mesmo objeto; Decorator acrescenta comportamento. Adapter muda a interface. Decorator de função (sintaxe) versus Decorator de objeto (padrão) é a confusão clássica.',
      'Diga: "é um wrapper com a mesma interface que adiciona comportamento; em Python é a sintaxe @. Sempre uso functools.wraps e penso na ordem de empilhamento".'
    ]);

  P('facade', 'Facade', 'unsupervised', 'Estrutural · Interface simplificada',
    'Oferece uma interface simples sobre um subsistema complexo.',
    'Reduz o acoplamento do cliente com muitas classes internas expondo um ponto de entrada pequeno e estável.',
    'Client → Facade.operation() → [SubA, SubB, SubC]',
    ['estrutural', 'simplificação', 'subsistema'],
    ['Esconder um subsistema com muitas peças', 'API de alto nível sobre uma biblioteca complexa', 'Camada de entrada de um módulo ou pacote', 'Quando o cliente precisa só dos casos comuns'],
    ['Quando vira um "deus objeto" que sabe de tudo', 'Quando impede acesso legítimo ao subsistema para casos avançados', 'Quando só repassa chamadas uma a uma', 'Quando o subsistema já tem API limpa'],
    'Adapter, Mediator, Service Layer, Gateway.',
    [
      'O cliente precisa orquestrar muitas classes de um subsistema; a facade oferece operações de alto nível que escondem essa coordenação.',
      'Facade, as classes do subsistema (que não conhecem a facade) e o Client.',
      'Uma função ou classe de módulo que combina chamadas internas; o __init__.py de um pacote reexportando só a API pública (__all__). Muitas vezes é só uma função bem nomeada.',
      'Vira god object que concentra regras e dependências de tudo. Overengineering quando apenas repassa chamadas. Falha se esconde demais e impede o uso avançado.',
      'Uma camada extra de indireção, mas reduz o custo cognitivo. O custo principal é manter a facade sincronizada com o subsistema.',
      'Teste a facade com subsistemas reais (integração) ou dublês; foque no fluxo de alto nível. Os componentes internos têm seus próprios testes.',
      'requests.get sobre urllib3 e http; subprocess.run sobre Popen; shutil.copytree sobre os e stat; logging.basicConfig; pathlib.Path.read_text.',
      'SRP e ISP: o cliente vê só o necessário. DIP em parte, se a facade for uma abstração. Pode ferir SRP se acumular orquestrações demais.',
      'Adapter converte para uma interface esperada; Facade cria uma interface nova mais simples. Mediator coordena pares que se conhecem; Facade é unidirecional. Service Layer é a facade da aplicação.',
      'Diga: "Facade não adiciona capacidade, esconde complexidade com uma API menor". Cite requests ou subprocess.run como exemplo.'
    ]);

  P('flyweight', 'Flyweight', 'unsupervised', 'Estrutural · Compartilhamento',
    'Compartilha estado intrínseco imutável entre muitos objetos para economizar memória.',
    'Útil quando há milhões de objetos pequenos e repetidos. Em Python, __slots__, interning e funções com cache entregam boa parte disso.',
    'Factory.get(key) → Flyweight compartilhado + estado extrínseco externo',
    ['estrutural', 'memória', '__slots__'],
    ['Milhões de objetos com dados repetidos', 'Estado intrínseco imutável e identificável por chave', 'Pressão de memória medida e comprovada', 'Caches de objetos de valor'],
    ['Quando a memória não é problema medido', 'Quando o estado compartilhado é mutável', 'Quando o ganho some com complexidade de extrair o estado extrínseco', 'Quando __slots__ ou arrays numéricos resolvem'],
    'Singleton, Object Pool, Memoization, interning, __slots__.',
    [
      'Reduz memória quando muitas instâncias têm a maior parte do estado repetido, compartilhando essa parte entre elas.',
      'Flyweight (estado intrínseco, imutável), FlyweightFactory (cache por chave), Context (estado extrínseco) e Client.',
      'Uma fábrica com dict ou functools.cache que devolve a mesma instância imutável por chave; __slots__ para tirar o dict por instância; sys.intern para strings; tuplas e frozen dataclasses como valores compartilháveis.',
      'Falha se o estado compartilhado for mutável (um cliente altera e afeta os outros) ou se a memória não era o gargalo. A fábrica com cache sem limite vira vazamento.',
      'Troca memória por CPU e complexidade (lookup na fábrica, estado extrínseco passado nos métodos). Meça com tracemalloc ou sys.getsizeof para confirmar o ganho.',
      'Teste que a mesma chave devolve o mesmo objeto (is), que o estado é imutável e meça memória antes e depois com tracemalloc em um caso representativo.',
      'sys.intern e o interning de strings e ints pequenos (-5 a 256) em CPython; __slots__ em classes numerosas; re.compile com cache interno; enum members como instâncias únicas.',
      'SRP: separa estado compartilhado do contextual. A imutabilidade dos flyweights é o que preserva LSP e evita surpresas.',
      'Singleton tem uma instância total; Flyweight tem uma por chave. Memoization cacheia resultados; Flyweight cacheia objetos. Object Pool reutiliza objetos mutáveis.',
      'Diga: "compartilho o que se repete e é imutável, passo o que varia de fora". Cite __slots__ e sys.intern e fale de medir com tracemalloc.'
    ]);

  P('proxy', 'Proxy', 'unsupervised', 'Estrutural · Substituto',
    'Fornece um substituto que controla o acesso a outro objeto, com a mesma interface.',
    'Variantes: virtual (lazy), proteção (autorização), remoto (RPC), cache e logging. Python facilita com __getattr__ e descriptors.',
    'Client → Proxy (mesma interface) → RealSubject',
    ['estrutural', 'lazy', 'controle de acesso'],
    ['Carregamento lazy de objeto caro', 'Controle de acesso ou auditoria', 'Cache transparente sobre uma chamada lenta', 'Representante local de um serviço remoto'],
    ['Quando a indireção esconde custo de rede como se fosse chamada local', 'Quando __getattr__ dinâmico quebra autocomplete e tipagem', 'Quando um decorator de função resolve', 'Quando o proxy muda o contrato sem avisar'],
    'Decorator, Adapter, Facade, Lazy evaluation.',
    [
      'Controla o acesso a um objeto (criação tardia, permissão, cache, chamada remota) sem que o cliente perceba a diferença.',
      'Subject (interface), RealSubject, Proxy (mesma interface, guarda referência ao real) e Client.',
      'Uma classe que delega via __getattr__, ou um descriptor/property para lazy; functools.cached_property para carga tardia; weakref.proxy para referências fracas; unittest.mock como proxy de teste.',
      'Falha quando o proxy esconde latência de rede, quando __getattr__ não cobre métodos dunder (len, iter) e quando erros do remoto parecem erros locais. Overengineering se um decorator basta.',
      'Cada chamada paga uma indireção e eventual lógica do proxy. Em proxies remotos, o custo dominante é a rede, não o proxy.',
      'Teste o comportamento controlado (acesso negado, lazy só carrega uma vez, cache hit e miss) e que o contrato do Subject é mantido. Use um RealSubject falso que conta chamadas.',
      'weakref.proxy; multiprocessing.managers (proxy de objetos remotos); xmlrpc.client.ServerProxy; ORM com lazy loading (SQLAlchemy relationships); werkzeug LocalProxy no Flask (request).',
      'LSP: o proxy deve ser substituível pelo real. SRP: o controle de acesso fica fora do objeto real. OCP: nova política sem mexer no real.',
      'Decorator adiciona funcionalidade; Proxy controla acesso, geralmente com ciclo de vida do real. Adapter muda a interface. Façade simplifica vários objetos.',
      'Diga: "mesma interface, mas controlo se, quando e como o objeto real é usado". Dê lazy loading e controle de acesso como exemplos.'
    ]);

  P('descriptor', 'Descriptor', 'unsupervised', 'Estrutural · Idioma pythônico',
    'Objeto com __get__, __set__ ou __delete__ que controla o acesso a um atributo de outra classe.',
    'É o mecanismo por trás de property, métodos, classmethod, staticmethod e __slots__. Entender descriptors explica a linguagem.',
    'class D: __get__(self, obj, type) / __set__(self, obj, value)',
    ['pythonic', 'atributos', 'protocolo'],
    ['Validação reutilizável de atributos em várias classes', 'Campos de ORM e de modelos declarativos', 'Atributos computados e lazy (cached_property)', 'Quando property se repetiria demais'],
    ['Quando uma property simples basta', 'Quando a mágica confunde mais que ajuda', 'Estado guardado no descriptor em vez de na instância (vazamento entre instâncias)', 'Código que precisa de máxima legibilidade para iniciantes'],
    'property, __getattr__, Proxy, Decorator, dataclass fields.',
    [
      'Reaproveita a lógica de acesso a atributos (validação, conversão, lazy) em muitas classes sem repetir properties.',
      'A classe dona do atributo, o descriptor (atributo de classe com __get__/__set__/__delete__/__set_name__) e a instância que o acessa.',
      'Implementar __set_name__ para saber o nome do atributo e guardar o valor no __dict__ da instância (não no descriptor). Data descriptors (com __set__) têm prioridade sobre o __dict__; non-data (só __get__) perdem para ele.',
      'Falha ao guardar valor no próprio descriptor (compartilhado entre instâncias) ou ao esquecer o caso obj is None (acesso pela classe). Overengineering quando uma property resolve.',
      'O acesso passa por uma chamada de método Python a mais; em hot paths pode custar. cached_property troca esse custo por uma única avaliação.',
      'Teste leitura, escrita, deleção, acesso pela classe, independência entre instâncias e mensagens de validação.',
      'property, classmethod, staticmethod, functions (métodos ligados são descriptors); functools.cached_property; Django model fields; SQLAlchemy InstrumentedAttribute; dataclasses fields.',
      'SRP e DRY: a regra de acesso fica num lugar. OCP: novas regras como novos descriptors. Pode ferir o princípio da menor surpresa.',
      'property é um descriptor pronto; __getattr__ só é chamado quando o atributo não existe; __getattribute__ intercepta tudo. Proxy delega um objeto inteiro, descriptor controla um atributo.',
      'Diga: "descriptor é o protocolo que faz métodos e properties funcionarem". Explique data versus non-data descriptor e a ordem de busca de atributos.'
    ]);

  /* =================== COMPORTAMENTAIS =================== */
  P('chain-of-responsibility', 'Chain of Responsibility', 'semi', 'Comportamental · Cadeia de handlers',
    'Passa a requisição por uma cadeia de handlers até que um a trate.',
    'Desacopla quem envia de quem processa. É a base de middlewares, filtros e pipelines de validação.',
    'request → h1 → h2 → h3 (cada um trata ou repassa)',
    ['comportamental', 'middleware', 'pipeline'],
    ['Vários objetos podem tratar a requisição e o tratador não é conhecido antes', 'Middlewares de web (auth, log, CORS)', 'Pipelines de validação ou de enriquecimento', 'Escalonamento (suporte nível 1, 2, 3)'],
    ['Quando um dict de despacho resolve', 'Quando a requisição pode ficar sem tratador e ninguém percebe', 'Quando a ordem importa e é frágil', 'Quando a cadeia fica profunda e difícil de depurar'],
    'Decorator, Command, Composite, Middleware, Pipeline.',
    [
      'Evita acoplar o emissor a um receptor específico, deixando vários handlers com chance de processar o pedido em sequência.',
      'Handler (interface com handle e referência ao próximo), ConcreteHandlers e Client que inicia a cadeia.',
      'Uma lista de funções percorrida em loop (primeiro que retornar algo vence); middlewares como funções que recebem next; generators encadeados. Em ASGI e WSGI, cada middleware envolve o próximo.',
      'Falha quando nenhuma etapa trata e o erro é silencioso, quando a ordem é implícita e quando a depuração exige seguir a cadeia inteira. Overengineering para dois casos.',
      'O custo cresce linearmente com o tamanho da cadeia por requisição; cada handler adiciona uma chamada e um frame.',
      'Teste cada handler isolado, depois a cadeia montada: quem trata, quem repassa, o que acontece sem tratador e a ordem relevante.',
      'Middlewares do Django, Starlette e Flask (before_request); logging propaga o registro pela hierarquia de loggers e handlers; urllib openers com handlers encadeados.',
      'SRP: cada handler faz uma coisa. OCP: handlers novos sem alterar os demais. A ordem codificada fora dos handlers evita acoplamento entre eles.',
      'Decorator embrulha para adicionar; Chain pode parar a propagação. Command encapsula a requisição. Pipeline sempre passa por todas as etapas; Chain termina no primeiro tratador.',
      'Diga: "cada handler decide tratar ou passar adiante". Dê middleware web como exemplo e destaque a questão da ordem e do pedido sem tratador.'
    ]);

  P('command', 'Command', 'semi', 'Comportamental · Ação como objeto',
    'Encapsula uma requisição como objeto para parametrizar, enfileirar, registrar e desfazer ações.',
    'Em Python, uma função ou um callable já é um comando; classes só entram quando é preciso estado, undo ou serialização.',
    'Invoker → command.execute() → Receiver.action()',
    ['comportamental', 'undo', 'fila'],
    ['Desfazer e refazer', 'Filas de tarefas e agendamento', 'Registro e replay de operações (log de comandos)', 'Macros que agrupam ações'],
    ['Quando uma função ou functools.partial resolve', 'Quando não há undo, fila nem log', 'Quando a classe só tem __call__ sem estado', 'Quando o estado necessário para undo é grande demais'],
    'Strategy, Memento, Chain of Responsibility, CQRS, Task queue.',
    [
      'Transforma uma ação em um objeto de primeira classe: pode ser guardado, adiado, enfileirado, repetido ou desfeito, desacoplando quem pede de quem executa.',
      'Command (interface execute), ConcreteCommand (guarda receiver e parâmetros), Receiver, Invoker e Client.',
      'Um callable: função, lambda ou functools.partial. Quando precisa de undo ou serialização, uma dataclass imutável com execute() e undo(). Em sistemas maiores, o comando é uma mensagem (dataclass) tratada por um handler.',
      'Overengineering quando a "classe de comando" só chama uma função. Falha ao implementar undo de efeitos externos (e-mail enviado) ou ao guardar referências que mantêm objetos vivos.',
      'Um objeto por ação; histórico de undo consome memória. A indireção é pequena.',
      'Teste execute e undo (estado volta ao inicial), idempotência quando exigida, serialização do comando e a fila com um receiver falso.',
      'functools.partial; threading.Thread(target=...); concurrent.futures.submit(callable); Celery tasks; argparse subcommands; undo em editores e no tkinter.',
      'SRP: a ação é separada do invocador. OCP: comandos novos sem mudar o invocador. DIP: o invoker depende da interface de comando.',
      'Strategy troca o algoritmo; Command representa uma ação com seu contexto. Memento guarda estado; Command pode usar Memento para undo. Em CQRS, "Command" é a mensagem de escrita.',
      'Diga: "ação vira objeto, então posso enfileirar, registrar e desfazer; em Python muitas vezes é um callable". Mencione undo e outbox/fila como usos reais.'
    ]);

  P('interpreter', 'Interpreter', 'semi', 'Comportamental · Gramática',
    'Define uma gramática e um interpretador que avalia sentenças dessa linguagem.',
    'Útil para DSLs pequenas (regras, filtros, expressões). Para linguagens maiores, use um parser dedicado.',
    'Context → Expression.interpret(ctx) → resultado',
    ['comportamental', 'DSL', 'AST'],
    ['Pequenas DSLs de regras, filtros e consultas', 'Expressões configuráveis por usuário', 'Avaliação de ASTs', 'Quando a gramática é simples e estável'],
    ['Gramáticas grandes (use gerador de parser)', 'Quando performance de avaliação importa', 'Quando eval() de entrada externa passa pela cabeça (nunca)', 'Quando uma estrutura de dados e um dispatch resolvem'],
    'Composite, Visitor, Specification, Parser combinators.',
    [
      'Avalia expressões de uma linguagem simples representada como árvore, sem escrever um compilador completo.',
      'AbstractExpression (interpret), TerminalExpression, NonterminalExpression (composta) e Context (variáveis e estado).',
      'Dataclasses imutáveis para os nós e uma função recursiva com match/case (3.10+) ou singledispatch; para parsing, ast.parse e ast.literal_eval; bibliotecas como lark ou pyparsing. Nunca eval/exec em entrada não confiável.',
      'Falha em gramáticas grandes (explosão de classes), em performance e em tratamento de erros de sintaxe. eval() de entrada externa é vulnerabilidade de execução remota de código.',
      'Avaliação por árvore é O(n) no tamanho da expressão, mas lenta frente a bytecode compilado. A recursão limita a profundidade.',
      'Teste por tabela: expressão → resultado esperado, casos de borda e erros de sintaxe; teste propriedades (parse de pretty-print devolve a mesma árvore).',
      'ast.literal_eval; módulo re (padrão compilado e interpretado); string.Template; Jinja2 (parser e renderização de templates); SQLAlchemy expression language; operator para expressões.',
      'OCP: novas expressões como novas classes de nó. Muitos nós podem ferir SRP se o nó também faz parse e formatação.',
      'Composite define a estrutura da árvore; Interpreter dá semântica. Visitor separa a operação dos nós. Specification é um Interpreter mínimo de regras booleanas.',
      'Diga: "AST mais um avaliador recursivo para uma DSL pequena". Cite ast.literal_eval e alerte contra eval com entrada externa.'
    ]);

  P('iterator', 'Iterator', 'semi', 'Comportamental · Percurso',
    'Percorre os elementos de uma coleção sem expor sua estrutura interna.',
    'Embutido na linguagem: __iter__ e __next__, generators e o laço for. Python é construído em torno desse padrão.',
    'iter(obj) → __next__() → ... → StopIteration',
    ['comportamental', 'pythonic', 'generator'],
    ['Percorrer coleções customizadas', 'Streams grandes que não cabem em memória', 'Pipelines lazy de transformação', 'Separar o percurso da estrutura de dados'],
    ['Quando uma lista já resolve e o tamanho é pequeno', 'Quando é preciso acesso aleatório (use sequência)', 'Quando reutilizar o iterator esgotado causa bug silencioso', 'Quando a ordem de percurso depende de efeitos colaterais'],
    'Generator, Composite, Visitor, itertools, Async iterator.',
    [
      'Dá acesso sequencial aos elementos de uma coleção sem revelar como ela é armazenada, permitindo vários percursos independentes.',
      'Iterable (__iter__), Iterator (__next__ e StopIteration), a coleção e o cliente (laço for, comprehension, unpacking).',
      'Um generator com yield (ou yield from) substitui a classe iterator quase sempre; __iter__ pode ser um generator. itertools compõe percursos; async for e __aiter__ para fontes assíncronas.',
      'Falha quando o iterator é consumido uma vez e reutilizado (fica vazio), quando a coleção muda durante a iteração e quando se materializa tudo com list() desnecessariamente.',
      'Memória O(1) por iterador, avaliação lazy e custo por elemento. Generators têm overhead de frame por next(), mas evitam alocar a coleção.',
      'Teste a sequência produzida, a exaustão (StopIteration), a reentrada em novas chamadas de iter(), coleção vazia e modificação durante a iteração.',
      'O laço for e comprehensions; itertools (chain, islice, groupby); open() iterando linhas; os.scandir; range; csv.reader; dict.items().',
      'SRP: o percurso fica fora da coleção. OCP: novos percursos sem mudar a coleção. ISP: contratos mínimos (__iter__ e __next__).',
      'Iterable é o que se pode iterar; Iterator é o estado do percurso. Generator é um iterator criado por função. Visitor percorre aplicando operação por tipo.',
      'Diga: "iterable produz iterators; generator é a forma pythônica de escrever um". Mostre que iterators são consumidos uma vez e dê o exemplo de arquivo linha a linha.'
    ]);

  P('mediator', 'Mediator', 'semi', 'Comportamental · Coordenação central',
    'Centraliza a comunicação entre objetos para que eles não se conheçam diretamente.',
    'Troca uma malha de referências cruzadas por um ponto de coordenação. Event bus e controladores de UI são exemplos.',
    'Colleague → mediator.notify(sender, event) → Colleagues',
    ['comportamental', 'coordenação', 'desacoplamento'],
    ['Muitos objetos que se referenciam entre si', 'Formulários e UIs com dependências entre campos', 'Orquestração de componentes de um fluxo', 'Chat rooms e salas de coordenação'],
    ['Quando o mediator vira um "deus objeto" com toda a lógica', 'Quando só há dois colaboradores', 'Quando um event bus assíncrono é o que se quer', 'Quando o acoplamento direto é claro e estável'],
    'Observer, Facade, Message Bus, Controller.',
    [
      'Reduz acoplamento muitos-para-muitos: os colegas falam só com o mediator, que decide quem reage.',
      'Mediator (interface), ConcreteMediator (conhece e coordena os colegas), Colleagues (conhecem só o mediator).',
      'Um objeto coordenador que recebe eventos e chama os colegas, ou um event bus simples com callbacks registrados; asyncio.Queue como mediador entre corrotinas.',
      'Falha quando o mediator concentra toda a lógica de negócio e vira um monólito acoplado a todos os colegas. Overengineering com poucos colaboradores.',
      'Um ponto central de tráfego: pode virar gargalo de leitura e de manutenção. Cada notificação passa por ele.',
      'Teste o mediator com colegas falsos para cada evento (quem é chamado e em que ordem) e teste os colegas isoladamente com um mediator falso.',
      'asyncio.Queue como canal entre produtores e consumidores; controllers de GUI (tkinter, Qt); Django signals fazem papel parecido; chat servers em asyncio.',
      'SRP e DIP: os colegas dependem só da abstração do mediator. Mas o mediator pode violar SRP se acumular regras.',
      'Observer é difusão um-para-muitos sem coordenação central; Mediator coordena ativamente. Facade simplifica unidirecionalmente. Message Bus é o mediator distribuído.',
      'Diga: "troco referências cruzadas por um coordenador". Compare com Observer e alerte para o risco de god object.'
    ]);

  P('memento', 'Memento', 'semi', 'Comportamental · Snapshot',
    'Captura e restaura o estado interno de um objeto sem violar o encapsulamento.',
    'Base de undo, checkpoints e rollback. Em Python, copy, dataclasses e pickle fazem o trabalho de snapshot.',
    'originator.save() → Memento ; originator.restore(memento)',
    ['comportamental', 'undo', 'snapshot'],
    ['Undo e redo', 'Checkpoints e rollback de estado', 'Transações em memória', 'Salvar e restaurar estado de simulações'],
    ['Quando o estado é enorme e copiar custa demais', 'Quando o estado inclui recursos externos', 'Quando event sourcing é o modelo certo', 'Quando o histórico ilimitado vaza memória'],
    'Command, Prototype, Event Sourcing, Snapshot.',
    [
      'Permite voltar a um estado anterior sem expor os detalhes internos do objeto a quem guarda o histórico.',
      'Originator (cria e restaura), Memento (guarda o estado, opaco) e Caretaker (guarda os mementos).',
      'Uma dataclass frozen com o estado, copy.deepcopy ou serialização (pickle, json); uma lista como pilha de undo. Em objetos imutáveis, o próprio valor antigo é o memento.',
      'Falha com estados enormes, com efeitos externos que não se desfazem e com histórico ilimitado. Se o domínio precisa de auditoria, event sourcing é melhor que snapshots.',
      'Memória proporcional ao número e ao tamanho dos snapshots; copiar estado custa O(tamanho). Compartilhamento estrutural (tuplas, pyrsistent) reduz o custo.',
      'Teste save, mutação e restore (igualdade do estado), múltiplos níveis de undo e que o memento não é mutável por quem o guarda.',
      'copy e pickle; dataclasses.replace; transações em memória de bibliotecas de testes; sqlite savepoints; editores com undo.',
      'SRP: quem guarda o histórico não conhece o estado. Preserva o encapsulamento do originator.',
      'Command pode usar Memento para desfazer; Prototype cria objetos novos, Memento restaura o mesmo. Event Sourcing guarda eventos, não snapshots (embora use snapshots como otimização).',
      'Diga: "snapshot opaco do estado que permite rollback sem quebrar encapsulamento". Cite undo e fale do custo de memória.'
    ]);

  P('observer', 'Observer', 'semi', 'Comportamental · Publish/subscribe',
    'Notifica automaticamente os interessados quando o estado de um sujeito muda.',
    'Base de eventos, signals e UIs reativas. Em Python, uma lista de callbacks costuma bastar.',
    'subject.subscribe(cb) → subject.notify() → cb(event)',
    ['comportamental', 'eventos', 'callbacks'],
    ['Um evento com vários interessados independentes', 'Desacoplar produtor de eventos dos reagentes', 'UIs e sinais de framework', 'Auditoria e hooks de extensão'],
    ['Quando a ordem de notificação importa e é implícita', 'Quando há muitos observadores e cascatas difíceis de depurar', 'Quando observadores guardam referência e vazam memória', 'Quando um simples callback resolve'],
    'Mediator, Pub/Sub, Domain Events, Signals, Event Bus.',
    [
      'Mantém objetos dependentes atualizados sem que o sujeito conheça quem são, em relação um-para-muitos.',
      'Subject (guarda observers, subscribe e notify), Observer (interface update) e ConcreteObservers.',
      'Uma lista de callables registrados e chamados em sequência; weakref.WeakSet ou WeakMethod para não vazar; signals do Django, blinker; asyncio para observers assíncronos; __set_name__ e descriptors para atributos observáveis.',
      'Falha por memory leak (observador nunca removido), cascatas de notificação, exceções de um observer derrubando os demais e reentrância (notificar durante notificação). Ordem e threads ficam implícitas.',
      'O custo de notificar é O(n) observadores; chamadas síncronas bloqueiam o sujeito. Em threads, exige lock ou cópia da lista.',
      'Teste que observadores são chamados com o evento certo, unsubscribe funciona, exceções isoladas e que o sujeito funciona sem observadores. Mock como observer.',
      'Django signals (post_save); blinker (Flask signals); tkinter bind e traces; logging handlers; watchdog; asyncio Future.add_done_callback.',
      'OCP: novos observers sem alterar o sujeito. DIP: o sujeito depende da interface do observer. ISP: contrato mínimo de update.',
      'Mediator coordena ativamente; Observer apenas propaga. Pub/Sub adiciona um broker no meio. Domain Events é Observer com semântica de domínio.',
      'Diga: "o sujeito notifica sem conhecer os observers; cuido de memória (weakref), ordem e exceções". Compare com pub/sub com broker.'
    ]);

  P('state', 'State', 'semi', 'Comportamental · Máquina de estados',
    'Permite que um objeto altere seu comportamento quando seu estado interno muda.',
    'Substitui cadeias de if/elif por estado como objeto. Em Python, enums, dicts de transição e match/case cobrem muitos casos.',
    'context.handle() → state.handle(context) → context.state = NextState',
    ['comportamental', 'máquina de estados', 'transições'],
    ['Comportamento depende de estado (pedido: novo, pago, enviado)', 'Muitos if/elif sobre um campo de status', 'Fluxos com transições válidas e inválidas', 'Protocolos e parsers com fases'],
    ['Quando há dois ou três estados simples (um enum basta)', 'Quando as transições são tabela de dados', 'Quando o número de estados explode sem modelo claro', 'Quando o estado é só um campo e não muda comportamento'],
    'Strategy, Command, Enum, Finite State Machine, Saga.',
    [
      'Elimina condicionais espalhadas sobre o estado, colocando o comportamento de cada estado em um lugar e tornando as transições explícitas.',
      'Context (guarda o estado atual), State (interface) e ConcreteStates que implementam o comportamento e decidem a próxima transição.',
      'Uma tabela de transições {(estado, evento): novo_estado} com Enum; ou classes de estado; match/case sobre (estado, evento); a biblioteca transitions. Para estados simples, enum e funções bastam.',
      'Falha quando as transições válidas não estão em um lugar só, permitindo estados impossíveis, e quando há explosão de estados. Overengineering com dois estados.',
      'Um objeto de estado por transição ou uma consulta de dict; trivial. O custo real é a complexidade do modelo e a manutenção das transições.',
      'Teste a tabela inteira: cada transição válida e cada inválida (deve falhar), estados terminais e persistência do estado. Property-based testing com hypothesis para sequências de eventos.',
      'asyncio.Future (pending, finished, cancelled); enum.Enum; http.client (estados da conexão); a biblioteca transitions; parsers e protocolos de rede.',
      'OCP: novos estados sem mexer nos existentes (mas as transições podem acoplar). SRP: cada estado tem um comportamento.',
      'Strategy escolhe um algoritmo de fora; State troca sozinho por transições internas. Saga é máquina de estados distribuída. Enum guarda o valor; State guarda o comportamento.',
      'Diga: "State é Strategy que se troca sozinha conforme transições". Mostre a tabela de transições e a importância de rejeitar transições inválidas.'
    ]);

  P('strategy', 'Strategy', 'semi', 'Comportamental · Algoritmo intercambiável',
    'Encapsula uma família de algoritmos e os torna intercambiáveis em runtime.',
    'Em Python, a estratégia é quase sempre uma função passada como argumento. A hierarquia de classes é a forma clássica, raramente a melhor.',
    'Context(strategy).execute(data) → strategy(data)',
    ['comportamental', 'pythonic', 'callable'],
    ['Algoritmos intercambiáveis (ordenação, desconto, serialização)', 'Eliminar if/elif sobre o tipo de algoritmo', 'Injetar comportamento por configuração', 'Testar com uma estratégia falsa'],
    ['Quando só existe um algoritmo', 'Quando a diferença é um parâmetro, não um algoritmo', 'Quando o cliente precisa conhecer detalhes da estratégia', 'Quando a hierarquia vira cerimônia para uma função de uma linha'],
    'State, Template Method, Command, Dependency Injection.',
    [
      'Troca o algoritmo sem alterar quem o usa, removendo condicionais sobre o tipo e permitindo novas variantes sem tocar o contexto.',
      'Strategy (interface), ConcreteStrategies, Context (usa uma estratégia) e Client (escolhe e injeta).',
      'Funções de primeira classe: sorted(key=...), um dict {nome: função}, ou um Protocol quando precisa de estado; functools.partial para parametrizar. Classes só quando a estratégia tem estado ou várias operações.',
      'Overengineering: criar classe e interface para uma função de uma linha. Falha ao escolher a estratégia com um if gigante no cliente (só moveu o problema).',
      'Uma chamada indireta, desprezível. O custo é de organização: onde a estratégia é escolhida e como é configurada.',
      'Teste cada estratégia isoladamente (tabelas), e teste o contexto com uma estratégia falsa; a escolha da estratégia em um teste de configuração.',
      'sorted(key=), min e max com key; functools.reduce; logging.Formatter; json.dumps(default=); pytest parametrize; sklearn estimators intercambiáveis; Django password hashers.',
      'OCP: novas estratégias sem alterar o contexto. DIP: o contexto depende da abstração. SRP: cada algoritmo isolado.',
      'State muda sozinho por transições; Strategy é escolhida de fora. Template Method varia passos por herança; Strategy por composição. Command guarda uma ação e seu contexto.',
      'Diga: "em Python, strategy é passar uma função". Mostre sorted(key=) e explique quando uma classe se justifica (estado ou múltiplos métodos).'
    ]);

  P('template-method', 'Template Method', 'semi', 'Comportamental · Esqueleto de algoritmo',
    'Define o esqueleto de um algoritmo na superclasse e deixa subclasses preencherem passos.',
    'Inversão de controle por herança: a classe base chama os passos (hooks) que a subclasse implementa. Composição costuma ser mais flexível.',
    'base.run() → step1(); hook(); step2()  (hook sobrescrito)',
    ['comportamental', 'herança', 'hooks'],
    ['Algoritmo com passos fixos e detalhes variáveis', 'Frameworks que pedem para sobrescrever hooks', 'Evitar duplicar a estrutura de um fluxo', 'Hooks de ciclo de vida (setUp, tearDown)'],
    ['Quando a herança cria acoplamento forte com a classe base', 'Quando passos mudam de ordem entre variantes', 'Quando Strategy por composição é mais simples', 'Quando a hierarquia fica profunda'],
    'Strategy, Factory Method, Hooks, Mixins.',
    [
      'Reaproveita a estrutura de um algoritmo e isola as partes que variam, evitando duplicar o fluxo em cada subclasse.',
      'AbstractClass (método template e passos abstratos ou hooks), ConcreteClass (implementa os passos).',
      'Método na classe base que chama métodos sobrescritos; abc.abstractmethod para passos obrigatórios; hooks com implementação vazia. Alternativa: receber callables por composição.',
      'Falha pelo problema da classe base frágil: mudanças na base quebram subclasses, e herança profunda dificulta entender o fluxo. Overengineering se uma função com callbacks basta.',
      'Chamadas virtuais normais, custo desprezível. O custo é de acoplamento e leitura (o fluxo está dividido entre classes).',
      'Teste o template com uma subclasse mínima, os hooks em separado e que passos obrigatórios não implementados levantam erro (abstractmethod).',
      'unittest.TestCase (setUp, test_*, tearDown); Django class-based views (dispatch, get, post); json.JSONEncoder.default; logging.Handler.emit; socketserver.BaseRequestHandler.handle.',
      'OCP: estende por subclasses. LSP é o ponto de atenção: subclasses devem respeitar o contrato do template. Princípio de Hollywood: a base chama você.',
      'Strategy usa composição; Template usa herança. Factory Method frequentemente é um passo do template. Mixins distribuem comportamento sem fluxo fixo.',
      'Diga: "a base define o fluxo, a subclasse preenche os passos; é herança, então só quando o fluxo é estável". Cite unittest e class-based views.'
    ]);

  P('visitor', 'Visitor', 'semi', 'Comportamental · Operação por tipo',
    'Separa uma operação dos objetos sobre os quais ela atua, adicionando operações sem mudar as classes.',
    'Resolve o double dispatch em linguagens sem pattern matching. Em Python, singledispatch e match/case dispensam boa parte da cerimônia.',
    'node.accept(visitor) → visitor.visit_X(node)',
    ['comportamental', 'double dispatch', 'AST'],
    ['Operações novas sobre uma hierarquia estável de nós (AST)', 'Percorrer estruturas heterogêneas', 'Geração de código, formatação e análise sobre árvores', 'Separar algoritmo de estrutura de dados'],
    ['Quando a hierarquia de nós muda com frequência', 'Quando singledispatch ou match/case resolve', 'Quando o visitor precisa de acesso a internos', 'Estruturas simples com poucos tipos'],
    'Interpreter, Composite, Iterator, singledispatch, match/case.',
    [
      'Adiciona operações a uma hierarquia de classes sem modificá-las, concentrando cada operação em um lugar.',
      'Visitor (um visit por tipo de elemento), ConcreteVisitor, Element (accept) e a estrutura de objetos.',
      'functools.singledispatch para despachar por tipo do argumento, ou match/case com padrões de classe (3.10+); ast.NodeVisitor usa getattr para chamar visit_NomeDoTipo. Dispensa accept() na maioria dos casos.',
      'Falha quando a hierarquia de elementos muda muito (cada novo tipo exige mexer em todos os visitors) e quebra encapsulamento quando expõe internos. Overengineering em Python quando match/case basta.',
      'Duas chamadas por nó (accept e visit) na forma clássica; singledispatch faz lookup por tipo com cache. O custo é pequeno frente à travessia.',
      'Teste cada visit por tipo de nó com árvores pequenas; teste um visitor completo sobre uma árvore mista e o comportamento com nó desconhecido (generic_visit).',
      'ast.NodeVisitor e ast.NodeTransformer; lib2to3 e libcst; os.walk como percurso; functools.singledispatch na stdlib; pytest collection visitando nós.',
      'OCP para novas operações (não para novos tipos de elemento). SRP: cada operação em uma classe. Pode violar encapsulamento dos elementos.',
      'Iterator percorre; Visitor opera por tipo. Composite define a árvore; Visitor adiciona operações. Interpreter usa a árvore para avaliar. Em Python, match/case é a alternativa moderna.',
      'Diga: "Visitor adiciona operações sem mudar os tipos; o custo é que novos tipos mexem em todos os visitors. Em Python, singledispatch ou match/case". Cite ast.NodeVisitor.'
    ]);

  P('context-manager', 'Context Manager', 'semi', 'Comportamental · Idioma pythônico',
    'Garante aquisição e liberação de um recurso com o protocolo __enter__ e __exit__ (with).',
    'O padrão RAII de Python: o bloco with garante o cleanup mesmo com exceção.',
    'with resource as r: ...  →  __enter__() / __exit__(exc_type, exc, tb)',
    ['pythonic', 'recursos', 'with'],
    ['Arquivos, locks, conexões, transações', 'Setup e teardown simétricos', 'Mudança temporária de estado (cwd, env, decimal context)', 'Medição de tempo e escopo de logs'],
    ['Quando o recurso tem vida mais longa que o bloco', 'Quando __exit__ engole exceções sem querer', 'Quando uma função try/finally é mais simples', 'Quando o cleanup precisa ser assíncrono (use async with)'],
    'Decorator (contextlib.contextmanager), RAII, Unit of Work, try/finally.',
    [
      'Assegura que recursos são liberados e que setup e teardown acontecem em par, mesmo quando há exceção no bloco.',
      'O gerenciador (com __enter__ e __exit__), o bloco with e o valor vinculado pelo as; ExitStack para vários recursos dinâmicos.',
      '@contextlib.contextmanager com yield dentro de try/finally; ou classe com __enter__ e __exit__; contextlib.suppress, closing, ExitStack e redirect_stdout; async with e __aenter__/__aexit__ para recursos assíncronos.',
      'Falha quando __exit__ retorna True e suprime exceções sem querer, quando o generator-based esquece o try/finally (cleanup não roda em erro) e quando o recurso escapa do bloco (usar depois de fechado).',
      'Custo quase zero: duas chamadas por bloco. O valor está em corretude, não em performance.',
      'Teste que o cleanup roda no caminho normal e com exceção (pytest.raises), que a exceção é propagada quando deve e a ordem de saída de vários recursos aninhados (LIFO).',
      'open(); threading.Lock; sqlite3.Connection (commit ou rollback); decimal.localcontext; unittest.mock.patch; tempfile.TemporaryDirectory; contextlib.chdir (3.11+); tarfile e zipfile.',
      'SRP: o cuidado com o ciclo de vida fica no gerenciador. OCP: novos recursos sem mexer nos clientes.',
      'Decorator embrulha chamadas; Context Manager embrulha blocos. Unit of Work usa context manager para commit ou rollback. try/finally é o equivalente de baixo nível.',
      'Diga: "with garante cleanup simétrico mesmo com exceção; escrevo com @contextmanager e try/finally". Cite open e lock como exemplos e a armadilha de __exit__ engolir exceções.'
    ]);

  /* =================== ARQUITETURAIS =================== */
  P('layered', 'Layered Architecture', 'self', 'Arquitetural · Camadas',
    'Organiza o sistema em camadas (apresentação, aplicação, domínio, infraestrutura) com dependências em um só sentido.',
    'A arquitetura mais comum. Funciona bem até que a camada de domínio passe a depender da de dados, quando surge o acoplamento ao banco.',
    'Presentation → Application → Domain → Infrastructure (dependência de cima para baixo)',
    ['arquitetural', 'camadas', 'separação'],
    ['Aplicações CRUD com regra de negócio moderada', 'Equipes que precisam de fronteiras simples e conhecidas', 'Base para evoluir para Clean ou Hexagonal', 'Separar HTTP, regra e persistência'],
    ['Domínio rico que não pode depender do banco (prefira Hexagonal)', 'Camadas que só repassam chamadas (pass-through)', 'Quando "regras" vazam para controllers e SQL', 'Microsserviços muito pequenos'],
    'Clean Architecture, Hexagonal, MVC, Service Layer.',
    [
      'Isola responsabilidades técnicas e de negócio em camadas para reduzir acoplamento e permitir trocar a persistência ou a interface sem reescrever a regra.',
      'Camada de apresentação (HTTP, CLI), de aplicação (casos de uso), de domínio (regras) e de infraestrutura (banco, filas, APIs externas).',
      'Pacotes por camada com imports em um sentido só, verificados com import-linter; módulos simples e funções; Protocols para as fronteiras. Sem frameworks pesados, o próprio sistema de módulos impõe as camadas.',
      'Falha quando camadas só repassam chamadas, quando a regra vaza para a apresentação ou para queries e quando o domínio importa o ORM (então a camada de dados manda no domínio). Overengineering em scripts e CRUD trivial.',
      'Indireção e código de mapeamento entre camadas (DTOs, mapeadores); latência desprezível. O custo é de disciplina para manter as dependências corretas.',
      'Teste o domínio sem I/O; teste a aplicação com repositórios em memória; teste a infraestrutura com integração; use import-linter para validar a regra de dependência.',
      'Projetos Django bem organizados (views, services, models); aplicações Flask e FastAPI com routers, services e repositories; arquitetura MVC e MTV do próprio Django.',
      'SRP e DIP em escala de módulo. A regra de dependência (só para baixo) é a versão estrutural de DIP, mas sem inversão ela acopla o domínio à infraestrutura.',
      'Clean e Hexagonal invertem a dependência para o domínio ser o centro; Layered tradicional deixa o domínio dependendo da camada de dados. MVC é uma separação dentro da apresentação.',
      'Diga: "camadas com dependência em um sentido; o risco é o domínio depender da infraestrutura, e por isso migro para ports e adapters quando a regra cresce". Cite import-linter.'
    ]);

  P('clean-architecture', 'Clean Architecture', 'self', 'Arquitetural · Regra de dependência',
    'Dependências apontam para dentro: entidades e casos de uso no centro, frameworks e banco na borda.',
    'Formulação de Robert C. Martin que generaliza Hexagonal e Onion: o domínio não conhece o framework nem o banco.',
    'Frameworks/DB → Interface Adapters → Use Cases → Entities',
    ['arquitetural', 'inversão de dependência', 'casos de uso'],
    ['Domínio rico e longevo', 'Frameworks que podem mudar (Django para FastAPI)', 'Regras testáveis sem banco e sem HTTP', 'Equipes grandes com fronteiras claras'],
    ['CRUD simples e protótipos', 'Equipes pequenas que pagam o custo de camadas sem retorno', 'Quando a "limpeza" gera mappers demais', 'Scripts e ferramentas internas'],
    'Hexagonal, Onion, Layered, Dependency Injection, Repository.',
    [
      'Protege a regra de negócio das decisões voláteis (framework, banco, UI) fazendo a infraestrutura depender do domínio, e não o contrário.',
      'Entities (regras centrais), Use Cases (interactors da aplicação), Interface Adapters (controllers, presenters, gateways) e Frameworks e Drivers (web, DB).',
      'Pacotes domain, application e adapters; Protocols (ou ABCs) como portas definidas no domínio; implementações na borda; injeção por construtor e um composition root que monta tudo. dataclasses no domínio, sem ORM.',
      'Falha ao virar cerimônia: mappers entre cada camada, DTOs duplicados e o ORM vazando para as entidades. Overengineering em CRUD, em protótipos e em times que não vão trocar framework ou banco.',
      'Mais classes e mapeamento; indireção por interfaces. Latência desprezível; o custo é de boilerplate e de onboarding.',
      'Teste entities e use cases sem I/O, com repositórios em memória; teste adapters em integração; teste de arquitetura (import-linter) valida a direção das dependências.',
      'Padrão do livro Architecture Patterns with Python (cosmic python); projetos FastAPI com camadas explícitas; o próprio Django pode ser a "borda" de um núcleo independente.',
      'DIP é o coração: o núcleo define interfaces que a borda implementa. SRP por camada; OCP para trocar adapters sem mexer no núcleo.',
      'Hexagonal fala de ports e adapters; Clean acrescenta anéis concêntricos nomeados. Onion é parente próximo. Layered clássico deixa a dependência para baixo, sem inversão.',
      'Diga: "a dependência aponta para dentro; o domínio define as portas e a infraestrutura implementa". Fale honestamente que em CRUD simples é peso demais.'
    ]);

  P('hexagonal', 'Hexagonal (Ports and Adapters)', 'self', 'Arquitetural · Portas e adaptadores',
    'O núcleo da aplicação expõe portas; adaptadores conectam o mundo externo (HTTP, banco, filas) a elas.',
    'Proposto por Alistair Cockburn. Permite dirigir a aplicação por testes, UI ou outro sistema com o mesmo núcleo.',
    'Driving adapter → Port (in) → Core → Port (out) → Driven adapter',
    ['arquitetural', 'ports and adapters', 'testabilidade'],
    ['Núcleo testável sem infraestrutura', 'Várias entradas (REST, CLI, fila) para as mesmas regras', 'Trocar banco ou serviço externo com baixo impacto', 'Integrações que mudam com frequência'],
    ['Aplicações pequenas sem regra relevante', 'Quando as portas só espelham os adapters', 'Equipes sem disciplina de dependências', 'Quando o custo de abstrair supera o de reescrever'],
    'Clean Architecture, Adapter, Layered, Dependency Injection, Repository.',
    [
      'Isola o núcleo de qualquer tecnologia: tudo que entra ou sai passa por portas (interfaces) implementadas por adaptadores.',
      'Core (domínio e casos de uso), ports de entrada (casos de uso) e de saída (repositórios, gateways), driving adapters (API, CLI) e driven adapters (banco, e-mail).',
      'Protocols como portas; classes simples como adaptadores; injeção por construtor; um composition root (main ou factory) que liga portas a adaptadores. Fakes em memória fazem os adaptadores de teste.',
      'Falha quando as portas espelham o ORM ou o SDK (vazam detalhes) e quando há um adapter por classe sem variação real. Overengineering em sistemas pequenos.',
      'Custo em quantidade de arquivos e em mapeamento; latência irrelevante. Em troca, testes rápidos sem I/O.',
      'Teste o núcleo com adaptadores fake, os adaptadores com testes de contrato rodando contra a mesma suíte e a fiação com um teste de composição.',
      'Cosmic Python usa o estilo; FastAPI com Depends como composition root; SQLAlchemy com repositories que implementam um Protocol; pytest com fakes em memória.',
      'DIP e ISP são a base: portas pequenas e do ponto de vista do núcleo. OCP: novos adaptadores sem mudar o núcleo.',
      'Idêntico em espírito a Clean; Layered trata a dependência para baixo. Adapter (GoF) é a peça usada em cada borda. Repository é uma porta de saída típica.',
      'Diga: "o núcleo define as portas, a infraestrutura as implementa, e eu liga tudo no composition root". Use o exemplo de trocar Postgres por um fake em memória.'
    ]);

  P('repository', 'Repository', 'self', 'Arquitetural · Persistência como coleção',
    'Abstrai a persistência como uma coleção de objetos de domínio, escondendo o acesso a dados.',
    'O domínio fala com add e get como se fosse uma coleção em memória; o mapeamento para SQL fica por trás.',
    'repo.add(entity) / repo.get(id) → (detalhes de DB escondidos)',
    ['arquitetural', 'persistência', 'DDD'],
    ['Domínio que não deve conhecer o ORM', 'Trocar a persistência (SQL por fake em memória)', 'Consultas com semântica de domínio', 'Testar casos de uso sem banco'],
    ['CRUD simples em que o ORM já é a abstração', 'Quando o repository replica todos os métodos do ORM', 'Quando vira um catálogo de queries ad hoc', 'Consultas de leitura pesadas (use CQRS ou views)'],
    'Unit of Work, Aggregate, DAO, Specification, CQRS.',
    [
      'Esconde a tecnologia de persistência atrás de uma interface de coleção, mantendo o domínio puro e as consultas expressas na linguagem do negócio.',
      'Interface do repository (um Protocol), implementação concreta (SQLAlchemy, em memória), entidades ou aggregates e o Unit of Work que o coordena.',
      'Um Protocol ou ABC com add, get e métodos de consulta de domínio; uma implementação SQLAlchemy mapeando classes de domínio (imperative mapping) e um FakeRepository com set ou dict para testes.',
      'Falha quando vira uma fina camada sobre o ORM, quando expõe sessão ou query vazando abstração e quando cresce com um método por consulta. Overengineering se o ORM já basta e o domínio é anêmico.',
      'Indireção e mapeamento; riscos de N+1 se a abstração esconder o carregamento. Meça queries geradas.',
      'Teste o contrato com a mesma suíte contra o fake e contra o real (banco de teste); use o fake nos testes de casos de uso.',
      'Cosmic Python (Repository e Unit of Work); Django managers e QuerySets como repositórios parciais; SQLAlchemy Session com padrão Unit of Work embutido.',
      'DIP: o domínio depende de uma interface. SRP: persistência separada da regra. ISP: interfaces pequenas por aggregate.',
      'DAO é por tabela e técnico; Repository é por aggregate e semântico. Active Record mistura entidade e persistência. Unit of Work gerencia a transação.',
      'Diga: "Repository dá ao domínio a ilusão de uma coleção em memória; um repository por aggregate". Fale do fake em memória nos testes.'
    ]);

  P('unit-of-work', 'Unit of Work', 'self', 'Arquitetural · Transação',
    'Agrupa operações de negócio em uma unidade atômica, controlando commit e rollback.',
    'Em Python, costuma ser um context manager que abre a sessão, entrega os repositories e comita ou reverte ao sair.',
    'with uow: uow.repo.add(x); uow.commit()',
    ['arquitetural', 'transação', 'context manager'],
    ['Várias operações que devem ser atômicas', 'Coordenar vários repositories na mesma transação', 'Publicar eventos de domínio após o commit', 'Limites de transação explícitos na camada de serviço'],
    ['Operações de um único comando simples', 'Quando o framework já gerencia a transação por request', 'Transações distribuídas entre serviços (use Saga e Outbox)', 'Quando esconde o ciclo de vida da sessão sem ganho'],
    'Repository, Service Layer, Context Manager, Outbox.',
    [
      'Garante consistência: todas as mudanças de um caso de uso são persistidas juntas ou nenhuma, sem espalhar commit pelo código.',
      'UnitOfWork (abre e fecha a transação, expõe repositories, commit e rollback), repositories e a camada de serviço que usa o with.',
      'Classe com __enter__ e __exit__ (rollback por padrão ao sair sem commit); sessão SQLAlchemy por trás; uma versão fake com atributo committed para testes; collect_new_events para publicar eventos depois do commit.',
      'Falha ao misturar commits dentro de repositories, ao vazar a sessão e ao usar UoW em fluxos distribuídos (não é transação distribuída). Overengineering se o framework já cobre.',
      'Overhead pequeno por unidade; o risco é manter transações longas abertas. Escolha o nível de isolamento conscientemente.',
      'Teste commit e rollback (exceção dentro do with não persiste), o fake de UoW em testes de serviço e isolamento entre unidades concorrentes em integração.',
      'sqlalchemy.orm.Session (implementa a ideia); Django transaction.atomic; Cosmic Python UoW; sqlite3 connection como context manager.',
      'SRP: transação isolada da regra. DIP: o serviço depende da abstração de UoW.',
      'Repository acessa dados; UoW define a fronteira transacional. Saga coordena várias UoWs em serviços distintos. Context manager é o mecanismo de implementação.',
      'Diga: "UoW é a fronteira da transação: with abre, commit confirma, sair sem commit faz rollback". Mencione eventos publicados após o commit.'
    ]);

  P('service-layer', 'Service Layer', 'self', 'Arquitetural · Casos de uso',
    'Camada que orquestra casos de uso: recebe comandos, usa repositories e UoW e devolve resultados.',
    'Define a API da aplicação, mantendo controllers finos e o domínio puro.',
    'handler(command, uow) → domínio → uow.commit()',
    ['arquitetural', 'casos de uso', 'orquestração'],
    ['Várias entradas (HTTP, CLI, fila) para a mesma lógica', 'Controllers que ficaram gordos', 'Orquestração de domínio, repositories e eventos', 'Testes de ponta a ponta sem HTTP'],
    ['Quando a regra pertence ao domínio e o serviço vira anêmico e repetitivo', 'Quando só repassa para o repository', 'Quando vira um "god service" com dezenas de métodos', 'CRUD sem regra'],
    'Facade, Application Service, Command, Unit of Work, Clean Architecture.',
    [
      'Dá um ponto único de entrada para os casos de uso, separando orquestração (serviço) de regra (domínio) e de transporte (controller).',
      'Funções ou classes de serviço, comandos de entrada (dataclasses), repositories ou UoW injetados e o domínio.',
      'Funções de serviço puras que recebem um comando e um uow, devolvendo valores simples; injeção por argumento ou por functools.partial; um handler por comando.',
      'Falha quando a lógica de negócio vaza para o serviço e o domínio fica anêmico, ou quando o serviço vira um god object. Overengineering em CRUD.',
      'Uma camada a mais; custo é design e boilerplate. Em troca, API testável e reaproveitável.',
      'Teste os serviços com uow e repositories fake, rápidos e sem I/O; poucos testes de integração; teste os controllers só para mapeamento HTTP.',
      'Cosmic Python (services.py); aplicações FastAPI com um módulo de use cases; Django com services.py por convenção de comunidade.',
      'SRP: orquestração isolada. DIP: depende de abstrações de persistência. OCP: novos casos de uso como novas funções.',
      'Facade simplifica um subsistema; Service Layer define as operações da aplicação. Domain Service guarda regra sem estado que não cabe numa entidade. Controller só traduz transporte.',
      'Diga: "controllers finos, serviço orquestra, domínio decide; testo o serviço com fakes". Diferencie Application Service de Domain Service.'
    ]);

  P('aggregate', 'Aggregate (DDD)', 'self', 'Arquitetural · Fronteira de consistência',
    'Agrupa entidades e valores sob uma raiz que garante invariantes e define a fronteira transacional.',
    'Conceito do Domain-Driven Design. O acesso externo passa só pela raiz e cada transação altera um aggregate.',
    'AggregateRoot → [Entities, ValueObjects]  (invariantes na raiz)',
    ['arquitetural', 'DDD', 'invariantes'],
    ['Regras que precisam ser consistentes juntas', 'Definir o que carrega em uma transação', 'Evitar concorrência em dados não relacionados', 'Modelar entidade com partes internas (pedido e itens)'],
    ['Aggregates enormes que travam concorrência', 'Quando há só entidades isoladas', 'Quando a referência entre aggregates é por objeto em vez de por id', 'Modelos anêmicos sem invariantes'],
    'Repository, Entity, Value Object, Domain Events, Unit of Work.',
    [
      'Protege invariantes de negócio definindo uma fronteira de consistência: o que deve estar correto em cada transação.',
      'Aggregate Root (única porta de entrada), Entities internas, Value Objects e as invariantes; referências a outros aggregates por identidade.',
      'Classe raiz com métodos de negócio que validam as invariantes; dataclasses frozen para value objects; repository por aggregate; eventos de domínio acumulados na raiz; versão (optimistic locking) para concorrência.',
      'Falha quando o aggregate é grande demais (contenção e lentidão), quando objetos internos são modificados por fora da raiz e quando referências diretas entre aggregates quebram a fronteira. Overengineering sem invariantes reais.',
      'Carregar o aggregate inteiro a cada operação e conflitos de concorrência em aggregates grandes. Projete pequeno.',
      'Teste as invariantes pela raiz (toda operação inválida falha), que eventos corretos são gerados e concorrência por versão.',
      'Cosmic Python (Product com batches); modelos DDD em Python com dataclasses; SQLAlchemy imperative mapping para persistir sem poluir o domínio.',
      'SRP e encapsulamento: as regras ficam com os dados. Tell, don\'t ask. LSP e OCP dependem do desenho das invariantes.',
      'Entity tem identidade; Value Object tem igualdade por valor; Aggregate é o cluster com raiz. Repository persiste aggregates. Unit of Work é a transação sobre eles.',
      'Diga: "aggregate é a fronteira de consistência com uma raiz que garante invariantes; uma transação, um aggregate; referências entre eles por id". Prefira pequenos.'
    ]);

  P('domain-events', 'Domain Events e Message Bus', 'self', 'Arquitetural · Eventos internos',
    'Entidades registram fatos ocorridos (eventos) e um message bus os despacha para handlers.',
    'Desacopla efeitos colaterais da regra principal: alocar um pedido gera um evento, e o envio de e-mail reage a ele.',
    'aggregate.events.append(Event) → bus.handle(event) → handlers',
    ['arquitetural', 'eventos', 'desacoplamento'],
    ['Efeitos colaterais que não pertencem ao caso de uso principal', 'Comunicação entre aggregates', 'Integrar módulos sem acoplamento direto', 'Base para Outbox e Event Sourcing'],
    ['Quando o fluxo é linear e acoplamento direto é mais claro', 'Quando a cadeia de eventos fica impossível de rastrear', 'Quando exige consistência forte imediata', 'Sistemas muito pequenos'],
    'Observer, Mediator, Outbox, Event Sourcing, CQRS.',
    [
      'Separa o que aconteceu do que reagir a isso, evitando que o serviço principal conheça todos os efeitos secundários.',
      'Evento (dataclass imutável), aggregate que o registra, message bus (despacho por tipo), handlers e o UoW que coleta eventos após o commit.',
      'Dataclasses frozen para eventos; dict {tipo_do_evento: [handlers]}; a fila de eventos processada em loop (um bus síncrono simples); handlers injetados; asyncio ou broker para o assíncrono.',
      'Falha quando a ordem e a rastreabilidade se perdem, quando handlers falham e deixam estado inconsistente, e quando eventos viram "comandos disfarçados". Overengineering em fluxos simples.',
      'Indireção e dificuldade de depuração; handlers síncronos alongam a transação. Entrega assíncrona traz eventual consistência e a necessidade de idempotência.',
      'Teste que o aggregate emite o evento certo, cada handler isolado e o bus com handlers falsos; teste falha de handler e idempotência na reentrega.',
      'Cosmic Python (message bus); Django signals e Celery para eventos assíncronos; bibliotecas como eventsourcing; Kafka e RabbitMQ no nível de sistema.',
      'OCP: novos handlers sem mexer no emissor. SRP: cada handler uma reação. DIP: emissor e handler dependem do evento, não um do outro.',
      'Observer é o mecanismo local; Domain Event é um fato do domínio. Evento (passado) versus Comando (intenção, uma só resposta). Outbox garante entrega confiável.',
      'Diga: "evento é fato no passado; o bus despacha para handlers e desacopla efeitos colaterais". Distinga evento de comando e fale de idempotência.'
    ]);

  P('cqrs', 'CQRS', 'self', 'Arquitetural · Separação leitura e escrita',
    'Separa o modelo de escrita (comandos) do modelo de leitura (queries).',
    'Permite otimizar cada lado separadamente: escrita com regras e invariantes, leitura com views desnormalizadas.',
    'Command → write model ; Query → read model (projeções)',
    ['arquitetural', 'leitura e escrita', 'projeções'],
    ['Leituras muito diferentes das escritas (relatórios, dashboards)', 'Escalar leitura e escrita independentemente', 'Modelo de leitura desnormalizado e rápido', 'Combina com Event Sourcing'],
    ['CRUD simples', 'Quando a consistência imediata de leitura após escrita é obrigatória e cara de simular', 'Equipes que não sustentam duas visões', 'Sistemas pequenos'],
    'Event Sourcing, Repository, Domain Events, Materialized View.',
    [
      'O modelo que garante regras de escrita raramente é o melhor para consultas; separar permite otimizar e escalar cada um.',
      'Comandos e handlers (escrita), queries e handlers de leitura, read model (tabela, view, índice de busca) e o mecanismo que o atualiza.',
      'Comandos como dataclasses tratados por serviços; leituras com SQL direto ou views, ignorando o ORM de domínio; atualização do read model por eventos ou por triggers e views materializadas; níveis: mesmo banco com consultas separadas até bancos distintos.',
      'Falha quando a defasagem do read model (eventual consistency) surpreende o usuário e quando duas visões duplicam lógica. Overengineering na maioria dos CRUDs.',
      'Mais código e infraestrutura para sincronizar; custo de consistência eventual. Ganho: leituras rápidas e escalonamento independente.',
      'Teste comandos com asserts no write model, o read model com dados projetados e a latência de projeção (consistência eventual) em integração.',
      'Cosmic Python (capítulo sobre CQRS); bibliotecas como eventsourcing; read models em Elasticsearch ou em materialized views do Postgres.',
      'SRP no nível arquitetural: leitura e escrita têm motivos diferentes para mudar. ISP: clientes só dependem do lado de que precisam.',
      'CQS (Bertrand Meyer) é por método; CQRS é por modelo. Event Sourcing costuma acompanhar, mas são independentes. Materialized View é uma implementação de read model.',
      'Diga: "separo comandos de queries com modelos diferentes; começo no mesmo banco e só divido se o ganho justificar". Cite a consistência eventual.'
    ]);

  P('event-sourcing', 'Event Sourcing', 'self', 'Arquitetural · Estado como log',
    'Persiste a sequência de eventos em vez do estado atual; o estado é derivado reaplicando os eventos.',
    'Dá auditoria completa e viagem no tempo. Cobra o preço em complexidade de evolução de eventos e de projeções.',
    'state = fold(apply, events)  →  append(event) em vez de UPDATE',
    ['arquitetural', 'eventos', 'auditoria'],
    ['Auditoria e histórico completos como requisito', 'Reconstruir estado em qualquer ponto do tempo', 'Domínios financeiros e de estoque', 'Alimentar vários read models'],
    ['CRUD sem necessidade de histórico', 'Quando a equipe não domina evolução de esquema de eventos', 'Consultas simples sem projeções', 'Quando exclusão de dados (LGPD) é difícil de compatibilizar'],
    'CQRS, Domain Events, Snapshot, Outbox, Append-only log.',
    [
      'Mantém todo o histórico como fonte da verdade, permitindo auditar, reprocessar e criar novas visões a qualquer momento.',
      'Event store (log append-only por stream), eventos imutáveis, aggregate que se reconstrói por apply, projeções (read models) e snapshots.',
      'Eventos como dataclasses frozen; função apply(state, event) pura e fold sobre o stream; o aggregate com método de comando que gera eventos; projeções construídas lendo o log; bibliotecas como eventsourcing.',
      'Falha pela evolução de esquema de eventos (upcasting), por streams longos sem snapshot, por exclusão de dados pessoais e por consistência eventual. Overengineering fora de domínios que pedem histórico.',
      'Escrita barata (append), leitura exige replay ou projeção; storage cresce sempre. Snapshots limitam o replay.',
      'Teste no estilo given (eventos) when (comando) then (novos eventos); teste de apply determinístico; teste de projeção e replay completo.',
      'Biblioteca eventsourcing para Python; logs como Kafka como transporte; bancos de dados em geral usam WAL como uma forma interna da ideia; Git é um event log de commits.',
      'SRP: comandos e aplicação de eventos separados. OCP: novas projeções sem mexer no domínio. A imutabilidade é central.',
      'CQRS é independente (mas costuma acompanhar); Domain Events não persistem o estado inteiro. Snapshot é otimização, não é a fonte. Audit log é só registro; Event Sourcing é a fonte.',
      'Diga: "o estado é função dos eventos; ganho histórico e novas visões, pago em evolução de esquema e consistência eventual". Aponte LGPD como ponto de atenção.'
    ]);

  P('outbox', 'Transactional Outbox', 'self', 'Arquitetural · Entrega confiável',
    'Grava o evento na mesma transação do estado e um relay o publica depois, evitando perda ou duplicação inconsistente.',
    'Resolve o dual write: salvar no banco e publicar na fila não é atômico.',
    'tx: UPDATE state + INSERT outbox  →  relay lê outbox e publica (at-least-once)',
    ['arquitetural', 'mensageria', 'consistência'],
    ['Publicar eventos de forma confiável após uma mudança de estado', 'Evitar estado salvo sem evento (ou o contrário)', 'Integração entre serviços com broker', 'Entrega at-least-once com consumidores idempotentes'],
    ['Quando não há broker e a integração é síncrona', 'Quando perder um evento é aceitável', 'Quando o consumidor não é idempotente', 'Volume tão alto que a tabela vira gargalo sem particionamento'],
    'Saga, Domain Events, Unit of Work, Idempotência, CDC.',
    [
      'Garante que o evento e a mudança de estado sejam consistentes: ambos salvos juntos, e o evento publicado depois com entrega garantida pelo menos uma vez.',
      'Tabela outbox (na mesma transação do negócio), relay ou poller (ou CDC com Debezium), broker e consumidores idempotentes.',
      'Inserir a linha da outbox dentro do mesmo UoW; um worker que lê pendentes com SELECT FOR UPDATE SKIP LOCKED, publica e marca como enviado; idempotency key no consumidor; alternativas: log tailing com CDC.',
      'Falha quando o consumidor não é idempotente (duplicatas), quando o relay vira gargalo e quando a ordem é exigida sem particionar por chave. Overengineering sem broker.',
      'Latência extra entre commit e publicação; tabela que precisa de limpeza; polling consome banco. Garante at-least-once, não exactly-once.',
      'Teste que a falha do broker não perde o evento, que o relay republica após queda, duplicatas no consumidor são ignoradas e a atomicidade (rollback não deixa linha de outbox).',
      'Padrão descrito em microservices.io; Debezium para CDC; SQLAlchemy com tabela outbox; Celery e Kafka como transporte; em Python, workers com SKIP LOCKED no Postgres.',
      'SRP: o negócio não se preocupa com o broker. DIP: a publicação por uma abstração. Reforça a atomicidade que o UoW promete.',
      'Saga coordena passos distribuídos; Outbox garante a entrega de cada mensagem. Domain Events é o conceito; Outbox é a entrega confiável. Two-phase commit é a alternativa pesada.',
      'Diga: "salvo o evento na mesma transação e um relay publica depois; é at-least-once, então o consumidor é idempotente". Resolve o dual write.'
    ]);

  P('saga', 'Saga', 'self', 'Arquitetural · Transações distribuídas',
    'Coordena uma transação de negócio entre serviços com passos locais e compensações em caso de falha.',
    'Substitui a transação distribuída (2PC) por uma sequência de transações locais, cada uma com ação compensatória.',
    'T1 → T2 → T3 ; falha em T3 → C2 → C1 (compensações)',
    ['arquitetural', 'microsserviços', 'compensação'],
    ['Processos de negócio que atravessam serviços', 'Quando 2PC não é viável', 'Fluxos longos (pedido, pagamento, estoque, envio)', 'Quando compensar é possível semanticamente'],
    ['Quando uma transação ACID local resolve', 'Quando não existe compensação possível (e-mail já enviado)', 'Fluxos que exigem isolamento forte', 'Sem observabilidade para rastrear estados'],
    'Outbox, State, Process Manager, Orchestration x Choreography.',
    [
      'Mantém consistência eventual em operações que atravessam serviços sem bloqueio global, desfazendo passos concluídos quando algo falha.',
      'Passos (transações locais), compensações, orquestrador (ou coreografia por eventos), estado persistido da saga e mensagens idempotentes.',
      'Máquina de estados persistida (Enum e tabela); orquestrador que envia comandos e reage a eventos; cada passo idempotente com chave; coreografia por eventos sem coordenador; frameworks como Temporal para workflows duráveis.',
      'Falha por compensações impossíveis, falta de idempotência, estados intermediários visíveis (sem isolamento) e dificuldade de depuração. Overengineering quando uma transação local resolve.',
      'Mais mensagens, latência acumulada e estado a persistir; consistência eventual. Exige monitoramento e retentativas.',
      'Teste o caminho feliz e a falha em cada passo verificando as compensações; teste reentrega duplicada (idempotência) e retomada após queda do orquestrador.',
      'Temporal e Celery workflows; padrão em microservices.io; AWS Step Functions como orquestrador gerenciado.',
      'SRP: cada passo uma responsabilidade; o orquestrador cuida do fluxo. DIP: serviços dependem de mensagens e contratos.',
      'Outbox garante a entrega das mensagens da saga; State modela o progresso; Process Manager é o coordenador. 2PC é a alternativa com bloqueio.',
      'Diga: "sequência de transações locais com compensações; escolho orquestração ou coreografia, e cada passo é idempotente". Fale do que não dá para compensar.'
    ]);

  P('dependency-injection', 'Dependency Injection', 'self', 'Arquitetural · Inversão de controle',
    'Fornece as dependências de um objeto de fora (construtor ou argumento) em vez de ele criá-las.',
    'A forma mais simples de DIP. Em Python, quase sempre é só passar parâmetros; containers são opcionais.',
    'Service(repo, clock)  ←  composition root monta as dependências',
    ['arquitetural', 'inversão de dependência', 'testabilidade'],
    ['Código testável com dublês', 'Trocar implementações por configuração', 'Evitar singletons e globais', 'Composition root explícito'],
    ['Quando o container vira mágica e esconde o grafo', 'Quando injeta tudo, até valores triviais', 'Scripts pequenos', 'Quando uma função com argumento padrão resolve'],
    'Service Locator, Factory, Strategy, Singleton, Hexagonal.',
    [
      'Desacopla um componente de como suas dependências são criadas, tornando-o testável e configurável.',
      'O cliente (que declara dependências), as dependências (abstrações), o injetor (composition root ou container) e as implementações.',
      'Injeção por construtor ou por argumento de função, com Protocol para o contrato e um composition root em main; functools.partial para pré-ligar; FastAPI Depends; bibliotecas como dependency-injector ou punq apenas se ganharem clareza.',
      'Falha quando o container vira Service Locator (a dependência fica escondida) e quando há dependências demais no construtor (sinal de violar SRP). Overengineering com containers em projeto pequeno.',
      'Custo de runtime desprezível; o custo é de fiação (código no composition root) e de aprender o container.',
      'Passe fakes no construtor; teste o composition root com um teste de fumaça que monta o grafo; evite monkeypatch quando a injeção cobre.',
      'FastAPI Depends; pytest fixtures (injeção por nome); Django settings e backends configuráveis; logging.config.dictConfig; unittest.mock.patch como alternativa por substituição.',
      'É a aplicação direta de DIP: dependa de abstrações. Facilita OCP e LSP nos testes. Muitos parâmetros indicam violação de SRP.',
      'Inversão de Controle é o princípio; DI é uma técnica. Service Locator busca ativamente (esconde dependências); DI entrega. Factory cria, DI entrega o criado.',
      'Diga: "em Python DI é passar a dependência por parâmetro; o composition root monta o grafo". Contraste com Service Locator e com globals.'
    ]);

  P('specification', 'Specification', 'self', 'Arquitetural · Regras combináveis',
    'Encapsula uma regra de negócio booleana em um objeto combinável com and, or e not.',
    'Reaproveita critérios para validar, filtrar e consultar com a mesma definição de regra.',
    'spec = Active() & Premium()  →  spec.is_satisfied_by(obj)',
    ['arquitetural', 'regras', 'composição'],
    ['Regras de negócio reutilizáveis e combináveis', 'Filtragem em memória e consultas com a mesma regra', 'Validações compostas', 'Critérios configuráveis'],
    ['Regras simples e únicas (uma função basta)', 'Quando traduzir para SQL é difícil e a regra vira dois códigos', 'Quando o resultado é acessado por muitas partes sem nome claro', 'Código crítico em performance'],
    'Strategy, Composite, Interpreter, Predicate, Repository.',
    [
      'Dá nome e reuso a regras de negócio, permitindo combiná-las sem copiar condições espalhadas.',
      'Specification (is_satisfied_by), especificações concretas, composites (And, Or, Not) e o cliente que valida ou filtra.',
      'Funções predicado compostas com all e any; classes com __and__, __or__ e __invert__ para sobrecarregar operadores; filter(spec, itens); expressões do SQLAlchemy para a versão traduzível a consultas.',
      'Falha quando a regra em memória e a consulta de banco divergem (duas versões da regra) e quando é usado para regras triviais. Overengineering sem combinações reais.',
      'Cada combinação adiciona chamadas; filtrar em memória é O(n). Para volumes grandes, traduza a regra para a consulta.',
      'Teste cada especificação com casos verdade e falso, as combinações (and, or, not) e que a versão SQL e a versão em memória concordam.',
      'SQLAlchemy e Django Q objects (Q(a) & Q(b)) compõem filtros; operator e functools.partial; pytest markers; django-filter; filter() embutido.',
      'SRP: uma regra por objeto. OCP: novas regras por composição sem alterar as existentes.',
      'Strategy troca algoritmo; Specification responde sim ou não. Composite é a estrutura das combinações. Interpreter pode interpretar regras de uma DSL.',
      'Diga: "uma regra de negócio vira um objeto que se combina com and, or e not". Cite Q do Django como exemplo e o risco de duplicar a regra em SQL.'
    ]);

  /* =================== CONCORRÊNCIA E PERFORMANCE =================== */
  P('producer-consumer', 'Producer-Consumer', 'rl', 'Concorrência · Fila',
    'Produtores colocam trabalho em uma fila e consumidores o processam em paralelo, desacoplando os ritmos.',
    'A fila amortece rajadas e aplica backpressure quando é limitada (maxsize).',
    'producers → Queue(maxsize) → consumers',
    ['concorrência', 'fila', 'backpressure'],
    ['Produtor e consumidor com velocidades diferentes', 'Pipelines de processamento em estágios', 'Limitar uso de memória com fila limitada', 'Distribuir trabalho entre workers'],
    ['Quando o fluxo é síncrono e simples', 'Fila ilimitada com produtor mais rápido (memória estoura)', 'Quando a ordem estrita é exigida e há vários consumidores', 'Sem plano de encerramento (sentinela) e tratamento de erro'],
    'Thread Pool, Fan-out/Fan-in, Pipeline, Task queue, Message broker.',
    [
      'Desacopla geração e processamento de trabalho, absorvendo diferenças de velocidade e permitindo paralelismo no consumo.',
      'Produtores, a fila (queue.Queue, asyncio.Queue ou multiprocessing.Queue), consumidores e o sinal de término (sentinela ou close).',
      'queue.Queue com threads para I/O; asyncio.Queue com tasks e await queue.get(); multiprocessing.Queue para CPU; maxsize para backpressure; task_done e join para saber o fim; None como sentinela por consumidor.',
      'Falha por fila ilimitada, por consumidor que morre sem task_done (join trava), por esquecer de encerrar os consumidores e por exceções engolidas. Overengineering em fluxos pequenos.',
      'Custo de sincronização por item (lock da fila) e de serialização entre processos. Para itens minúsculos, o overhead supera o ganho: agrupe em lotes.',
      'Teste com poucos itens e N consumidores, encerramento limpo, exceção em um consumidor, fila cheia (put bloqueia ou falha) e determinismo com sementes e eventos.',
      'queue.Queue na stdlib; asyncio.Queue; concurrent.futures por baixo; Celery e RQ com brokers; logging.handlers.QueueHandler; multiprocessing.Pool.',
      'SRP: produzir e consumir separados. DIP: ambos dependem do contrato da fila. OCP: mais consumidores sem alterar o produtor.',
      'Thread Pool executa tarefas; Producer-Consumer define o fluxo por fila. Fan-out/Fan-in distribui e agrega. Observer é síncrono e sem fila.',
      'Diga: "uma fila limitada entre quem gera e quem processa; maxsize dá backpressure; encerro com sentinela e uso task_done e join". Lembre do GIL para CPU.'
    ]);

  P('thread-pool', 'Thread Pool / Executor', 'rl', 'Concorrência · Workers',
    'Mantém um conjunto fixo de workers reutilizáveis que executam tarefas submetidas.',
    'Evita o custo de criar uma thread por tarefa e limita a concorrência. ThreadPoolExecutor para I/O, ProcessPoolExecutor para CPU.',
    'executor.submit(fn, *args) → Future → result()',
    ['concorrência', 'executor', 'futures'],
    ['Muitas tarefas de I/O (HTTP, disco, banco)', 'Limitar a concorrência de forma explícita', 'Paralelizar com ProcessPool tarefas de CPU', 'Rodar bloqueantes sem travar o event loop (run_in_executor)'],
    ['Tarefas CPU-bound em threads com GIL (use processos ou free-threading)', 'Quando asyncio resolve com muito mais conexões', 'Tarefas com estado compartilhado mutável sem lock', 'Pool grande demais (thrashing)'],
    'Producer-Consumer, Fan-out/Fan-in, asyncio, multiprocessing.',
    [
      'Reaproveita workers para executar muitas tarefas com concorrência limitada, evitando o custo de criar e destruir threads e o descontrole de threads ilimitadas.',
      'O executor (pool), os workers, a fila interna de tarefas, os Futures (resultado ou exceção) e o chamador.',
      'concurrent.futures.ThreadPoolExecutor ou ProcessPoolExecutor como context manager; submit e as_completed para resultados por ordem de término; map para ordem de entrada; loop.run_in_executor para integrar com asyncio.',
      'Falha com tarefas CPU-bound em threads por causa do GIL (sem ganho), por exceções só vistas ao chamar result(), por deadlock com tarefas que esperam outras do mesmo pool e por pools enormes. Em 3.13 e 3.14, o free-threading (opcional) muda a conta para CPU.',
      'Cada tarefa tem overhead de submissão; em processos, há serialização (pickle) de argumentos e resultados. O número de workers define memória e contenção; meça.',
      'Teste com um executor de 1 worker para determinismo, exceções (result levanta), timeouts e cancelamento; use um executor falso síncrono nos testes de unidade.',
      'concurrent.futures na stdlib; asyncio.to_thread; requests com ThreadPool para varreduras; multiprocessing.Pool; joblib.Parallel; Gunicorn com workers.',
      'SRP: submissão separada da execução. DIP: o código recebe um Executor abstrato. OCP: troca threads por processos sem mudar a lógica.',
      'Producer-Consumer é o padrão de fila; o Thread Pool é a implementação de workers. Fan-out/Fan-in usa o pool para distribuir. asyncio é concorrência cooperativa, não paralela.',
      'Diga: "workers reutilizáveis; threads para I/O, processos para CPU por causa do GIL, com free-threading mudando isso". Cite concurrent.futures e as_completed.'
    ]);

  P('fan-out-fan-in', 'Fan-out / Fan-in', 'rl', 'Concorrência · Distribuir e agregar',
    'Distribui uma tarefa em várias subtarefas paralelas (fan-out) e reúne os resultados (fan-in).',
    'Reduz a latência total quando as subtarefas são independentes. Em asyncio, asyncio.gather e TaskGroup são o caminho moderno.',
    'tarefa → [t1, t2, ..., tn] → agregação do resultado',
    ['concorrência', 'paralelismo', 'agregação'],
    ['Chamar vários serviços independentes e combinar', 'Processar partes de um dataset em paralelo', 'Buscas em várias fontes', 'Reduzir a latência de ponta a ponta'],
    ['Quando as subtarefas dependem umas das outras', 'Quando a falha de uma deve cancelar tudo e não há política definida', 'Quando o fan-out sem limite sobrecarrega o destino', 'Quando a agregação é o gargalo'],
    'Map-Reduce, Thread Pool, Scatter-Gather, Pipeline.',
    [
      'Corta a latência de tarefas decomponíveis executando partes em paralelo e depois combinando o resultado.',
      'O coordenador, as subtarefas independentes, o limite de concorrência, a política de erro e a etapa de agregação.',
      'asyncio.TaskGroup (3.11+) para estruturar tarefas e propagar erros com ExceptionGroup; asyncio.gather com return_exceptions; asyncio.Semaphore para limitar; concurrent.futures com as_completed.',
      'Falha por fan-out ilimitado (derruba o downstream), política de erro indefinida (uma falha cancela ou não?), timeouts ausentes e agregação que vira gargalo serial. Overengineering para poucas chamadas rápidas.',
      'Latência vira a da subtarefa mais lenta (cauda); o custo de coordenação cresce com o número de tarefas; memória por tarefa. Limite a concorrência.',
      'Teste o caminho feliz, falha parcial, timeout, cancelamento e que a concorrência máxima é respeitada (contador dentro de um Semaphore).',
      'asyncio.gather e TaskGroup; concurrent.futures.as_completed; scatter-gather em buscas distribuídas; Dask e Ray no nível de dados; httpx com vários requests.',
      'SRP: a decomposição e a agregação são responsabilidades separadas. OCP: novas fontes sem mudar o agregador.',
      'Map-Reduce é fan-out e fan-in sobre dados; Producer-Consumer é um fluxo contínuo; Thread Pool é a infraestrutura. TaskGroup traz concorrência estruturada.',
      'Diga: "disparo subtarefas independentes, limito a concorrência e agrego; defino política de erro e timeout". Use TaskGroup como forma moderna.'
    ]);

  P('circuit-breaker', 'Circuit Breaker', 'rl', 'Resiliência · Disjuntor',
    'Interrompe chamadas a um serviço que está falhando para evitar cascata e dar tempo de recuperação.',
    'Três estados: fechado (normal), aberto (falha rápido) e meio aberto (testa a recuperação com poucas chamadas).',
    'CLOSED → (falhas > limite) → OPEN → (timeout) → HALF_OPEN → CLOSED | OPEN',
    ['resiliência', 'falha rápida', 'estados'],
    ['Dependências externas instáveis', 'Evitar esgotar threads e conexões esperando um serviço morto', 'Proteger o serviço que está se recuperando', 'Falha rápida com fallback'],
    ['Chamadas locais sem I/O', 'Quando não há fallback e o erro tem de aparecer de qualquer jeito', 'Limites mal calibrados que abrem à toa', 'Operações que não toleram rejeição imediata'],
    'Retry com backoff, Timeout, Bulkhead, Rate limiting, State.',
    [
      'Evita que a falha de uma dependência derrube o chamador por esgotamento de recursos, falhando rápido e liberando carga enquanto o serviço se recupera.',
      'O breaker (estado e contadores), a operação protegida, as políticas (limite de falhas, janela, tempo de abertura) e um fallback opcional.',
      'Uma classe com estado e lock, usada como decorator ou context manager; contadores em janela deslizante; time.monotonic para o tempo de abertura; bibliotecas como pybreaker ou circuitbreaker; combinação com timeout e retry.',
      'Falha por limites mal calibrados (abre com ruído ou nunca abre), estado local por processo (cada worker tem o seu) e meio aberto que deixa passar muita carga. Overengineering sem dependências remotas.',
      'Custo por chamada desprezível (um lock e um contador); o custo real é de configuração e de observabilidade (métricas de estado).',
      'Teste as transições do estado com um relógio injetável, o fallback, a recuperação no meio aberto e concorrência em torno dos contadores.',
      'pybreaker e circuitbreaker em PyPI; Resilience4j e Hystrix na JVM como referência; service meshes aplicam o padrão fora do código.',
      'SRP: resiliência fora da regra de negócio. OCP: decorator sem alterar a função. O State interno é um State pattern.',
      'Retry repete tentativas; Circuit Breaker para de tentar. Bulkhead isola recursos; Rate limiting controla vazão. Timeout é a base de todos.',
      'Diga: "abre depois de N falhas e falha rápido; meio aberto testa a recuperação". Combine com timeout e retry com backoff e jitter.'
    ]);

  P('retry-backoff', 'Retry com backoff', 'rl', 'Resiliência · Retentativas',
    'Repete operações falhas esperando mais a cada tentativa, com jitter, até um limite.',
    'Resolve falhas transitórias. Sem backoff e jitter, retentativas sincronizadas viram tempestade contra o serviço.',
    'espera = min(cap, base * 2**tentativa) * random(0.5, 1)',
    ['resiliência', 'backoff', 'idempotência'],
    ['Falhas transitórias (timeout, 503, deadlock de banco)', 'Chamadas a APIs externas', 'Tarefas em fila com reentrega', 'Operações idempotentes'],
    ['Operações não idempotentes (cobrança duplicada)', 'Erros permanentes (400, validação)', 'Sem limite de tentativas ou de tempo total', 'Camadas aninhadas que multiplicam as tentativas'],
    'Circuit Breaker, Timeout, Idempotência, Dead Letter Queue.',
    [
      'Torna o sistema tolerante a falhas passageiras sem intervenção, evitando sobrecarregar o serviço com tentativas imediatas.',
      'A operação, a política (máximo de tentativas, base, teto e jitter), o critério do que é retriable, e o destino final da falha (dead letter).',
      'Um decorator com loop e time.sleep (ou await asyncio.sleep); exponencial com jitter aleatório; só reexecutar exceções retriable; bibliotecas como tenacity ou backoff; respeitar o cabeçalho Retry-After.',
      'Falha em operações não idempotentes, em retentativas empilhadas em camadas (3 x 3 x 3), sem limite total e sem jitter (thundering herd). Overengineering para erros que nunca são transitórios.',
      'Aumenta a latência no pior caso e a carga no serviço em falha. Defina um orçamento total de tempo.',
      'Teste com sleep injetável ou falso, a sequência de esperas (determinística com semente), que exceções não retriable não repetem e o limite de tentativas.',
      'tenacity e backoff em PyPI; urllib3.util.Retry com requests; boto3 com modos de retry; Celery autoretry_for; Kafka e brokers com reentrega.',
      'SRP: a política de retry fora da regra. OCP: decorator sem editar a função. O contrato da função (idempotência) é o que viabiliza o padrão.',
      'Circuit Breaker interrompe tentativas; Retry insiste. Timeout limita cada tentativa. Dead Letter Queue recebe o que esgotou. Idempotência é pré-requisito.',
      'Diga: "exponencial com jitter, teto e limite de tentativas, só para erro transitório e operação idempotente". Fale de thundering herd e de retry empilhado.'
    ]);

  P('rate-limiting', 'Rate limiting e Semáforo', 'rl', 'Concorrência · Controle de vazão',
    'Limita a taxa ou a concorrência de chamadas com token bucket, janela deslizante ou semáforo.',
    'Protege recursos próprios e de terceiros. Semáforo limita simultaneidade; rate limiter limita vazão no tempo.',
    'Semaphore(N) limita simultaneidade ; bucket(rate, burst) limita vazão',
    ['concorrência', 'vazão', 'semáforo'],
    ['Respeitar limites de APIs externas', 'Proteger o banco ou um serviço de picos', 'Limitar o número de conexões simultâneas', 'Justiça entre clientes (por chave)'],
    ['Quando o limite deveria ser aplicado no gateway, não em cada processo', 'Limites locais em ambiente com vários processos (precisa de estado compartilhado, como Redis)', 'Quando deixa fila crescer sem descartar ou rejeitar', 'Calibração por achismo'],
    'Circuit Breaker, Thread Pool, Backpressure, Bulkhead.',
    [
      'Controla quantas operações acontecem ao mesmo tempo (concorrência) ou por unidade de tempo (taxa), evitando sobrecarga e bloqueios por abuso.',
      'O limitador (semáforo, token bucket, leaky bucket, janela), a chave de limitação (global, por cliente), o estado e a política de excesso (esperar, rejeitar, descartar).',
      'asyncio.Semaphore ou threading.BoundedSemaphore para concorrência; token bucket com time.monotonic para taxa; Redis com scripts atômicos para limites distribuídos; bibliotecas como aiolimiter, limits e slowapi.',
      'Falha quando o limite é local e há N processos (limite real vira N vezes o configurado), quando a espera cresce sem teto e quando se esquece de liberar o semáforo (use async with). Overengineering em scripts.',
      'Custo por operação pequeno; o estado distribuído adiciona latência de Redis. O custo real é de calibração.',
      'Teste a taxa com relógio falso, o burst, a concorrência máxima observada com contador e a política de excesso (rejeita com 429 ou espera).',
      'asyncio.Semaphore; threading.BoundedSemaphore; limits e slowapi no FastAPI; nginx limit_req; boto3 respeitando throttling; aiolimiter.',
      'SRP: o controle de vazão separado da regra. OCP: o limitador como decorator ou dependência injetada.',
      'Semáforo limita simultaneidade, não taxa. Thread Pool também limita concorrência. Circuit Breaker reage a falhas; Rate limiting previne a sobrecarga. Backpressure é a versão por fila.',
      'Diga: "semáforo limita simultâneos, token bucket limita taxa; em múltiplos processos o estado precisa ser compartilhado". Use async with para liberar sempre.'
    ]);

  P('memoization', 'Memoization / Cache', 'rl', 'Performance · Cache de resultados',
    'Guarda o resultado de chamadas puras para reaproveitá-lo quando os mesmos argumentos reaparecem.',
    'functools.cache e lru_cache entregam o padrão pronto. Só vale para funções puras, com argumentos hashable e custo que compense.',
    '@cache  →  f(x) calcula uma vez por x e devolve do dict depois',
    ['performance', 'cache', 'funções puras'],
    ['Funções puras e caras (recursão, parsing, I/O estático)', 'Programação dinâmica (Fibonacci, grafos)', 'Resultados repetidos de configuração', 'Cache com tamanho limitado (lru_cache(maxsize=N))'],
    ['Funções com efeitos colaterais ou dependentes de tempo', 'Argumentos mutáveis ou não hashable', 'Cache ilimitado em serviço de longa vida (vazamento)', 'Dados que mudam e exigem invalidação'],
    'Lazy evaluation, Flyweight, Proxy, Cache-aside, Redis.',
    [
      'Evita recomputar resultados idênticos, trocando memória por tempo, e é a base da programação dinâmica top-down.',
      'A função pura, a chave (derivada dos argumentos), o armazenamento (dict, LRU) e a política de despejo e invalidação.',
      'functools.cache (ilimitado) e functools.lru_cache(maxsize=N); cached_property para métodos de instância; cache_info() para medir hit rate; chaves hashable. Para cache distribuído, cache-aside com Redis e TTL.',
      'Falha em métodos de instância (o cache segura self e vaza memória), argumentos mutáveis, funções impuras e invalidação. Cache ilimitado em serviço de longa duração vira memory leak. Cuidado com stampede.',
      'O(1) por consulta; memória cresce com o número de chaves únicas. Em free-threading, o cache é thread-safe mas pode computar duas vezes a mesma chave concorrentemente.',
      'Teste que a segunda chamada não executa a função (contador ou mock), o limite do LRU, cache_clear entre testes e a invalidação com TTL falso.',
      'functools.cache, lru_cache e cached_property; Django cache framework; Redis e memcached; requests-cache; joblib.Memory para resultados em disco.',
      'SRP: o cache como decorator, fora da regra. OCP: ativado sem alterar a função. LSP: a função memoizada deve manter o mesmo contrato.',
      'Lazy evaluation adia o cálculo; Memoization o guarda. Flyweight guarda objetos; Memoization guarda resultados. Cache-aside é memoization distribuída com invalidação.',
      'Diga: "só para função pura e hashable; lru_cache com maxsize em serviço de longa vida; cuidado com self em métodos". Cite cache_info para medir.'
    ]);

  P('lazy-evaluation', 'Lazy evaluation', 'rl', 'Performance · Avaliação adiada',
    'Adia o cálculo até que o resultado seja necessário e o descarta assim que possível.',
    'Generators, iteradores e cached_property permitem processar dados maiores que a memória e evitar trabalho inútil.',
    'generator (yield) → computa sob demanda → consumo único',
    ['performance', 'generators', 'streaming'],
    ['Streams e arquivos maiores que a memória', 'Pipelines de transformação encadeados', 'Atributos caros usados raramente (cached_property)', 'Curto-circuito (any, next com default)'],
    ['Quando precisa de acesso aleatório ou várias passadas', 'Quando erros só aparecem tarde, longe da origem', 'Quando o efeito colateral precisa acontecer já', 'Quando a materialização é pequena e simples'],
    'Iterator, Memoization, Proxy, itertools, Generator expressions.',
    [
      'Economiza memória e CPU: só calcula o que é consumido, e permite processar fluxos potencialmente infinitos.',
      'O produtor lazy (generator, expressão geradora, iterador), os consumidores e as etapas intermediárias encadeadas.',
      'Generators com yield e yield from; expressões geradoras em vez de list comprehension; itertools (islice, chain, takewhile); cached_property para atributos; any e all com curto-circuito; leitura por linha em arquivos.',
      'Falha quando o generator é consumido duas vezes (fica vazio), quando os erros surgem longe da definição e quando a lógica depende de efeitos colaterais na ordem. Vira overengineering em dados pequenos.',
      'Memória O(1) em pipelines; custo por elemento e overhead de frames em generators. Materializar com list() desfaz o ganho.',
      'Teste a sequência com list(), a exaustão, o laziness (que nada executa antes do consumo, com contador), e a interrupção parcial (islice).',
      'open() iterando linhas; range; map e filter; itertools; Django QuerySet (lazy até avaliar); pandas chunksize; polars LazyFrame.',
      'SRP: cada etapa do pipeline faz uma transformação. OCP: novas etapas encadeiam sem mudar as outras.',
      'Iterator é o protocolo; lazy evaluation é a estratégia. Memoization guarda resultados; lazy adia. Proxy virtual é lazy loading de objeto.',
      'Diga: "só computo o necessário; generators para streams; cuidado com consumo único". Cite QuerySet do Django e polars LazyFrame como exemplos.'
    ]);

  P('batching', 'Batching', 'rl', 'Performance · Agrupar operações',
    'Agrupa várias operações pequenas em uma só para amortizar custos fixos de I/O, rede ou serialização.',
    'Reduz round-trips e overhead por chamada. O ganho é grande quando o custo fixo domina o custo por item.',
    'for lote in batched(itens, n): operacao(lote)',
    ['performance', 'I/O', 'amortização'],
    ['Inserts em lote no banco', 'Chamadas de API que aceitam várias entradas', 'Escrita em disco e rede', 'Inferência de modelos em lote'],
    ['Quando a latência individual importa mais que a vazão', 'Lotes grandes demais estouram memória ou timeout', 'Quando um erro invalida o lote inteiro sem estratégia', 'Quando o destino não aceita lotes'],
    'Producer-Consumer, Vectorization, Unit of Work, Debounce.',
    [
      'Troca latência por vazão: um custo fixo (round-trip, commit, cabeçalho) é pago uma vez por lote em vez de por item.',
      'A fonte de itens, o buffer, a política de fechamento do lote (tamanho e tempo) e o destino que aceita lotes.',
      'itertools.batched (3.12+) para fatiar iteráveis; executemany e COPY no banco; bulk_create no Django; buffers com tamanho máximo e flush por tempo (micro-batching); asyncio com queue e timeout.',
      'Falha quando o lote é grande demais (memória, timeout), quando o erro de um item derruba todos sem tratamento parcial e quando a latência do primeiro item cresce sem flush por tempo. Overengineering em baixa vazão.',
      'Memória proporcional ao lote; latência até o fechamento. Em troca, vazão muito maior em I/O. Meça o ponto ótimo do tamanho de lote.',
      'Teste lotes de tamanho exato, resto parcial, vazio, flush por tempo, erro em um item e que a ordem e a idempotência são preservadas.',
      'itertools.batched na stdlib (3.12+); Django bulk_create; SQLAlchemy insert com várias linhas e psycopg COPY; boto3 batch_write_item; logging.handlers.MemoryHandler.',
      'SRP: agrupar separado de processar. OCP: o destino recebe lotes sem saber quem os formou.',
      'Vectorization é lote em CPU com SIMD; Batching amortiza custo de chamada. Producer-Consumer enfileira; Batching agrupa. Unit of Work agrupa em transação.',
      'Diga: "amortizo o custo fixo agrupando; fecho o lote por tamanho e por tempo". Cite executemany ou bulk_create e itertools.batched.'
    ]);

  P('vectorization', 'Vectorization', 'rl', 'Performance · Operações em array',
    'Expressa o cálculo como operações sobre arrays inteiros, executadas em código compilado, no lugar de laços Python.',
    'NumPy, pandas e polars movem o laço para C, Rust ou SIMD. Em geral, a maior alavanca de performance em Python numérico.',
    'a * b + c  (sobre arrays)  em vez de  for i in range(n)',
    ['performance', 'NumPy', 'SIMD'],
    ['Cálculo numérico sobre grandes arrays', 'Transformações de colunas em DataFrames', 'Substituir laços Python em dados tabulares', 'Operações que existem prontas na biblioteca'],
    ['Lógica com dependência entre iterações (recorrências)', 'Quando o array temporário estoura a memória', 'Código com muitos ramos por elemento', 'Dados pequenos em que o overhead não compensa'],
    'Batching, Lazy evaluation, Numba, apply (anti-padrão), JIT.',
    [
      'Elimina o custo por iteração do interpretador executando o laço em código nativo, com SIMD e uso eficiente de cache.',
      'Arrays com tipo homogêneo (ndarray, Series, polars), ufuncs e operações da biblioteca, e broadcasting para alinhar formas.',
      'Operadores e ufuncs do NumPy; where, clip e boolean masks no lugar de if; pandas e polars com expressões em vez de apply linha a linha; Numba ou Cython quando a vetorização não expressa o algoritmo; meça com timeit.',
      'Falha quando as iterações dependem umas das outras, quando os temporários consomem memória demais (use blocos ou numexpr) e quando o código vira ilegível de tão encadeado. Overengineering em dados pequenos.',
      'Memória extra por temporários; ganho típico de ordens de grandeza sobre laço Python em arrays grandes (meça no seu caso). O custo de conversão entre estruturas pode comer o ganho.',
      'Compare o resultado vetorizado com a versão em laço (referência lenta) em dados pequenos e aleatórios; propriedade com hypothesis; benchmark com timeit em tamanhos crescentes.',
      'NumPy ufuncs e broadcasting; pandas operações por coluna; polars expressões; scipy; PyTorch tensores; Numba como compilador JIT.',
      'OCP e SRP em menor grau; a questão aqui é eficiência, não estrutura. A clareza fica em dar nomes às expressões intermediárias.',
      'Batching agrupa chamadas; Vectorization agrupa o cálculo. apply linha a linha no pandas é um laço Python disfarçado. Numba compila o laço em vez de vetorizar.',
      'Diga: "tiro o laço do interpretador e uso operações sobre o array inteiro; meço com timeit e vigio a memória dos temporários". Cite o anti-padrão apply.'
    ]);

  P('map-reduce', 'Map-Reduce', 'rl', 'Performance · Dividir e agregar',
    'Aplica uma função a cada elemento (map) em paralelo e combina os resultados com uma operação associativa (reduce).',
    'Base do processamento distribuído de dados. A associatividade do reduce é o que permite paralelizar e reordenar.',
    'reduce(combine, map(f, partições))  (combine associativa)',
    ['performance', 'paralelismo', 'big data'],
    ['Agregações sobre grandes volumes particionáveis', 'Contagem de palavras, somas, estatísticas', 'Processamento embaraçosamente paralelo', 'Pipelines em Spark, Dask ou multiprocessing'],
    ['Quando a operação não é associativa', 'Quando os dados cabem na memória e um laço simples basta', 'Quando o shuffle domina o custo', 'Tarefas com dependência entre elementos'],
    'Fan-out/Fan-in, Vectorization, Thread Pool, Spark.',
    [
      'Processa grandes volumes dividindo em partes independentes (map) e combinando resultados parciais (reduce), escalando horizontalmente.',
      'A função map, a função reduce (associativa e comutativa quando possível), o particionamento, o shuffle entre fases e o coordenador.',
      'map e functools.reduce em memória; multiprocessing.Pool.map com chunksize e reduce no final; collections.Counter e a soma de Counters; Dask e Spark (PySpark) para escala distribuída; combinadores em dois níveis para reduzir o shuffle.',
      'Falha com operações não associativas, com skew de dados (uma partição gigante) e com shuffle excessivo. Em dados que cabem na memória, o overhead do paralelismo supera o ganho.',
      'Custo de serialização, de shuffle e de coordenação; ganho com particionamento equilibrado e combinadores locais. Meça a escala (speedup versus workers).',
      'Teste o reduce pela associatividade (propriedade com hypothesis: ordem das partições não altera o resultado) e compare com a versão sequencial em dados pequenos.',
      'functools.reduce e map; multiprocessing.Pool; Counter para wordcount; PySpark RDD e DataFrame; Dask bag e dataframe; Hadoop como origem do modelo.',
      'SRP: map e reduce são funções puras e separadas. OCP: troca-se a função de redução sem mudar o motor.',
      'Fan-out/Fan-in é o esqueleto de concorrência; Map-Reduce é o modelo para dados. Vectorization faz o equivalente em um array local. Pipeline encadeia transformações.',
      'Diga: "map em paralelo por partição e reduce associativo; combinadores locais diminuem o shuffle; cuido de skew". Dê o exemplo de contagem de palavras.'
    ]);

  window.ALGORITHMS = LIST;
})();
