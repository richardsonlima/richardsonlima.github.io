/* Pipeline case study data, full coverage of the 5-stage
   speaker-separation pipeline + AWS/OSS production views + MLOps lessons.
   Source: uploads/*.md (README + 01–05 stage docs). */

window.PIPELINE_STAGES = [
  /* ---------- 01 · Pre-processing ---------- */
  {
    title: 'Pré-processamento',
    sub: 'Normaliza qualquer WAV para o formato canônico que todo estágio seguinte assume.',
    tags: [{k:'dsp',t:'DSP'},{k:'env',t:'LOCAL · CPU'}],
    body: `
      <h4>Propósito</h4>
      <p>Todo estágio downstream assume um <strong>formato canônico</strong>: um único canal (mono), sample rate fixo e amplitude sã. Gravações reais quase nunca chegam assim, telefone estéreo, memo de voz a 44,1 kHz, áudio clipado ou muito baixo. O estágio 01 normaliza uma vez, para que ninguém depois precise re-checar.</p>
      <p><strong>Não usa modelo</strong>, é DSP puro. Entrada: <code>input/input.wav</code> · Saída: <code>output/input_processed.wav</code>.</p>

      <h4>Pipeline interno</h4>
      <div class="miniflow">
        <span class="mf">load (soundfile)</span><span class="a">→</span>
        <span class="mf">mono</span><span class="a">→</span>
        <span class="mf">resample 16 kHz</span><span class="a">→</span>
        <span class="mf">peak-norm 0.95</span><span class="a">→</span>
        <span class="mf ok">write PCM_16</span>
      </div>

      <h4>Técnicas, em detalhe</h4>
      <ul>
        <li><strong>Carregamento.</strong> <code>soundfile.read</code> decodifica WAV via libsndfile direto para NumPy float, sem passo lossy. 0 samples vira erro explícito de "áudio vazio" em vez de propagar silenciosamente.</li>
        <li><strong>Mono por média de canais.</strong> <code>mono[n] = (1/C)·Σ canal_c[n]</code>, média (não "pega só o esquerdo") preserva energia de todos os canais e evita descartar um falante gravado só num lado do estéreo.</li>
        <li><strong>Resample band-limited.</strong> <code>librosa.resample</code> usa soxr (windowed-sinc polifásico): low-pass até a nova Nyquist antes de decimar (evita <em>aliasing</em>), kernel sinc preserva detalhe espectral da fala.</li>
        <li><strong>Peak normalization a 0.95.</strong> <code>fator = 0.95 / max(|x|)</code>, deixa headroom contra overshoot inter-sample. É normalização de <em>pico</em>, não de loudness (sem LUFS): o objetivo é usar a faixa dinâmica sem clipar antes dos modelos, sensíveis à escala de amplitude.</li>
      </ul>

      <div class="callout tip"><strong>POR QUE 16 kHz</strong>
      Não é arbitrário: é o sample rate nativo de MossFormer2/3, SepFormer (checkpoints 16 kHz) e dos modelos pyannote dos estágios 03/04. Resamplear uma vez aqui deixa todo estágio seguinte pular sua própria lógica de resample.</div>

      <h4>Modos de falha tratados</h4>
      <table class="kv-table"><thead><tr><th>Condição</th><th>Comportamento</th></tr></thead><tbody>
        <tr><td>Arquivo ausente / extensão errada</td><td>Falha em <code>validate_wav_file</code> antes de qualquer decode</td></tr>
        <tr><td>Existe mas tem 0 samples</td><td>Erro explícito "empty audio file"</td></tr>
        <tr><td>Todos os samples = 0</td><td>Erro "contains only silence" (peak-norm dividiria por zero)</td></tr>
      </tbody></table>

      <h4>Observabilidade & config</h4>
      <ul>
        <li>Barra <strong>Rich</strong> (1 tick por sub-passo), logs <strong>Loguru</strong> (sample rate original/final, duração, tempo, memória), seção <code>preprocessing</code> em <code>relatorio_execucao.json</code>.</li>
        <li>Knobs em <code>config.py</code>: <code>SAMPLE_RATE</code> (16000), <code>INPUT_FILENAME</code>, <code>PREPROCESSED_FILENAME</code>.</li>
      </ul>`
  },

  /* ---------- 02 · Validation ---------- */
  {
    title: 'Validação',
    sub: 'Fail-fast local e grátis, antes de gastar GPU e round-trip de Colab.',
    tags: [{k:'dsp',t:'DSP'},{k:'env',t:'LOCAL · CPU'}],
    body: `
      <h4>Propósito</h4>
      <p>O estágio 03 é o mais caro do pipeline, GPU, round-trip de Colab, minutos de compute. O estágio 02 existe para <strong>falhar rápido, localmente, de graça</strong>, pegando problemas que o pré-processamento não corrige sozinho (uma gravação que era silêncio, ou truncada por upload ruim).</p>
      <p><strong>Não usa modelo</strong>, checagens determinísticas de qualidade de sinal.</p>

      <h4>Checagens (coleta TODAS antes de falhar)</h4>
      <div class="miniflow">
        <span class="mf">sample rate</span><span class="a">·</span>
        <span class="mf">== mono?</span><span class="a">·</span>
        <span class="mf">duração ≥ 1s</span><span class="a">·</span>
        <span class="mf">isfinite (NaN/Inf)</span><span class="a">·</span>
        <span class="mf">RMS ≥ 1e-4</span>
      </div>
      <p>Diferente do 01 (que para no primeiro problema bloqueante), o 02 <strong>coleta cada issue</strong> antes de falhar, uma rodada te diz tudo que está errado, sem ciclos de corrige-um-erro-por-vez.</p>

      <h4>Técnicas, em detalhe</h4>
      <ul>
        <li><strong>Header barato primeiro.</strong> <code>soundfile.info()</code> lê só o header (sample rate, canais, frames) sem decodificar o payload, as três primeiras checagens rodam em microssegundos mesmo num áudio longo.</li>
        <li><strong>Duração.</strong> <code>duração = frames / sample_rate</code> vs <code>MIN_DURATION_SECONDS = 1.0</code>. Abaixo de 1s não há sinal suficiente para a segmentação do estágio 04 decidir fala/não-fala.</li>
        <li><strong>Sanidade numérica.</strong> <code>numpy.isfinite(data).all()</code>, NaN/±Inf de um codec malfeito propagaria como <code>NaN loss</code> ou <code>CUDA error</code> minutos adentro do Colab, longe da causa raiz. Pego aqui, de graça.</li>
        <li><strong>Silêncio via RMS.</strong> <code>RMS = √( (1/N)·Σ x[n]² )</code>, energia "típica" do sinal (≠ pico). <code>RMS < 1e-4</code> = silêncio efetivo; threshold minúsculo pega só gravações genuinamente vazias, não fala baixa mas válida.</li>
      </ul>

      <div class="callout tip"><strong>01 vs 02: DUAS NOÇÕES DE SILÊNCIO</strong>
      O 01 rejeita só silêncio digital <em>exato</em> (todo sample bit-a-bit 0, que quebraria a peak-norm). O RMS do 02 pega o caso mais amplo: gravação tecnicamente não-zero (ruído de fundo, offset DC, cliques) mas sem conteúdo de fala.</div>

      <h4>Observabilidade & config</h4>
      <ul>
        <li>Seção <code>validation</code> em <code>relatorio_execucao.json</code> com cada valor medido (<code>sample_rate_hz</code>, <code>channels</code>, <code>audio_duration_seconds</code>, <code>rms</code>) e a lista de <code>issues</code>, mesmo quando passa, para auditar borderline depois.</li>
        <li>Constantes locais ao script (política de validação, não config compartilhada): <code>MIN_DURATION_SECONDS=1.0</code>, <code>SILENCE_RMS_THRESHOLD=1e-4</code>.</li>
      </ul>`
  },

  /* ---------- 03 · Voice separation ---------- */
  {
    title: 'Separação de vozes',
    sub: 'Desembaralha vozes sobrepostas em um stream por fonte acústica. O estágio mais pesado.',
    tags: [{k:'ml',t:'ML · Transformer'},{k:'envc',t:'COLAB · GPU'}],
    body: `
      <h4>Propósito</h4>
      <p>Dado um sinal misto com duas (ou mais) pessoas falando, possivelmente ao mesmo tempo, estima <strong>um stream por fonte acústica</strong>. É o único estágio que roda em Colab: transformers de dezenas de milhões de parâmetros sobre waveforms de minutos.</p>
      <div class="callout tip"><strong>VOICE ≠ SPEAKER SEPARATION</strong>
      O modelo não tem noção de <em>identidade</em>, separa <em>fontes acústicas</em> por padrões espectro-temporais aprendidos, sem saber <em>quem</em> fala. Descobrir quem é o trabalho do estágio 04; casar falante↔fonte é o do 05.</div>

      <h4>Seleção automática de modelo</h4>
      <div class="miniflow">
        <span class="mf">MossFormer3</span><span class="a">→ falhou →</span>
        <span class="mf">MossFormer2</span><span class="a">→ falhou →</span>
        <span class="mf">SepFormer</span><span class="a">→ falhou →</span>
        <span class="mf fail">RuntimeError</span>
      </div>
      <p><code>select_best_model()</code> percorre a lista de prioridade e usa o <strong>primeiro que carrega</strong> (import OK <em>e</em> download de pesos OK). Assim: se um checkpoint MossFormer3 for publicado no futuro, é pego automaticamente (é tentado primeiro); rede instável degrada graciosamente; o modelo usado é sempre logado em <code>voice_separation.model_used</code> para rastreabilidade. Override com <code>--model MossFormer2</code>.</p>

      <h4>As famílias de modelo</h4>
      <p>Os três candidatos compartilham a forma <strong>encoder → rede de estimação de máscara → decoder</strong> operando direto no waveform (<em>time-domain</em>, sem reconstrução de fase), diferindo em como modelam contexto:</p>
      <ul>
        <li><strong>MossFormer / MossFormer2 (Alibaba).</strong> Transformer aumentado por convolução. MossFormer usa <em>gated single-head attention</em> combinando self-attention completa em chunks <em>locais</em> + atenção linearizada sobre a <em>sequência inteira</em>. MossFormer2 acrescenta um módulo recorrente ("RNN-free") via FSMN com convoluções dilatadas, Transformer capta estrutura global, ramo recorrente capta padrões locais.</li>
        <li><strong>SepFormer (SpeechBrain).</strong> Transformer <em>dual-path</em>. Encoder conv 1-D (256 filtros, kernel 16, stride 8); máscara com <em>IntraTransformer</em> (dependências dentro de cada chunk) + <em>InterTransformer</em> (entre chunks); decoder conv transposta. Mesma ideia de eficiência local+global do MossFormer, descoberta independentemente.</li>
      </ul>

      <h4>Chunked inference para gravações longas</h4>
      <p>SepFormer <strong>não</strong> faz chunk interno, roda o waveform inteiro num forward pass, o que num arquivo de 11 min estourou os 16 GB de VRAM de um T4 (<code>CUDA OutOfMemoryError</code> real). A solução envolve <strong>todo</strong> modelo numa camada de chunking genérica:</p>
      <div class="miniflow">
        <span class="mf">janelas 30s, overlap 25%</span><span class="a">→</span>
        <span class="mf">roda cada uma</span><span class="a">→</span>
        <span class="mf">reordena p/ casar tail anterior</span><span class="a">→</span>
        <span class="mf ok">crossfade linear</span>
      </div>
      <div class="callout warn"><strong>PERMUTATION INVARIANCE</strong>
      Modelos de separação são treinados com loss invariante a permutação, nada garante que "source 0" seja o mesmo falante em duas chamadas. <code>_reorder_to_match</code> compara o head de cada janela com o tail da anterior (mesmo trecho, dois pontos de vista) por similaridade cosseno antes do crossfade, senão os falantes trocariam no meio da gravação. O crossfade linear (não corte seco) elimina o clique em cada fronteira de janela.</div>

      <h4>Detalhes do projeto & expectativas</h4>
      <ul>
        <li><strong>Nº fixo de fontes.</strong> Modelos treinados p/ contagem fixa (tipicamente 2). Mais falantes → o estágio 05 compensa com time-masking por segmento diarizado.</li>
        <li><strong>Device.</strong> <code>detect_device()</code>: CUDA → MPS → CPU, com aviso visível se cair para CPU.</li>
        <li><strong>Contrato de saída.</strong> Todo wrapper normaliza para <code>list[np.ndarray]</code>, um array mono por fonte, PCM 16-bit, o estágio 05 não precisa saber qual modelo produziu.</li>
        <li><strong>Realismo.</strong> São modelos 2021–2023 treinados em misturas <em>sintéticas</em> de fala limpa (WSJ0, LibriMix, WHAM/WHAMR). Timbre "robótico" residual em gravação real é limitação conhecida da geração, não necessariamente bug. O config <code>MossFormer2_SS_16K</code> decodifica em janelas de 2s, costura audível a cada ~1,5s é mecanismo confirmado de "graininess".</li>
      </ul>`
  },

  /* ---------- 04 · Diarization ---------- */
  {
    title: 'Diarização',
    sub: '"Quem falou quando?", particiona a timeline e rotula falantes, sem separar áudio.',
    tags: [{k:'ml',t:'ML · CNN+RNN+cluster'},{k:'env',t:'LOCAL · CPU/MPS'}],
    body: `
      <h4>Propósito</h4>
      <p>Diarização responde <strong>"quem falou quando?"</strong>, parte a timeline em segmentos de fala e atribui rótulos (<code>SPEAKER_00</code>, <code>SPEAKER_01</code>…), sem saber o conteúdo e <strong>sem precisar das fontes do estágio 03</strong>. Roda no áudio <em>misto</em> original, porque modelos de diarização são treinados em conversação natural, não separada. Essa independência é o que deixa <code>--pre-colab</code> rodá-lo antes do 03.</p>
      <p>Modelo: <code>pyannote/speaker-diarization-community-1</code>. Não é uma rede, é um <strong>pipeline orquestrado</strong> de três modelos + clustering clássico.</p>

      <h4>Dentro do pipeline pyannote</h4>
      <div class="miniflow">
        <span class="mf">1 · segmentação</span><span class="a">→</span>
        <span class="mf">2 · contagem</span><span class="a">→</span>
        <span class="mf">3 · embeddings</span><span class="a">→</span>
        <span class="mf">4 · clustering</span><span class="a">→</span>
        <span class="mf ok">5 · discretização → RTTM</span>
      </div>
      <ul>
        <li><strong>1 · Segmentação, CNN + RNN (PyanNet).</strong> <code>waveform → SincNet → 4× BiLSTM → 2× Linear → softmax 7 classes</code>. SincNet = front-end conv restrito (60 filtros band-pass sinc, kernel 251, stride 10) que aprende um filterbank interpretável e downsampleia p/ ~59 Hz. BiLSTM modela contexto temporal bidirecional. Saída <em>powerset</em> de 7 classes (silêncio, A, B, C, A+B, A+C, B+C), lida com <strong>fala sobreposta</strong> nativamente, sem passo separado.</li>
        <li><strong>2 · Contagem de falantes.</strong> Estima quantos falantes distintos existem no total.</li>
        <li><strong>3 · Embedding, CNN (WeSpeaker).</strong> Cada turno vira um vetor fixo capturando <em>características de voz</em> (timbre, pitch, formantes) independente do conteúdo. Arquitetura ResNet-style, linhagem x-vector/ECAPA-TDNN.</li>
        <li><strong>4 · Clustering, ML clássico.</strong> Agglomerative hierárquico: cada turno começa como cluster próprio, funde os dois mais próximos por distância até um critério de parada. É o que dá consistência cross-segment a cada rótulo. <em>Sem gradientes, sem treino</em>, só distância no inference.</li>
      </ul>
      <div class="callout tip"><strong>COMMUNITY-1 vs 3.1</strong>
      Reusa a segmentação do 3.1 mas melhora <em>contagem e atribuição</em> de falantes. Escolhido por default porque precisa de <strong>uma</strong> aceitação de termos no Hugging Face (repo único), em vez dos dois repos gated do pipeline antigo.</div>

      <h4>Pós-processamento & saída</h4>
      <ul>
        <li>Usa <code>speaker_diarization</code> (mantém overlaps, o estágio 05 precisa saber quando dois falam junto), não a versão exclusiva.</li>
        <li>Calcula tempo total por falante e descarta quem fica abaixo de <code>MIN_SPEAKER_DURATION</code> (0.5s), filtra micro-segmentos espúrios (tosse, interjeição) e loga os descartados.</li>
        <li>Controle de contagem: <code>NUM_SPEAKERS</code> (exato) ou <code>MIN/MAX_SPEAKERS</code> (default max 6).</li>
        <li>Saída <strong>RTTM</strong> (NIST Rich Transcription Time Marked): <code>SPEAKER uri 1 start dur &lt;NA&gt; &lt;NA&gt; SPEAKER_00 &lt;NA&gt; &lt;NA&gt;</code>, texto plano, tool-agnóstico, consumível por outras ferramentas.</li>
      </ul>
      <div class="callout warn"><strong>PRÉ-REQUISITO</strong>
      Exige conta Hugging Face com token que aceitou os termos de <code>community-1</code>. Todo modo de falha de auth (token ausente, inválido, termos não aceitos) é capturado com mensagem acionável, não stack trace cru.</div>`
  },

  /* ---------- 05 · Track generation ---------- */
  {
    title: 'Geração de faixas',
    sub: 'Funde 03 + 04: decide qual fonte é de cada falante e monta uma faixa limpa por pessoa.',
    tags: [{k:'dsp',t:'FUSÃO'},{k:'env',t:'LOCAL · CPU'}],
    body: `
      <h4>Propósito</h4>
      <p>Os estágios 03 e 04 resolvem metade do problema cada: o 03 sabe <em>como cada fonte soa</em> mas não de quem é; o 04 sabe <em>exatamente quando cada falante fala</em> mas só tem timestamps. O estágio 05 é a <strong>fusão</strong>: para cada falante, decide qual fonte separada é dele e constrói uma faixa só-daquele-falante, mantendo a fonte apenas durante os segmentos dele e silenciando o resto.</p>
      <p><strong>Não usa modelo</strong>, funde as saídas com signal processing. Entrada: <code>source_*.wav</code> + <code>diarization.rttm</code> · Saída: <code>speaker_01.wav</code>, <code>speaker_02.wav</code>…</p>

      <h4>Algoritmo</h4>
      <div class="miniflow">
        <span class="mf">merge segmentos &lt;0.3s</span><span class="a">→</span>
        <span class="mf">score fonte↔falante</span><span class="a">→</span>
        <span class="mf">argmax por falante</span><span class="a">→</span>
        <span class="mf">time-mask</span><span class="a">→</span>
        <span class="mf ok">fade 8ms → WAV</span>
      </div>
      <ul>
        <li><strong>Merge de segmentos.</strong> Turnos do mesmo falante separados por gap < <code>MERGE_GAP_SECONDS</code> (0.3s) são unidos. Diarização fragmenta uma fala contínua em vários turnos ao redor de pausas/backchannels; menos segmentos = menos fades = faixa menos "gated". O report loga contagem raw e pós-merge.</li>
        <li><strong>Matching por concentration ratio.</strong> <code>score = Σ_{t∈segmentos} fonte[t]² ÷ Σ_t fonte[t]²</code>, fração da energia da fonte que cai dentro dos turnos do falante. Não é comparação de energia bruta: normalizar pela energia total da própria fonte torna scores comparáveis, então a fonte mais alta não ganha todo falante por default.</li>
        <li><strong>Independente por falante (não 1-a-1).</strong> Se a diarização acha mais falantes que o modelo tem fontes (comum: 2 fontes, 3+ pessoas), forçar unicidade é impossível. Dois falantes podem legitimamente ir para a <em>mesma</em> fonte, o time-masking é o que ainda produz arquivos utilizáveis.</li>
        <li><strong>Time-masking.</strong> A faixa começa toda <em>zero</em> (silêncio); para cada segmento <code>[start,end]</code> do falante, copia a fatia correspondente da fonte escolhida. Por isso o WAV tem conteúdo só nos turnos do próprio falante. Qualidade só degrada na fala <em>simultânea</em> de dois falantes numa fonte compartilhada, limitação fundamental de modelo com nº fixo de fontes.</li>
        <li><strong>Fades anti-clique.</strong> Corte seco num sample arbitrário gera "clique". Rampa linear de 8ms no início/fim de cada segmento: <code>fade_in[i]=i/N</code>, <code>fade_out[i]=1−i/N</code>, curta o bastante p/ ser inaudível, longa o bastante p/ eliminar a descontinuidade.</li>
        <li><strong>Alinhamento.</strong> Cada fonte é zero-padded/truncada ao comprimento de referência (samples do pré-processado) antes do match, garante que toda fatia <code>source[start:end]</code> esteja em-bounds e alinhada à timeline do RTTM.</li>
      </ul>

      <div class="callout tip"><strong>NUMERAÇÃO INTUITIVA</strong>
      Arquivos numerados por <em>ordem cronológica de primeira aparição</em> (quem fala primeiro = <code>speaker_01</code>), não pelos IDs internos <code>SPEAKER_00/01</code> do pyannote, mapeia para "a primeira pessoa a falar", o enquadramento mais natural para quem revisa.</div>

      <h4>Métricas reportadas</h4>
      <p>Por falante, <code>track_generation</code> registra: índice da fonte escolhida, score vencedor, contagem de segmentos raw/pós-merge e duração total de fala, suficiente para achar um match ruim (score baixo inesperado) ou diarização fragmentada sem re-ouvir todo arquivo.</p>`
  }
];

