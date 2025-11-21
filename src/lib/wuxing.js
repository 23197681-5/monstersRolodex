// -------------------------------------------------------------
//  CONSTANTES
// -------------------------------------------------------------

// Ciclos dos 5 elementos
export const GENERATION_CYCLE = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood"
};

export const CONTROL_CYCLE = {
  wood: "earth",
  earth: "water",
  water: "fire",
  fire: "metal",
  metal: "wood"
};

// -------------------------------------------------------------
//  Tríades Harmônicas dos Ramos
// -------------------------------------------------------------
export const BRANCH_TRINES = [
  ["寅", "午", "戌"], // fogo
  ["亥", "卯", "未"], // madeira
  ["申", "子", "辰"], // água
  ["巳", "酉", "丑"]  // metal
];

// -------------------------------------------------------------
//  Combinações dos Ramos
// -------------------------------------------------------------
export const BRANCH_COMBINATIONS = {
  "子": "丑",
  "丑": "子",
  "寅": "亥",
  "亥": "寅",
  "卯": "戌",
  "戌": "卯",
  "辰": "酉",
  "酉": "辰",
  "巳": "申",
  "申": "巳",
  "午": "未",
  "未": "午"
};

// -------------------------------------------------------------
//  Punições
// -------------------------------------------------------------
export const BRANCH_PENALTIES = [
  ["子", "卯"],
  ["寅", "巳", "申"],
  ["丑", "戌", "未"],
  ["辰", "辰"]
];
const BRANCH_HARMONY = {
  '子': '丑', '丑': '子',
  '寅': '亥', '亥': '寅',
  '卯': '戌', '戌': '卯',
  '辰': '酉', '酉': '辰',
  '午': '未', '未': '午',
  '申': '巳', '巳': '申',
};
const BRANCH_CONFLICT = {
  '子': '午', '午': '子',
  '丑': '未', '未': '丑',
  '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯',
  '辰': '戌', '戌': '辰',
  '巳': '亥', '亥': '巳',
};

// -------------------------------------------------------------
//  SEASON MULTIPLIERS (Corrigido: multiplos elementos)
// -------------------------------------------------------------
export const SEASON_MULTIPLIERS = {
  戌: { earth: 2.0, fire: 1.5, metal: 1.5 },
  酉: { metal: 2.0 },
  申: { metal: 1.5, water: 1.5 },
  未: { earth: 2.0, wood: 1.5 },
  午: { fire: 2.0 },
  巳: { fire: 1.5, metal: 1.5 },
  辰: { earth: 2.0, water: 1.5 },
  卯: { wood: 2.0 },
  寅: { wood: 1.5, fire: 1.5 },
  丑: { earth: 1.5, metal: 1.5, water: 1.5 },
  子: { water: 2.0 },
  亥: { water: 1.5, wood: 1.5 }
};


// -------------------------------------------------------------
//  1. FUNÇÃO PRINCIPAL DE CÁLCULO WUXING
// -------------------------------------------------------------

