/* Vektia Python, PT -> EN dictionary for the static copy of lessons.html (pattern catalog)
   and interview.html (interview mode). Loaded after the other i18n files, so it
   overrides any older entry with the same key. */
(function () {
  if (!window.I18N) return;

  var map = {
    /* ---------- lessons.html ---------- */
    'Catálogo de padrões, Vektia': 'Pattern Catalog, Vektia',
    '51 padrões e técnicas · 5 famílias': '51 patterns and techniques · 5 families',
    'de padrões': 'of patterns',
    'Abra qualquer padrão pra ver a ficha completa: o problema que resolve, os participantes, a forma pythônica, o custo, como testar, um exemplo real da stdlib e, principalmente, quando ele vira overengineering. Dá pra filtrar por família ou buscar pelo nome.':
      'Open any pattern to see the full spec sheet: the problem it solves, the participants, the Pythonic form, the cost, how to test it, a real stdlib example and, above all, when it turns into overengineering. You can filter by family or search by name.',
    "Buscar: 'decorator', 'cache', 'saga', 'asyncio'...": "Search: 'decorator', 'cache', 'saga', 'asyncio'...",
    'padrões': 'patterns',
    'padrão': 'pattern',
    'Criacionais': 'Creational',
    'Estruturais': 'Structural',
    'Comportamentais': 'Behavioral',
    'Arquiteturais': 'Architectural',
    'Concorrência & performance': 'Concurrency & performance',
    'Concorrência & perf.': 'Concurrency & perf.',
    'Idiomas pythônicos': 'Pythonic idioms',
    'Assinatura': 'Signature',
    '10 perguntas de entrevista': '10 interview questions',
    'Quando usar vs quando NÃO usar': 'When to use vs when NOT to use',
    'Use quando': 'Use when',
    'NÃO use quando': 'Do NOT use when',
    'Veja também': 'See also',

    /* ---------- interview.html ---------- */
    'Modo Entrevista Python, Vektia': 'Python Interview Mode, Vektia',
    'Framework + Active Recall · Python sênior': 'Framework + Active Recall · Senior Python',
    'Pegue qualquer padrão e tente responder as 10 dimensões de cabeça. Se você dá conta disso, já está à frente da maioria dos candidatos. Os flashcards servem pra treinar a lembrança no susto, porque aguentar a pressão da entrevista se aprende repetindo, não é dom.':
      'Take any pattern and try to answer the 10 dimensions from memory. If you can do that, you are already ahead of most candidates. The flashcards are there to train recall on the spot, because handling interview pressure is something you learn by repetition, not a gift.',
    'Framework, 10 dimensões por padrão': 'Framework, 10 dimensions per pattern',
    'Aplica a TODO padrão do catálogo': 'Applies to EVERY pattern in the catalog',
    'Todas': 'All',
    'Reset Stats': 'Reset Stats'
  };

  /* the 10 dimensions: tag, question (same text as the catalog fw) and description */
  var DIMS = [
    ['Problema', 'Problem', 'Que problema resolve?', 'What problem does it solve?',
      'A dor concreta que motivou o padrão e o sinal de que você precisa dele. Sem problema real, não há padrão.',
      'The concrete pain that motivated the pattern and the sign that you need it. Without a real problem, there is no pattern.'],
    ['Participantes', 'Participants', 'Quais são os participantes?', 'Who are the participants?',
      'Os papéis (Strategy, Context, Handler, Repository...) e quem conhece quem. Se não sabe desenhar, não entendeu.',
      'The roles (Strategy, Context, Handler, Repository...) and who knows whom. If you cannot draw it, you did not understand it.'],
    ['Pythônico', 'Pythonic', 'Qual a forma pythônica?', 'What is the Pythonic form?',
      'Função, Protocol, dict de callables, decorator, generator, context manager ou módulo, no lugar da hierarquia clássica do GoF.',
      'Function, Protocol, dict of callables, decorator, generator, context manager or module, instead of the classic GoF hierarchy.'],
    ['Falha', 'Failure', 'Quando falha ou vira overengineering?', 'When does it fail or become overengineering?',
      'O ponto em que o padrão custa mais do que resolve: indireção sem variação real, estado global, hierarquia profunda.',
      'The point where the pattern costs more than it solves: indirection without real variation, global state, deep hierarchy.'],
    ['Custo', 'Cost', 'Qual o custo (complexidade, indireção, performance)?', 'What is the cost (complexity, indirection, performance)?',
      'Classes e arquivos a mais, chamadas extras, memória, latência e custo de leitura para quem chega depois.',
      'Extra classes and files, extra calls, memory, latency and the reading cost for whoever arrives later.'],
    ['Teste', 'Testing', 'Como testar?', 'How do you test it?',
      'Dublês e fakes nas fronteiras, testes de contrato, tabelas de entrada e saída, propriedades com hypothesis.',
      'Doubles and fakes at the boundaries, contract tests, input and output tables, properties with hypothesis.'],
    ['Exemplo', 'Example', 'Exemplo real (stdlib ou lib famosa)?', 'Real example (stdlib or famous library)?',
      'Onde o padrão aparece de verdade: functools, logging, asyncio, SQLAlchemy, Django, FastAPI.',
      'Where the pattern really shows up: functools, logging, asyncio, SQLAlchemy, Django, FastAPI.'],
    ['SOLID', 'SOLID', 'Qual a relação com SOLID?', 'How does it relate to SOLID?',
      'Quais princípios o padrão materializa (OCP, DIP, SRP) e quais ele pode ferir (LSP, ISP).',
      'Which principles the pattern embodies (OCP, DIP, SRP) and which it can hurt (LSP, ISP).'],
    ['Vizinhos', 'Neighbors', 'Padrões vizinhos e confusões comuns?', 'Neighboring patterns and common confusions?',
      'Parentes que se confundem: Strategy e State, Decorator e Proxy, Adapter e Facade, Observer e Mediator.',
      'Relatives that get confused: Strategy and State, Decorator and Proxy, Adapter and Facade, Observer and Mediator.'],
    ['Entrevista', 'Interview', 'Como explicar em entrevista?', 'How do you explain it in an interview?',
      'Uma frase de definição, o exemplo em Python e o trade-off honesto, em menos de 60 segundos.',
      'One definition sentence, the Python example and the honest trade-off, in under 60 seconds.']
  ];
  DIMS.forEach(function (d, i) {
    map[d[0]] = d[1];
    map[d[2]] = d[3];
    map[d[4]] = d[5];
    /* flashcard label: "Dimensão 01, Problema" (an older pattern would leave the name in Portuguese) */
    var n = (i < 9 ? '0' : '') + (i + 1);
    map['Dimensão ' + n + ', ' + d[0]] = 'Dimension ' + n + ', ' + d[1];
  });

  /* group headers: "<n> padrões · <subtitle>" */
  var SUBS = [
    ['Como os objetos nascem · Fábricas, builders, instância única', 'How objects are born · Factories, builders, single instance'],
    ['Como os objetos se compõem · Adaptação, composição, acesso', 'How objects compose · Adaptation, composition, access'],
    ['Como os objetos colaboram · Algoritmos, eventos, estados', 'How objects collaborate · Algorithms, events, states'],
    ['Como o sistema se organiza · Camadas, domínio, mensageria', 'How the system is organized · Layers, domain, messaging'],
    ['Como o sistema aguenta carga · Filas, resiliência, cache, vetorização', 'How the system handles load · Queues, resilience, cache, vectorization']
  ];
  SUBS.forEach(function (s) {
    map[s[0]] = s[1];
    for (var n = 1; n <= 20; n++) {
      map[n + ' ' + (n === 1 ? 'padrão' : 'padrões') + ' · ' + s[0]] = n + ' ' + (n === 1 ? 'pattern' : 'patterns') + ' · ' + s[1];
    }
  });

  /* trap questions */
  var TRAPS = [
    ['Por que def f(x, acc=[]) é uma armadilha? Como corrigir e quando o default mutável é intencional?', 'Why is def f(x, acc=[]) a trap? How do you fix it, and when is the mutable default intentional?'],
    ['Por que [lambda: i for i in range(3)] devolve três vezes o mesmo valor? Como resolver o late binding?', 'Why does [lambda: i for i in range(3)] return the same value three times? How do you solve late binding?'],
    ['Qual a diferença entre is e ==? Por que "a is b" para ints pequenos às vezes dá True?', 'What is the difference between is and ==? Why does "a is b" sometimes give True for small ints?'],
    ['Threads aceleram código CPU-bound com o GIL? O que muda com o free-threading do 3.13 e do 3.14?', 'Do threads speed up CPU-bound code with the GIL? What changes with free-threading in 3.13 and 3.14?'],
    ['O que acontece com __hash__ quando você define __eq__ sem definir __hash__? Por que isso importa em set e dict?', 'What happens to __hash__ when you define __eq__ without defining __hash__? Why does it matter for set and dict?'],
    ['Como o MRO (C3) resolve a herança múltipla e o que o super() realmente chama?', 'How does the MRO (C3) resolve multiple inheritance and what does super() really call?'],
    ['O que acontece se você chamar time.sleep ou requests.get dentro de uma função async? Como detectar e corrigir?', 'What happens if you call time.sleep or requests.get inside an async function? How do you detect and fix it?'],
    ['Por que um generator ou iterator "esvazia" na segunda passada? Como estruturar para reusar?', 'Why does a generator or iterator "run empty" on the second pass? How do you structure it for reuse?'],
    ['Qual a diferença entre cópia rasa e profunda? Por que [[0]*3]*3 gera linhas ligadas entre si?', 'What is the difference between shallow and deep copy? Why does [[0]*3]*3 create rows linked to each other?'],
    ['Por que alterar uma lista enquanto você itera sobre ela dá resultados estranhos? Qual a alternativa segura?', 'Why does changing a list while iterating over it give strange results? What is the safe alternative?'],
    ['Por que "except Exception" e "except:" não são equivalentes? O que engolir CancelledError causa em asyncio?', 'Why are "except Exception" and "except:" not equivalent? What does swallowing CancelledError cause in asyncio?'],
    ['Por que um dataclass com campo list = [] falha (ValueError) e qual o papel de field(default_factory)?', 'Why does a dataclass with a field list = [] fail (ValueError) and what is the role of field(default_factory)?'],
    ['Quando usar "if x:" e quando "if x is not None:"? Que valores são falsy e já morderam você?', 'When do you use "if x:" and when "if x is not None:"? Which falsy values have bitten you?'],
    ['Por que esquecer functools.wraps quebra um decorator, e por que a ordem de empilhar decorators importa?', 'Why does forgetting functools.wraps break a decorator, and why does the stacking order of decorators matter?'],
    ['Por que @lru_cache em método de instância pode vazar memória? Como mitigar?', 'Why can @lru_cache on an instance method leak memory? How do you mitigate it?'],
    ['Como um import circular acontece, como diagnosticar e qual a correção na raiz (não o import dentro da função)?', 'How does a circular import happen, how do you diagnose it, and what is the root fix (not the import inside the function)?'],
    ['Quando usar threading, multiprocessing ou asyncio? Cite o critério por tipo de carga (I/O ou CPU).', 'When do you use threading, multiprocessing or asyncio? State the criterion by workload type (I/O or CPU).'],
    ['Por que 0.1 + 0.2 != 0.3 e quando usar Decimal ou Fraction em vez de float?', 'Why is 0.1 + 0.2 != 0.3 and when do you use Decimal or Fraction instead of float?']
  ];
  TRAPS.forEach(function (t) { map[t[0]] = t[1]; });

  window.I18N.register(map);
})();