/* ---------------- Production architectures ---------------- */

window.ARCH_AWS = {
  layers: [
    { t:'Ingestão', d:'Gravações caem no <b>S3 (raw/)</b> via Transfer Family ou upload de serviço; notificação <b>EventBridge</b> dispara o pipeline, event-driven, sem polling.' },
    { t:'Orquestração', d:'<b>Step Functions</b> (ou Amazon MWAA/Airflow), state machine visual, retryable.' },
    { t:'Validação & pré-processamento', d:'<b>Lambda</b> (arquivos curtos) / <b>SageMaker Processing</b> (longos) = estágios 01+02. Falha na validação → alerta SNS + bucket de quarentena (raw-rejected/).' },
    { t:'Inferência (ramos paralelos)', d:'<b>SageMaker Async Inference / Batch Transform</b> em GPU (ml.g5.*) = estágio 03; <b>SageMaker Processing</b> CPU = estágio 04. Containers em <b>ECR</b>, right-sized separadamente.' },
    { t:'Fusão & registry', d:'<b>SageMaker Processing</b> = estágio 05 (match + geração). <b>SageMaker Model Registry</b> versiona e registra lineage de cada container de modelo que produziu a run.' },
    { t:'Armazenamento & acesso', d:'<b>S3 processed/</b> (speaker_XX.wav, RTTM); <b>Glue Catalog + Athena</b> p/ consultar métricas; <b>KMS</b> encryption, <b>IAM</b> least-privilege, só <b>VPC endpoints</b>.' },
    { t:'Monitoramento & feedback', d:'<b>CloudWatch</b> (latência, erro, GPU); <b>SageMaker Model Monitor</b> (drift de qualidade/RMS do áudio de entrada); <b>Ground Truth</b> p/ amostra de QA manual → métrica de qualidade.' },
    { t:'Fine-tuning opcional', d:'<b>EventBridge</b> (alarme de drift ou cadência) → <b>SageMaker Training Job</b> (domain-adapt) → <b>gate de avaliação</b> (DER/SI-SDR). Passou o threshold → volta ao Model Registry.', retrain:true },
    { t:'CI/CD', d:'CodeCommit/GitHub → <b>CodePipeline → CodeBuild</b> → build & push de imagem no <b>ECR</b> → deploy de novas versões de container nos ramos de inferência.', cicd:true }
  ],
  map: [
    ['Trigger / ingestão','drop em input/','S3 + EventBridge','Object storage durável e versionado; trigger event-driven sem polling'],
    ['Orquestração','executar_*.sh','Step Functions / MWAA','State machine retryable; MWAA se já roda Airflow'],
    ['Estágio 01/02','scripts Python','Lambda / SageMaker Processing','Serverless p/ jobs curtos; containers p/ além do limite 15min/10GB da Lambda'],
    ['Estágio 03 (GPU)','notebook Colab','SageMaker Async / Batch Transform (ml.g5.*)','GPU gerenciada, auto-scaling, sem "upload para o Colab" manual'],
    ['Estágio 04','pyannote local','SageMaker Processing (CPU/GPU)','Mesmo padrão de container do 03, right-sized à parte'],
    ['Artefatos / containers','requirements_*.txt','ECR + S3','Runtime versionado e reprodutível vs pip install em runtime'],
    ['Lineage / versionamento','model_used no JSON','SageMaker Model Registry','Histórico queryável de versões + workflow de aprovação'],
    ['Segredos (HF_TOKEN)','.env','Secrets Manager','Rotação central, acesso IAM-scoped vs dotfile local'],
    ['Logs','logs/*.log','CloudWatch Logs','Centralizado, retido, queryável entre runs/instâncias'],
    ['Drift / qualidade','(manual)','Model Monitor + CloudWatch Alarms','Alerta automático quando o áudio de entrada desvia do baseline'],
    ['Fine-tuning opcional','(só pré-treinado)','SageMaker Training Jobs','Domain-adapt sem sair da mesma história de registry/versionamento'],
    ['Perímetro de segurança','filesystem local','IAM, KMS, VPC endpoints','Encryption at rest/in transit + least-privilege sobre áudio sensível']
  ]
};