function getGanzhiParts(ganzhi) {
    if (!ganzhi || ganzhi.length !== 2) return { stem: null, branch: null };
    return { stem: ganzhi.charAt(0), branch: ganzhi.charAt(1) };
}
export function calculateWuXing(baziData) {
  if (!baziData) return null;

  const { gzYear, gzMonth, gzDay, gzHour } = baziData;
  if (!gzYear || !gzMonth || !gzDay) return null;

  const pillars = [
    { ...getGanzhiParts(gzYear), weight: 1.0 },
    { ...getGanzhiParts(gzMonth), weight: 1.3 },
    { ...getGanzhiParts(gzDay), weight: 1.5 }
  ];

  if (gzHour) {
    pillars.push({ ...getGanzhiParts(gzHour), weight: 0.8 });
  }

  const initialSums = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0
  };

  // -------------------------------------------------------------
  //  Somatório dos troncos e ramos
  // -------------------------------------------------------------
  pillars.forEach(({ stem, branch, weight }) => {
    if (stem && STEM_ELEMENTS[stem]) {
      const { element, value } = STEM_ELEMENTS[stem];
      initialSums[element] += value * weight;
    }

    if (branch && BRANCH_ELEMENTS[branch]) {
      for (const el in BRANCH_ELEMENTS[branch]) {
        initialSums[el] += BRANCH_ELEMENTS[branch][el] * weight;
      }
    }
  });

  // -------------------------------------------------------------
  //  Aplicação dos multiplicadores sazonais
  // -------------------------------------------------------------
  const monthBranch = getGanzhiParts(gzMonth).branch;

  if (SEASON_MULTIPLIERS[monthBranch]) {
    for (const el in SEASON_MULTIPLIERS[monthBranch]) {
      initialSums[el] *= SEASON_MULTIPLIERS[monthBranch][el];
    }
  }

  // -------------------------------------------------------------
  //  Cálculo final das porcentagens
  // -------------------------------------------------------------
  const total = Object.values(initialSums).reduce((a, b) => a + b, 0);

  const percentages = {};
  for (const el in initialSums) {
    percentages[el] = parseFloat(((initialSums[el] / total) * 100).toFixed(1));
  }

  return percentages;
}
export const ELEMENT_VALUES = {
  wood: "wood",
  fire: "fire",
  earth: "earth",
  metal: "metal",
  water: "water"
};
const BRANCH_ELEMENTS = { 
    '子': { [ELEMENT_VALUES.water]: 50 },
  '丑': { [ELEMENT_VALUES.earth]: 30, [ELEMENT_VALUES.metal]: 8, [ELEMENT_VALUES.water]: 12 },
  '寅': { [ELEMENT_VALUES.wood]: 30, [ELEMENT_VALUES.fire]: 15, [ELEMENT_VALUES.earth]: 5 },
  '卯': { [ELEMENT_VALUES.wood]: 50 },
  '辰': { [ELEMENT_VALUES.earth]: 30, [ELEMENT_VALUES.water]: 8, [ELEMENT_VALUES.wood]: 12 },
  '巳': { [ELEMENT_VALUES.fire]: 30, [ELEMENT_VALUES.metal]: 15, [ELEMENT_VALUES.earth]: 5 },
  '午': { [ELEMENT_VALUES.fire]: 30, [ELEMENT_VALUES.wood]: 20 },
  '未': { [ELEMENT_VALUES.earth]: 30, [ELEMENT_VALUES.fire]: 12, [ELEMENT_VALUES.wood]: 8 },
  '申': { [ELEMENT_VALUES.metal]: 30, [ELEMENT_VALUES.water]: 15, [ELEMENT_VALUES.earth]: 5 },
  '酉': { [ELEMENT_VALUES.metal]: 50 },
  '戌': { [ELEMENT_VALUES.earth]: 30, [ELEMENT_VALUES.fire]: 8, [ELEMENT_VALUES.metal]: 12 },
  '亥': { [ELEMENT_VALUES.water]: 30, [ELEMENT_VALUES.wood]: 20 },
}

const STEM_ELEMENTS = {
      '甲': { element: ELEMENT_VALUES.wood, value: 50 },
  '乙': { element: ELEMENT_VALUES.wood, value: 50 },
  '丙': { element: ELEMENT_VALUES.fire, value: 50 },
  '丁': { element: ELEMENT_VALUES.fire, value: 50 },
  '戊': { element: ELEMENT_VALUES.earth, value: 50 },
  '己': { element: ELEMENT_VALUES.earth, value: 50 },
  '庚': { element: ELEMENT_VALUES.metal, value: 50 },
  '辛': { element: ELEMENT_VALUES.metal, value: 50 },
  '壬': { element: ELEMENT_VALUES.water, value: 50 },
  '癸': { element: ELEMENT_VALUES.water, value: 50 },
};

