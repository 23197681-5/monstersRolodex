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

export const FIRE_ANIMALS = ["寅", "午", "戌", "巳"];
export const METAL_ANIMALS = ["申", "酉", "丑", "巳"];

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

// Define default scores for easy reference and modification
export const DEFAULT_ANALYZE_SCORES = {
  favorable_useful_element_multiplier: 2, // Multiplica a saída de getProportionalScoreValue (e.g., 1 * [1,2,3,4]), valor positivo
  unfavorable_useful_element_multiplier: 2, // Multiplica a saída de getProportionalScoreValue (e.g., 1 * [1,2,3,4]), valor positivo a ser subtraído
  branch_conflict_score: -1,
  branch_combination_score: 2,
  trine_harmony_score: 2,
  penalty_score: -2,
  control_excess_bonus: 2, // Renomeado e tornado positivo, pois controlar excesso é bom.
  deficiency_penalty_score: -1,
  qi_sha_penalty: -1, // Penalidade para 7 Killings (Qi Sha)
  seasonal_strengthen_score: 1,
  seasonal_weaken_score: -1,
  use_day_master_strength_analysis: true, // Novo parâmetro: usar análise de força do Day Master
  use_branch_interactions: true, // Controla toda a seção de interações de ramos
  use_excess_deficiency: true, // Controla a análise de excesso/deficiência
  use_seasonal_dominance: true, // Controla a análise de dominância sazonal
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
  console.log(ganzhi);
    if (!ganzhi || ganzhi.length !== 2) return { stem: null, branch: null };
    return { stem: ganzhi.charAt(0), branch: ganzhi.charAt(1) };
}
export function calculateWuXing(baziData) {
  if (!baziData) return null;

  // Verifica se a estrutura é { elemento_ano, animal_ano, ... } e converte para { gzYear, ... }
  if (baziData.elemento_ano && baziData.animal_ano) {
    baziData = {
      gzYear: `${baziData.elemento_ano}${baziData.animal_ano}`,
      gzMonth: `${baziData.elemento_mes}${baziData.animal_mes}`,
      gzDay: `${baziData.elemento_dia}${baziData.animal_dia}`,
      gzHour: baziData.elemento_hora && baziData.animal_hora ? `${baziData.elemento_hora}${baziData.animal_hora}` : null,
    };
  }

  const { gzYear, gzMonth, gzDay, gzHour } = baziData;
  if (!gzYear || !gzMonth || !gzDay) return null;

  const pillars = [
    { ...getGanzhiParts(gzYear), weight: 1.0 },
    { ...getGanzhiParts(gzMonth), weight: 1.3 },
    { ...getGanzhiParts(gzDay), weight: 1.5 }
  ];

  if (gzHour) {
    console.log("hora", gzHour);
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

const getElementPolarity = (stem) => {
  const stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const idx = stems.indexOf(stem);
  return idx >= 0 ? (idx % 2 === 0 ? 'yang' : 'yin') : null;
};
// -------------------------------------------------------------
//  FORÇA DO DAY MASTER (NOVO)
// -------------------------------------------------------------
export function getDayMasterStrength(dayMasterElement, wuXingMap, gzMonth) {
  const self = wuXingMap[dayMasterElement];

  // Quem gera o DM
  const supporterElement = Object.keys(GENERATION_CYCLE).find(e => GENERATION_CYCLE[e] === dayMasterElement);
  const supporter = wuXingMap[supporterElement];

  // Quem o DM gera
  const output = wuXingMap[GENERATION_CYCLE[dayMasterElement]];

  // Quem controla o DM
  const controllerElement = Object.keys(CONTROL_CYCLE).find(e => CONTROL_CYCLE[e] === dayMasterElement);
  const controller = wuXingMap[controllerElement];

  const supportivePower = self + supporter;
  const drainingPower = output + controller;

  const ratio = supportivePower / (drainingPower + 1);

  // Condição adicional: o mês deve favorecer o Day Master para que ele seja considerado forte.
  const monthBranch = getGanzhiParts(gzMonth).branch;
  const seasonElement = getSeasonDominantElement(monthBranch);
  const isMonthFavorable = (seasonElement === dayMasterElement) || (GENERATION_CYCLE[seasonElement] === dayMasterElement);

  if (isMonthFavorable) {
    if (ratio >= 2.2) return "extremelyStrong";
    if (ratio >= 1.3) return "strong";
  }

  if (ratio <= 0.45) return "extremelyWeak";
  if (ratio <= 0.75) return "weak";
  return "balanced";
}

// -------------------------------------------------------------
//  ELEMENTOS FAVORÁVEIS (NOVO)
// -------------------------------------------------------------
export function getUsefulElements(dayMasterElement, strength) {
  const generating = Object.keys(GENERATION_CYCLE).find(e => GENERATION_CYCLE[e] === dayMasterElement);
  const produced = GENERATION_CYCLE[dayMasterElement];
  const controller = Object.keys(CONTROL_CYCLE).find(e => CONTROL_CYCLE[e] === dayMasterElement);
  const controlled = CONTROL_CYCLE[dayMasterElement];

  switch (strength) {
    case "weak":
    case "extremelyWeak":
      return {
        favorable: [dayMasterElement, generating],
        unfavorable: [produced, controlled]
      };

    case "strong":
      return {
        favorable: [produced, controlled],
        unfavorable: [dayMasterElement, generating]
      };

    case "extremelyStrong":
      return {
        favorable: [dayMasterElement, generating],
        unfavorable: [produced, controller]
      };

    case "balanced":
    default:
      return {
        favorable: [produced],
        unfavorable: [controller]
      };
  }
}

// -------------------------------------------------------------
//  2. ANÁLISE DE FAVORABILIDADE COMPLETA
// -------------------------------------------------------------
export function analyzeTeamFavorability(teamBazi, gameBazi, customScores = DEFAULT_ANALYZE_SCORES) {
  // Verifica se a estrutura é { elemento_ano, animal_ano, ... } e converte para { gzYear, ... }
  if (teamBazi.elemento_ano && teamBazi.animal_ano) {
    teamBazi = {
      gzYear: `${teamBazi.elemento_ano}${teamBazi.animal_ano}`,
      gzMonth: `${teamBazi.elemento_mes}${teamBazi.animal_mes}`,
      gzDay: `${teamBazi.elemento_dia}${teamBazi.animal_dia}`,
      gzHour: teamBazi.elemento_hora && teamBazi.animal_hora ? `${teamBazi.elemento_hora}${teamBazi.animal_hora}` : null,
    };
  }

  const teamPercentages = calculateWuXing(teamBazi);
  const gamePercentages = calculateWuXing(gameBazi);

  if (!teamPercentages || !gamePercentages) return { score: 0, reasons: [] };

  let score = 0;

  const reasons = [];

  // -------------------------------------------------------------
  //  Elemento dominante REAL
  // -------------------------------------------------------------
  const teamDominant = getTrueDominantElement(teamPercentages);
  const gameDominant = getTrueDominantElement(gamePercentages);

  // Função auxiliar para determinar o valor base proporcional (1, 2, 3 ou 4)
  const getProportionalScoreValue = (percentage) => {
    if (percentage >= 75) return 4;
    if (percentage >= 50) return 3;
    if (percentage >= 25) return 2;
    return 1;
  };
  
  // -------------------------------------------------------------
  //  NOVO: Day Master + Elementos Úteis (Condicional)
  // -------------------------------------------------------------
  if (customScores.use_day_master_strength_analysis) {
    const dayStem = getGanzhiParts(teamBazi.gzDay).stem;
    console.log(dayStem);
    const dayMasterElement = STEM_ELEMENTS[dayStem].element;

    const strength = getDayMasterStrength(dayMasterElement, teamPercentages, teamBazi.gzMonth);
    const useful = getUsefulElements(dayMasterElement, strength);

    const gameDominantPercentage = gamePercentages[gameDominant];

    if (useful.favorable.includes(gameDominant)) {
      const proportionalValue = getProportionalScoreValue(gameDominantPercentage);
      const points = proportionalValue * customScores.favorable_useful_element_multiplier;
      score += points;
      reasons.push(`Elemento do jogo (${gameDominant}, ${gameDominantPercentage.toFixed(1)}%) é FAVORÁVEL ao Day Master ${dayMasterElement} (${strength}). Pontos: +${points}`);
    }

    if (useful.unfavorable.includes(gameDominant)) {
      const proportionalValue = getProportionalScoreValue(gameDominantPercentage);
      const points = proportionalValue * customScores.unfavorable_useful_element_multiplier; // Agora points é positivo
      score -= points; // Subtrai os pontos positivos
      reasons.push(`Elemento do jogo (${gameDominant}, ${gameDominantPercentage.toFixed(1)}%) é DESFAVORÁVEL ao Day Master ${dayMasterElement} (${strength}). Pontos: -${points}`);
    }

    // Adiciona penalidade de Qi Sha (7 Killings)
    const gameDayStem = getGanzhiParts(gameBazi.gzDay).stem;
    const gameDayElement = STEM_ELEMENTS[gameDayStem].element;

    // Verifica se o elemento do dia do jogo controla o Day Master
    if (CONTROL_CYCLE[gameDayElement] === dayMasterElement) {
      const dayMasterPolarity = getElementPolarity(dayStem);
      const gameDayPolarity = getElementPolarity(gameDayStem);

      // Se ambos têm a mesma polaridade, é Qi Sha
      if (dayMasterPolarity === gameDayPolarity) {
        score += customScores.qi_sha_penalty;
        reasons.push(`Penalidade de Qi Sha (7 Killings): O dia (${gameDayElement} ${gameDayPolarity}) controla o Day Master (${dayMasterElement} ${dayMasterPolarity}). Pontos: ${customScores.qi_sha_penalty}`);
      }
    }
  }
  // -------------------------------------------------------------
  //  2. Harmonia, Conflito, Combinação, Tríades, Punições
  // -------------------------------------------------------------
  const teamBranch = getGanzhiParts(teamBazi.gzYear).branch;
  const gameDayBranch = getGanzhiParts(gameBazi.gzDay).branch;

  if (customScores.use_branch_interactions) {
    if (BRANCH_CONFLICT[teamBranch] === gameDayBranch) {
      score += customScores.branch_conflict_score;
      reasons.push(`Conflito direto: ${teamBranch} × ${gameDayBranch}. Pontos: ${customScores.branch_conflict_score}`);
    }

    if (BRANCH_COMBINATIONS[teamBranch] === gameDayBranch) {
      score += customScores.branch_combination_score;
      reasons.push(`Combinação harmoniosa: ${teamBranch} + ${gameDayBranch}. Pontos: ${customScores.branch_combination_score}`);
    }

    if (branchInSameTrine(teamBranch, gameDayBranch)) {
      score += customScores.trine_harmony_score;
      reasons.push(`Ambos pertencem à mesma tríade harmônica. Pontos: ${customScores.trine_harmony_score}`);
    }

    // if (branchesInPenalty(teamBranch, gameDayBranch)) {
    //   score += customScores.penalty_score;
    //   reasons.push(`Punição entre ${teamBranch} e ${gameDayBranch}. Pontos: ${customScores.penalty_score}`);
    // }
  }
  // -------------------------------------------------------------
  //  3. Excesso / Deficiência
  // -------------------------------------------------------------
  if (customScores.use_excess_deficiency) {
    for (const el in teamPercentages) { // Corrigido para iterar sobre o objeto de porcentagens
      if (teamPercentages[el] > 45 && CONTROL_CYCLE[gameDominant] === el) { // Corrigido para usar teamPercentages[el]
        score += customScores.control_excess_bonus;
        reasons.push(`Bônus por Controle de Excesso: O elemento do jogo (${gameDominant}) controla o excesso de ${el} do time. Pontos: +${customScores.control_excess_bonus}`);
      }
      if (teamPercentages[el] < 12 && GENERATION_CYCLE[gameDominant] === el) { // Corrigido para usar teamPercentages[el]
        score += customScores.deficiency_penalty_score;
        reasons.push(`Deficiência de ${el}, pressionado pelo elemento do jogo (${gameDominant}). Pontos: ${customScores.deficiency_penalty_score}`);
      }
    }
  }
  // -------------------------------------------------------------
  //  4. Dominância sazonal
  // -------------------------------------------------------------
  if (customScores.use_seasonal_dominance) {
    const monthBranch = getGanzhiParts(gameBazi.gzMonth).branch;
    const seasonDominant = getSeasonDominantElement(monthBranch);

    if (seasonDominant) {
      if (GENERATION_CYCLE[seasonDominant] === teamDominant) {
        score += customScores.seasonal_strengthen_score;
        reasons.push(`O mês fortalece o time: ${seasonDominant} → ${teamDominant}. Pontos: ${customScores.seasonal_strengthen_score}`);
      }

      if (CONTROL_CYCLE[seasonDominant] === teamDominant) {
        score += customScores.seasonal_weaken_score;
        reasons.push(`O mês pressiona o time: ${seasonDominant} → ${teamDominant}. Pontos: ${customScores.seasonal_weaken_score}`);
      }
    }
  }

  return { score, reasons };
}


// Constantes para normalização (pode ser ajustado)
const MAX_DAY_MASTER_STRENGTH_POINTS = 50;
const MAX_BRANCH_INTERACTIONS_POINTS = 20;
const MAX_NAYIN_POINTS = 10;
const MAX_TEN_GODS_POINTS = 10;
const MAX_EXCESS_DEFICIENCY_POINTS = 5;
const MAX_SEASONAL_DOMINANCE_POINTS = 5;





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
  if (!map || Object.keys(map).length === 0) return null;
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