window.ARCH_OSS = {
  layers: [
    { t:'Ingestão', d:'Gravações caem no <b>MinIO</b> (S3-compatível) via SFTP/rsync/upload; bucket notification (webhook) ou sensor de polling dispara a DAG.' },
    { t:'Orquestração', d:'<b>Apache Airflow</b> DAG (ou <b>Argo Workflows</b> em k8s), retries, agendamento, histórico visual.' },
    { t:'Validação & pré-processamento', d:'Task Airflow (Python/Docker) = 01+02 + checagens <b>Great Expectations</b>. Falha → notificação Alertmanager + bucket de quarentena.' },
    { t:'Inferência (ramos paralelos)', d:'<b>KServe / Ray Serve / Triton</b> em GPU node pool (k8s) = estágio 03; mesma stack em CPU pool = estágio 04. Autoscaling, batching, endpoint estável.' },
    { t:'Fusão & registry', d:'Task Airflow = estágio 05. <b>MLflow Model Registry</b> versiona e registra lineage de cada modelo/container.' },
    { t:'Armazenamento & acesso', d:'<b>MinIO processed/</b>; <b>PostgreSQL</b> metadata + <b>DuckDB/Trino</b> p/ consultas ad-hoc de RTTM/métricas; <b>HashiCorp Vault</b> p/ segredos, TLS everywhere.' },
    { t:'Monitoramento & feedback', d:'<b>Prometheus + Grafana</b> (latência, erro, GPU); <b>Evidently AI / whylogs</b> (drift de qualidade); <b>Label Studio</b> p/ amostra de QA manual → métrica.' },
    { t:'Fine-tuning opcional', d:'Sensor Airflow (drift ou cadência) → <b>Kubernetes Job</b> (PyTorch, tracking MLflow) → <b>gate</b> (DER/SI-SDR). Passou → volta ao MLflow Registry.', retrain:true },
    { t:'CI/CD', d:'<b>GitHub Actions / Drone CI</b> → build de imagem → push p/ registry self-hosted (<b>Harbor</b>) → deploy de novas versões nos ramos de inferência.', cicd:true }
  ],
  map: [
    ['Object storage','input/, output/','MinIO','API S3-compatível → mesmos padrões de código/tooling da visão AWS, self-hosted'],
    ['Orquestração','executar_*.sh','Apache Airflow / Argo','Retries, agendamento e histórico visual, sem hand-off manual entre 2 máquinas'],
    ['Validação de dados','02_validacao...py','Great Expectations','Expectations declarativas e versionadas + relatório HTML compartilhável'],
    ['Serving (GPU)','notebook Colab','KServe / Ray Serve / Triton','Autoscaling, batching e endpoint HTTP/gRPC estável vs notebook manual'],
    ['Tracking / registry','relatorio_execucao.json','MLflow (Tracking + Registry)','Experiment/version tracking OSS + workflow de staging/aprovação'],
    ['Segredos (HF_TOKEN)','.env','HashiCorp Vault','Acesso central, auditado vs dotfile local'],
    ['Logs','logs/*.log (Loguru)','Grafana Loki / ELK','Agregação de logs centralizada e queryável entre nós'],
    ['Métricas / dashboards','(manual)','Prometheus + Grafana','Stack OSS padrão; dashboards de latência, throughput, GPU'],
    ['Drift / qualidade','(manual)','Evidently AI / whylogs','Detecção de drift OSS, alertando na mesma stack de monitoramento'],
    ['QA humano','(manual)','Label Studio','UI de anotação self-hosted p/ spot-check de qualidade'],
    ['Fine-tuning opcional','(só pré-treinado)','Kubernetes Jobs + PyTorch (MLflow)','Mesmo padrão de training job, sem lock-in de vendor'],
    ['CI/CD','(git clone manual)','GitHub Actions / Drone + Harbor','Build/test/publish automatizado dos containers de estágio']
  ]
};