// -------------------------------------------------------------
//  2. ANÁLISE DE FAVORABILIDADE COMPLETA
// -------------------------------------------------------------
export function analyzeTeamFavorability(teamBazi, gameBazi) {
  const team = calculateWuXing(teamBazi);
  const game = calculateWuXing(gameBazi);

  if (!team || !game) return { score: 0, reasons: [] };

  let score = 0;
  const reasons = [];

  // -------------------------------------------------------------
  //  Elemento dominante REAL (corrigido)
  // -------------------------------------------------------------
  const teamDominant = getTrueDominantElement(team);
  const gameDominant = getTrueDominantElement(game);

  // -------------------------------------------------------------
  //  1. Geração / Controle
  // -------------------------------------------------------------
  if (GENERATION_CYCLE[gameDominant] === teamDominant) {
    score += 2;
    reasons.push(`O elemento do jogo (${gameDominant}) gera o do time (${teamDominant}).`);
  }

  if (CONTROL_CYCLE[gameDominant] === teamDominant) {
    score -= 2;
    reasons.push(`O elemento do jogo (${gameDominant}) controla o do time (${teamDominant}).`);
  }

  // -------------------------------------------------------------
  //  2. Harmonia, Conflito, Combinações, Tríades, Punições
  // -------------------------------------------------------------
  const teamBranch = getGanzhiParts(teamBazi.gzYear).branch;
  const gameBranch = getGanzhiParts(gameBazi.gzDay).branch;

  // Conflito
  if (BRANCH_CONFLICT[teamBranch] === gameBranch) {
    score -= 3;
    reasons.push(`Conflito direto: ${teamBranch} × ${gameBranch}`);
  }

  // Combinação
  if (BRANCH_COMBINATIONS[teamBranch] === gameBranch) {
    score += 2;
    reasons.push(`Combinação harmoniosa: ${teamBranch} + ${gameBranch}`);
  }

  // Tríade harmônica
  if (branchInSameTrine(teamBranch, gameBranch)) {
    score += 2;
    reasons.push(`Ambos fazem parte da mesma tríade harmônica.`);
  }

  // Punições
  if (branchesInPenalty(teamBranch, gameBranch)) {
    score -= 2;
    reasons.push(`Punição entre ${teamBranch} e ${gameBranch}.`);
  }

  // -------------------------------------------------------------
  //  3. Excesso / Deficiência avançados
  // -------------------------------------------------------------
  for (const el in team) {
    if (team[el] > 45 && CONTROL_CYCLE[gameDominant] === el) {
      score -= 2;
      reasons.push(`Excesso de ${el}, controlado pelo jogo (${gameDominant}).`);
    }
    if (team[el] < 12 && GENERATION_CYCLE[gameDominant] === el) {
      score -= 1;
      reasons.push(`Deficiência de ${el}, pressionado pelo jogo (${gameDominant}).`);
    }
  }

  // -------------------------------------------------------------
  //  4. Dominância sazonal do mês
  // -------------------------------------------------------------
  const monthBranch = getGanzhiParts(gameBazi.gzMonth).branch;
  const seasonDominant = getSeasonDominantElement(monthBranch);

  if (GENERATION_CYCLE[seasonDominant] === teamDominant) {
    score += 1;
    reasons.push(`O mês favorece o time: ${seasonDominant} → ${teamDominant}.`);
  }

  if (CONTROL_CYCLE[seasonDominant] === teamDominant) {
    score -= 1;
    reasons.push(`O mês pressiona o time: ${seasonDominant} → ${teamDominant}.`);
  }

  return { score, reasons };
}


// -------------------------------------------------------------
//  FUNÇÕES AUXILIARES
// -------------------------------------------------------------

function getSeasonDominantElement(branch) {
  const multipliers = SEASON_MULTIPLIERS[branch];
  if (!multipliers) return null;

  return Object.keys(multipliers).reduce((a, b) =>
    multipliers[a] > multipliers[b] ? a : b
  );
}

function getTrueDominantElement(map) {
  return Object.keys(map).reduce((a, b) =>
    map[a] > map[b] ? a : b
  );
}

function branchInSameTrine(a, b) {
  return BRANCH_TRINES.some(trine => trine.includes(a) && trine.includes(b));
}

function branchesInPenalty(a, b) {
  return BRANCH_PENALTIES.some(group => group.includes(a) && group.includes(b));
}
