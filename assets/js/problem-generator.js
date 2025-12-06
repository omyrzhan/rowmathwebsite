// Problem Generator JS (refactored from problems.html)
(function(){
  // --- Problem generator core ---
  const templates = {
    linear_equations: [
      { pattern: 'ax + b = c', make: ({a,b,c}) => `${a}x + ${b} = ${c}`, solve(params){
          const {a,b,c} = params; const x = (c - b)/a; return {answer:x, steps:[`Переносим ${b} вправо: ${a}x = ${c - b}`, `Делим на ${a}: x = ${(c - b)}/${a} = ${x}`]}
      }},
      { pattern: 'one-step', make: ({a,b}) => `${a}x = ${b}`, solve(params){ const {a,b} = params; const x = b/a; return {answer:x, steps:[`Делим на ${a}: x = ${b}/${a} = ${x}`]}}}
    ],
    quadratic_equations: [
      { pattern: 'standard', make: ({a,b,c}) => `${a}x^2 + ${b}x + ${c} = 0`, solve(params){
          const {a,b,c} = params; const D = b*b - 4*a*c; if(D<0) return {answer:null, steps:[`Дискриминант D = ${D} < 0 → корней в R нет`]}; const sqrtD = Math.sqrt(D); const x1 = ((-b)+sqrtD)/(2*a); const x2 = ((-b)-sqrtD)/(2*a); return {answer:[x1,x2], steps:[`Вычислим дискриминант D = b^2 - 4ac = ${D}`, `x = (-b ± √D) / (2a)`, `Корни: x1 = ${x1}, x2 = ${x2}`]}
      }}
    ],
    functions: [
      { pattern:'value', make:({a,b,x}) => `f(x)=${a}x+${b}; найдите f(${x})`, solve(params){ const {a,b,x} = params; const y = a*x + b; return {answer:y, steps:[`Подставляем x=${x} в f(x) = ${a}x + ${b}`, `f(${x}) = ${a}*${x} + ${b} = ${y}`]}}}
    ]
  };

  const randInt = (min,max) => Math.floor(Math.random()*(max-min+1))+min;

  function sampleTemplate(topic, A,B,C){
    const pool = templates[topic] || templates.linear_equations;
    if(topic === 'quadratic_equations' || (topic==='linear_equations' && B>=3)){
      // return first quadratic template if exists
    }
    return pool[Math.floor(Math.random()*pool.length)];
  }

  function buildParamsForTemplate(topic, tmpl, A,B,C){
    if(topic==='linear_equations'){
      if(tmpl.pattern==='ax + b = c'){
        const a = randInt(1, (B<=1?5: (B==2?9:12)))* (Math.random()<0.9?1: -1);
        const b = randInt(- (A<=1?8:15), (A<=1?8:15));
        const c = randInt(- (C<=1?8:20), (C<=1?8:20));
        return {a,b,c};
      }
      if(tmpl.pattern==='one-step') return {a:randInt(1,9), b:randInt(-20,20)};
    }
    if(topic==='quadratic_equations'){
      const a = randInt(1, C<=1?3:5);
      const b = randInt(- (A<=1?6:12), (A<=1?6:12));
      const c = randInt(- (B<=2?6:12), (B<=2?6:12));
      return {a,b,c};
    }
    if(topic==='functions'){
      const a = randInt(1, A<=1?3:6);
      const b = randInt(-5,5);
      const x = randInt(-4,6);
      return {a,b,x};
    }
    return {};
  }

  function escapeHtml(str){
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  }

  // DOM bindings
  const topicSelect = document.getElementById('topicSelect');
  const aLevel = document.getElementById('aLevel');
  const bLevel = document.getElementById('bLevel');
  const cLevel = document.getElementById('cLevel');
  const generateBtn = document.getElementById('generateBtn');
  const nextBtn = document.getElementById('nextBtn');
  const badgeA = document.getElementById('badgeA');
  const badgeB = document.getElementById('badgeB');
  const badgeC = document.getElementById('badgeC');
  const problemCard = document.getElementById('problemCard');
  const problemText = document.getElementById('problemText');
  const problemTitle = document.getElementById('problemTitle');
  const solutionArea = document.getElementById('solutionArea');
  const outA = document.getElementById('outA');
  const outB = document.getElementById('outB');
  const outC = document.getElementById('outC');
  const mathArea = document.getElementById('mathArea');

  function updateBadges(){
    badgeA.textContent = aLevel.value;
    badgeB.textContent = bLevel.value;
    badgeC.textContent = cLevel.value;
  }
  [aLevel,bLevel,cLevel,topicSelect].forEach(el=>el.addEventListener('input', updateBadges));
  updateBadges();

  let lastProblem = null;

  function renderMath(text){
    mathArea.innerHTML = '\(' + text + '\)';
    if(window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise();
  }

  function renderProblem(problem){
    problemCard.hidden = false;
    problemText.innerHTML = problem.human;
    outA.textContent = problem.A;
    outB.textContent = problem.B;
    outC.textContent = problem.C;
    renderMath(problem.latex || problem.math || '');
    solutionArea.innerHTML = '';
    const ol = document.createElement('ol');
    problem.steps.forEach(s => { const li = document.createElement('li'); li.innerHTML = s; ol.appendChild(li); });
    solutionArea.appendChild(ol);
  }

  function createProblem(topic, A, B, C) {
    const tmpl = sampleTemplate(topic, A, B, C);
    const params = buildParamsForTemplate(topic, tmpl, A, B, C);
    const human = tmpl.make(params);
    const sol = tmpl.solve(params);
    let latex = '';
    if (topic === 'linear_equations') latex = human.replace(/x/g, 'x');
    if (topic === 'quadratic_equations') latex = human.replace(/\^/g, '^');
    if (topic === 'functions') latex = human.replace(/f\(x\)/g, 'f(x)');
    return {
      topic,
      A,
      B,
      C,
      human,
      params,
      steps: sol.steps.map(s => escapeHtml(s)),
      latex
    };
  }

  function generateProblem(){
    const topic = topicSelect.value;
    const A = Number(aLevel.value); const B = Number(bLevel.value); const C = Number(cLevel.value);
    const problemObj = createProblem(topic, A, B, C);
    lastProblem = problemObj;
    renderProblem(problemObj);
    nextBtn.disabled = false;
  }

  generateBtn.addEventListener('click', generateProblem);
  nextBtn.addEventListener('click', generateProblem);
  document.addEventListener('keydown', e => { if(e.key.toLowerCase()==='g') generateProblem(); });

})();