/* ---------------- Transferable MLOps lessons ---------------- */

window.PRINCIPLES = [
  { icon:'⛔', title:'Fail-fast, barato e primeiro', tag:'estágio 02 · Well-Architected',
    desc:'Rode as checagens <b>baratas e determinísticas</b> (header, NaN, RMS) <em>antes</em> do compute caro. Um NaN pego localmente de graça evita um <code>CUDA error</code> confuso minutos adentro de uma GPU paga. Colete todos os problemas de uma vez.' },
  { icon:'🎯', title:'Degradação graciosa por fallback', tag:'estágio 03 · reliability',
    desc:'Nunca hard-code um único modelo. Uma <b>cadeia de prioridade</b> (MossFormer3→2→SepFormer) que usa o primeiro que carrega absorve checkpoints indisponíveis e rede instável, e adota melhorias futuras com zero mudança de código.' },
  { icon:'🧬', title:'Lineage não é opcional', tag:'estágios 03–05 · registry',
    desc:'Todo resultado registra <b>qual versão de modelo o produziu</b> (<code>model_used</code> no relatório → Model Registry em produção). Sem isso, "por que a run de ontem era melhor?" não tem resposta, e em domínios regulados é requisito legal.' },
  { icon:'🔀', title:'Desacople estágios independentes', tag:'estágio 04 · orquestração',
    desc:'A diarização depende só do 01, não do 03, então roda <b>em paralelo</b> ao round-trip de GPU (<code>--pre-colab</code>). Mapear o grafo de dependências real, não a ordem de numeração, é o que destrava paralelismo em produção.' },
  { icon:'📉', title:'Monitore drift do que entra', tag:'monitoramento · feedback',
    desc:'Modelos apodrecem quando o mundo muda. Monitorar <b>qualidade/RMS do áudio de entrada</b> contra o baseline (Model Monitor / Evidently) dispara o alarme antes do negócio reclamar, e alimenta o loop de retraining.' },
  { icon:'🌱', title:'Inference-only ⇒ treino é ramo opcional', tag:'arquitetura · custo',
    desc:'Como todo modelo é <b>pré-treinado</b>, o "training" de uma arquitetura MLOps de referência vira um <em>ramo de fine-tuning opcional</em>, disparado por drift ou cadência, não o loop central. Reconhecer isso simplifica (e barateia) toda a arquitetura.' },
  { icon:'🚪', title:'Gate de promoção antes do serving', tag:'CI/CD · qualidade',
    desc:'Um modelo fine-tuned só volta ao registry se passar num <b>gate de avaliação</b> (threshold de DER/SI-SDR). Retreinar com dados ruins pode piorar, validar contra o atual antes de promover é não-negociável.' },
  { icon:'📦', title:'Container = ambiente reprodutível', tag:'ECR/Harbor · paridade',
    desc:'Trocar <code>pip install</code> em runtime por <b>imagens versionadas</b> (ECR/Harbor) mata o "na minha máquina funciona": o mesmo runtime roda no laptop, no CI e na GPU de produção, com pesos cacheados à parte.' }
];
