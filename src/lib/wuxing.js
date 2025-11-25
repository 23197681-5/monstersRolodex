// -------------------------------------------------------------
//  CONSTANTES
// -------------------------------------------------------------
export const getGanzhiElement = (ganzhi) => {
  if (!ganzhi) return null;
  const stem = ganzhi.charAt(0);
  const stemMap = { '甲': 'wood', '乙': 'wood', '丙': 'fire', '丁': 'fire', '戊': 'earth', '己': 'earth', '庚': 'metal', '辛': 'metal', '壬': 'water', '癸': 'water' };
  return stemMap[stem] || null;
};

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
export const TRINE_ANIMALS = {
    FIRE: ["寅", "午", "戌"], // Tigre, Cavalo, Cão
    METAL: ["巳", "酉", "丑"], // Serpente, Galo, Boi
    WOOD: ["亥", "卯", "未"], // Porco, Coelho, Cabra
    WATER: ["申", "子", "辰"], // Macaco, Rato, Dragão
    EARTH: ["辰", "戌", "丑", "未"], // Dragão, Cão, Boi, Cabra
};
const TRINE_TO_ELEMENT_MAP = {
  "寅,午,戌": "fire",
  "亥,卯,未": "wood",
  "申,子,辰": "water",
  "巳,酉,丑": "metal",
};

const STEM_COMBINATIONS = [
  { pair: ['甲', '己'], element: 'earth', bonus: 1.2 },
  { pair: ['乙', '庚'], element: 'metal', bonus: 1.2 },
  { pair: ['丙', '辛'], element: 'water', bonus: 1.2 },
  { pair: ['丁', '壬'], element: 'wood', bonus: 1.2 },
  { pair: ['戊', '癸'], element: 'fire', bonus: 1.2 },
];

// Combinações de Ramos (Liu He Ju: Zi-Chou, Yin-Hai, etc.)
const BRANCH_COMBINATIONS_WEIGTHS = [
  { pair: ['子', '丑'], element: 'earth', bonus: 1.1 },
  { pair: ['寅', '亥'], element: 'wood', bonus: 1.1 },
  { pair: ['卯', '戌'], element: 'fire', bonus: 1.1 },
  { pair: ['辰', '酉'], element: 'metal', bonus: 1.1 },
  { pair: ['巳', '申'], element: 'water', bonus: 1.1 },
  { pair: ['午', '未'], element: 'earth', bonus: 1.1 }, // Interpretação comum.
];

// Multiplicador de bônus para as combinações simples
const COMBINATION_BONUS_MULTIPLIER = 1.2;
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
const TRIADS = [
  { branches: ['亥', '卯', '未'], element: 'wood', centralBranch: '卯' }, // Madeira (Porco, Coelho, Cabra)
  { branches: ['寅', '午', '戌'], element: 'fire', centralBranch: '午' }, // Fogo (Tigre, Cavalo, Cão)
  { branches: ['巳', '酉', '丑'], element: 'metal', centralBranch: 'metal' }, // Metal (Serpente, Galo, Boi)
  { branches: ['申', '子', '辰'], element: 'water', centralBranch: '子' }, // Água (Macaco, Rato, Dragão)
];

// Define os Danos (Harm) que quebram as combinações
const HARMS = [
  ['子', '未'], // Rato vs. Cabra
  ['丑', '午'], // Boi vs. Cavalo
  ['寅', '巳'], // Tigre vs. Serpente
  ['卯', '辰'], // Coelho vs. Dragão
  ['申', '亥'], // Macaco vs. Porco
  ['酉', '戌'], // Galo vs. Cão
];


// Valores percentuais de bônus para Tríades e Semi-Tríades
const TRIAD_BONUS_PERCENTAGES = {
    FULL_TRIAD: 35,    // Bônus para Tríade completa (ex: 35% de força de Água)
    VISIBILE_SEMI: 25, // Bônus para Semi-Tríade + Tronco Celestial visível
    PURE_SEMI: 15,     // Bônus para Semi-Tríade (Ramo Meio presente) sem Tronco visível
};


// Array de Troncos que tornam uma Semi-Tríade visível (Os Troncos Yin/Yang do elemento gerado)
const VISIBLE_STEMS = {
  wood: ['甲', '乙'],
  fire: ['丙', '丁'],
  metal: ['庚', '辛'],
  water: ['壬', '癸'],
  earth: ['戊', '己'], // Terra raramente usa Tríade, mas está aqui para completude
};

const BEST_SCORES_BY_COHERENCE = {
    "GENERAL": {
      "scores": {
       "day_master_strength_weight": 2.05,
        "branch_interactions_weight": 32.12,
        "excess_deficiency_weight": 11.58,
        "seasonal_dominance_weight": 19.52,
        "qi_sha_penalty_weight": 34.74,
        "mystical_trine_weight": 10,
        "use_day_master_strength_analysis": true,
        "use_branch_interactions": true,
        "use_excess_deficiency": false,
        "use_seasonal_dominance": false,
        "use_custom_config_for_fire_coherence": true,
        "use_custom_config_for_metal_coherence": true,
        "use_custom_config_for_wood_coherence": true,
        "use_custom_config_for_water_coherence": true,
        "use_custom_config_for_earth_coherence": true,
        "triades_can_be_harmfull": true,
        "mystical_trine_bonus": 1.78,
        "mystical_trine_penalty": 1.55,
        "prediction_threshold": 60.78,
        "favorable_useful_element_multiplier": 0.82,
        "unfavorable_useful_element_multiplier": 0.95
      }
    },
    "FIRE": {
      "scores": {
        "day_master_strength_weight": 2.92,
        "branch_interactions_weight": 30.36,
        "excess_deficiency_weight": 22.65,
        "seasonal_dominance_weight": 14.61,
        "qi_sha_penalty_weight": 29.45,
        "mystical_trine_weight": 10,
        "use_day_master_strength_analysis": true,
        "use_branch_interactions": false,
        "use_excess_deficiency": false,
        "use_seasonal_dominance": false,
        "triades_can_be_harmfull": true,
        "mystical_trine_bonus": 1.51,
        "mystical_trine_penalty": 2.4,
        "prediction_threshold": 75.96,
        "favorable_useful_element_multiplier": 0.63,
        "unfavorable_useful_element_multiplier": 1.22
      }
    },
    "METAL": {
      "scores": {
      "day_master_strength_weight": 21.57,
        "branch_interactions_weight": 6.24,
        "excess_deficiency_weight": 41.77,
        "seasonal_dominance_weight": 6.66,
        "qi_sha_penalty_weight": 23.76,
        "mystical_trine_weight": 10,
        "use_day_master_strength_analysis": true,
        "use_branch_interactions": true,
        "use_excess_deficiency": false,
        "use_seasonal_dominance": true,
        "triades_can_be_harmfull": true,
        "mystical_trine_bonus": 2.26,
        "mystical_trine_penalty": 1.46,
        "prediction_threshold": 12.64,
        "favorable_useful_element_multiplier": 1.14,
        "unfavorable_useful_element_multiplier": 0.97
      }
    },
    "WOOD": {
      "scores": {
        "day_master_strength_weight": 5.71,
        "branch_interactions_weight": 28.83,
        "excess_deficiency_weight": 9.27,
        "seasonal_dominance_weight": 20.51,
        "qi_sha_penalty_weight": 35.68,
        "mystical_trine_weight": 10,
        "use_day_master_strength_analysis": true,
        "use_branch_interactions": true,
        "use_excess_deficiency": true,
        "use_seasonal_dominance": false,
        "triades_can_be_harmfull": true,
        "mystical_trine_bonus": 2.45,
        "mystical_trine_penalty": 3.41,
        "prediction_threshold": 17.54,
        "favorable_useful_element_multiplier": 0.61,
        "unfavorable_useful_element_multiplier": 1.94
      }
    },
    "WATER": {
      "scores": {
          "day_master_strength_weight": 43.64,
        "branch_interactions_weight": 5.53,
        "excess_deficiency_weight": 26.4,
        "seasonal_dominance_weight": 9.83,
        "qi_sha_penalty_weight": 14.61,
        "mystical_trine_weight": 10,
        "use_day_master_strength_analysis": true,
        "use_branch_interactions": true,
        "use_excess_deficiency": true,
        "use_seasonal_dominance": true,
        "triades_can_be_harmfull": true,
        "mystical_trine_bonus": 1.49,
        "mystical_trine_penalty": 2.37,
        "prediction_threshold": 58.12,
        "favorable_useful_element_multiplier": 1.46,
        "unfavorable_useful_element_multiplier": 1.27
      }
    },
    "EARTH": {
      "scores": {
          "day_master_strength_weight": 46.2,
        "branch_interactions_weight": 2.18,
        "excess_deficiency_weight": 9.33,
        "seasonal_dominance_weight": 10.04,
        "qi_sha_penalty_weight": 32.25,
        "mystical_trine_weight": 10,
        "use_day_master_strength_analysis": true,
        "use_branch_interactions": true,
        "use_excess_deficiency": true,
        "use_seasonal_dominance": true,
        "triades_can_be_harmfull": false,
        "mystical_trine_bonus": 2.65,
        "mystical_trine_penalty": 1.3,
        "prediction_threshold": 60.27,
        "favorable_useful_element_multiplier": 1.04,
        "unfavorable_useful_element_multiplier": 1.6
      }
    }
};

// Define default scores for easy reference and modification
export const DEFAULT_ANALYZE_SCORES = {
  ...BEST_SCORES_BY_COHERENCE.GENERAL.scores
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


function isHarmBroken(branch, otherBranches) {
    for (const [b1, b2] of HARMS) {
        if ((branch === b1 && otherBranches.includes(b2)) || (branch === b2 && otherBranches.includes(b1))) {
            return true;
        }
    }
    return false;
}


/**
 * Padroniza os dados de entrada do Bazi (que podem vir em formato 'elemento_X/animal_X'
 * ou 'gzYear' etc.) para um formato interno com listas de hastes e ramos.
 * @param {Object} data - Dados do Bazi (baziData ou gameBazi).
 * @returns {Object|null} Objeto padronizado ou null se a entrada for inválida.
 */
function standardizeBaziInput(data) {
    if (!data) return null;

    const standardized = {};

    // Caso 1: Entrada usa 'elemento_X'/'animal_X'
    if (data.elemento_ano && data.animal_ano) {
        standardized.gzYear = `${data.elemento_ano}${data.animal_ano}`;
        standardized.gzMonth = `${data.elemento_mes}${data.animal_mes}`;
        standardized.gzDay = `${data.elemento_dia}${data.animal_dia}`;
        standardized.gzHour = data.elemento_hora && data.animal_hora ? `${data.elemento_hora}${data.animal_hora}` : null;
    }
    // Caso 2: Entrada já usa 'gzYear', etc. (Copia diretamente)
    else if (data.gzYear) {
        standardized.gzYear = data.gzYear;
        standardized.gzMonth = data.gzMonth;
        standardized.gzDay = data.gzDay;
        standardized.gzHour = data.gzHour;
    } else {
        return null; // Formato de entrada inválido
    }

    // Deriva arrays de stems (Troncos) e branches (Ramos)
    const gzPillars = [standardized.gzYear, standardized.gzMonth, standardized.gzDay, standardized.gzHour].filter(gz => gz);
    standardized.stems = gzPillars.map(gz => getGanzhiParts(gz).stem);
    standardized.branches = gzPillars.map(gz => getGanzhiParts(gz).branch);

    return standardized;
}

// -------------------------------------------------------------
//  1. FUNÇÃO PRINCIPAL DE CÁLCULO WUXING
// -------------------------------------------------------------

function getGanzhiParts(ganzhi) {
  // console.log(ganzhi);
    if (!ganzhi || ganzhi.length !== 2) return { stem: null, branch: null };
    return { stem: ganzhi.charAt(0), branch: ganzhi.charAt(1) };
}

export function calculateWuXing(baziData, gameBazi = null) {
  // 1. Padronizar e Inicializar Pilares
  const primaryBazi = standardizeBaziInput(baziData);
  const secondaryBazi = gameBazi ? standardizeBaziInput(gameBazi) : null;

  if (!primaryBazi || !primaryBazi.gzYear || !primaryBazi.gzMonth || !primaryBazi.gzDay) return null;

  const { gzYear, gzMonth, gzDay, gzHour, stems, branches } = primaryBazi;

  // NOVO: Unificação de Troncos e Ramos dos dois mapas Bazi (se o secundário existir)
  const secondaryStems = secondaryBazi ? secondaryBazi.stems : [];
  const secondaryBranches = secondaryBazi ? secondaryBazi.branches : [];

  const allStems = [...stems, ...secondaryStems];
  const allBranches = [...branches, ...secondaryBranches];
  // FIM NOVO

  const pillars = [
    { ...getGanzhiParts(gzYear), weight: 1.0 },
    { ...getGanzhiParts(gzMonth), weight: 1.3 }, // Mês mais pesado
    { ...getGanzhiParts(gzDay), weight: 1.5 } // Dia/Day Master mais pesado
  ];

  if (gzHour) {
    pillars.push({ ...getGanzhiParts(gzHour), weight: 0.8 }); // Hora menos pesada
  }

  const initialSums = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  let totalBonusPoints = 0; // Pontos de bônus da Tríade a serem adicionados ao total

  // -------------------------------------------------------------
  // 2. Somatório Inicial e Multiplicadores Sazonais (Inalterado)
  // -------------------------------------------------------------
  pillars.forEach(({ stem, branch, weight }) => {
    // Troncos
    if (stem && STEM_ELEMENTS[stem]) {
      const { element, value } = STEM_ELEMENTS[stem];
      initialSums[element] += value * weight;
    }
    // Ramos (Qi Oculto)
    if (branch && BRANCH_ELEMENTS[branch]) {
      for (const el in BRANCH_ELEMENTS[branch]) {
        initialSums[el] += BRANCH_ELEMENTS[branch][el] * weight;
      }
    }
  });

  // Aplicação dos multiplicadores sazonais (apenas no Qi inicial)
  const monthBranch = getGanzhiParts(gzMonth).branch;
  if (SEASON_MULTIPLIERS[monthBranch]) {
    for (const el in SEASON_MULTIPLIERS[monthBranch]) {
      initialSums[el] *= SEASON_MULTIPLIERS[monthBranch][el];
    }
  }
  
  // -------------------------------------------------------------
  // 3. Lógica das Combinações de Troncos (He Hua) e Ramos (Liu He Ju) - NOVO PASSO
  //    (Interação entre Bazi Principal e Jogo)
  // -------------------------------------------------------------

  // 3A. Combinações de Troncos (He Hua)
  STEM_COMBINATIONS.forEach(combination => {
    const [stem1, stem2] = combination.pair;
    const { element, bonus } = combination;
    
    // Verifica se os dois troncos estão presentes no conjunto unificado
    const stem1Found = allStems.includes(stem1);
    const stem2Found = allStems.includes(stem2);
    
    if (stem1Found && stem2Found) {
      // O bônus é adicionado ao elemento transformado
      initialSums[element] += bonus * COMBINATION_BONUS_MULTIPLIER; 
    }
  });

  // 3B. Combinações de Ramos (Liu He Ju)
  BRANCH_COMBINATIONS_WEIGTHS.forEach(combination => {
    const [branch1, branch2] = combination.pair;
    const { element, bonus } = combination;
    
    // Verifica se os dois ramos estão presentes no conjunto unificado
    const branch1Found = allBranches.includes(branch1);
    const branch2Found = allBranches.includes(branch2);
    
    if (branch1Found && branch2Found) {
      // O bônus é adicionado ao elemento transformado
      initialSums[element] += bonus * COMBINATION_BONUS_MULTIPLIER;
    }
  });


  // -------------------------------------------------------------
  // 4. Lógica das Tríades de Harmonia (San He Ju) - Antigo passo 3
  // -------------------------------------------------------------
  TRIADS.forEach(triad => {
    const { branches: triadBranches, element: triadElement, centralBranch } = triad;
    
    // O filtro agora usa o array unificado `allBranches`
    let foundBranches = allBranches.filter(b => triadBranches.includes(b));
    let bonusPercentage = 0;

    // 4a. Verificar se há Danos (Harm) quebrando a Tríade
    // isHarmBroken usa o array unificado allBranches
    
    // Verifica se algum ramo da Tríade é danificado por qualquer outro ramo presente
    const isTriadBroken = foundBranches.some(branch => isHarmBroken(branch, allBranches.filter(b => b !== branch)));
    
    if (isTriadBroken) {
        // Se houver Dano (Harm) envolvendo um ramo da Tríade, a combinação é ignorada
        return; 
    }

    // 4b. Avaliar o tipo de Tríade encontrada
    if (foundBranches.length === 3) {
      // 1. Tríade Completa (Ex: 寅, 午, 戌)
      bonusPercentage = TRIAD_BONUS_PERCENTAGES.FULL_TRIAD;

    } else if (foundBranches.length === 2 && foundBranches.includes(centralBranch)) {
      // 2. Semi-Tríade com o Ramo Central (Ex: 寅, 午)
      
      // A visibilidade é verificada no conjunto unificado de troncos (allStems)
      const isVisible = allStems.some(stem => VISIBLE_STEMS[triadElement].includes(stem));
      
      if (isVisible) {
        // Semi-Tríade + Tronco Celestial Visível
        bonusPercentage = TRIAD_BONUS_PERCENTAGES.VISIBILE_SEMI;
      } else {
        // Semi-Tríade Pura
        bonusPercentage = TRIAD_BONUS_PERCENTAGES.PURE_SEMI;
      }
    }
    
    // 4c. Aplicar o Bônus
    if (bonusPercentage > 0) {
      initialSums[triadElement] += bonusPercentage * 1.5; 
      totalBonusPoints += bonusPercentage; 
    }
  });

  // -------------------------------------------------------------
  // 5. Cálculo Final das Porcentagens (Normalização) - Antigo passo 4
  // -------------------------------------------------------------
  
  // O restante do cálculo (passos 5 em diante) permanece inalterado.
  const finalTotalScore = Object.values(initialSums).reduce((a, b) => a + b, 0);

  const percentages = {};
  for (const el in initialSums) {
    percentages[el] = parseFloat(((initialSums[el] / finalTotalScore) * 100).toFixed(1));
  }
  
  const sumCheck = Object.values(percentages).reduce((a, b) => a + b, 0);
  if (sumCheck !== 100.0 && Object.keys(percentages).length > 0) {
      const diff = 100.0 - sumCheck;
      const heaviestElement = Object.keys(percentages).reduce((a, b) => percentages[a] > percentages[b] ? a : b);
      percentages[heaviestElement] = parseFloat((percentages[heaviestElement] + diff).toFixed(1));
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
  const seasonMultipliers = SEASON_MULTIPLIERS[monthBranch] || {};
  const isMonthFavorable = seasonMultipliers[dayMasterElement] || seasonMultipliers[supporterElement];

  if (isMonthFavorable) {
    if (ratio >= 2.2) return "extremelyStrong";
    if (ratio >= 1.3) return "strong";
  }

  if (ratio <= 0.45) return "extremelyWeak";
  if (ratio <= 0.75) return "weak";
  return "balanced";
}
const ELEMENT_FILTERS = {
    FIRE: ['fire', 'wood', 'earth'],
    METAL: ['metal', 'water'],
    WOOD: ['wood', 'water', 'fire'],
    WATER: ['water', 'metal', 'wood'],
    EARTH: ['earth', 'fire', 'metal'],
};

const DEFAULT_COHERENCE_CONFIGS = {
    FIRE: {
        ANIMALS: ["寅", "午", "戌", "巳"], // Tríade + Ramo do Início do Verão (巳)
        ELEMENTS: ELEMENT_FILTERS.FIRE,
        USE_HOUR_BRANCH_FILTER: true,
    },
    METAL: {
        ANIMALS: ["申", "酉", "丑", "巳"],
        ELEMENTS: ELEMENT_FILTERS.METAL,
        USE_HOUR_BRANCH_FILTER: false,
    },
    WOOD: {
        ANIMALS: TRINE_ANIMALS.WOOD,
        ELEMENTS: ELEMENT_FILTERS.WOOD,
        CHECK_MONTH_TRINE: true,
        CHECK_DAY_TRINE: true,
    },
    WATER: {
        ANIMALS: TRINE_ANIMALS.WATER,
        ELEMENTS: ELEMENT_FILTERS.WATER,
        CHECK_MONTH_TRINE: true,
        CHECK_DAY_TRINE: true,
    },
    EARTH: {
        ANIMALS: TRINE_ANIMALS.EARTH,
        ELEMENTS: ELEMENT_FILTERS.EARTH,
        CHECK_MONTH_TRINE: true,
        CHECK_DAY_TRINE: true,
    },
};
const getCoherenceFilterCondition = (config) => (gameBazi) => {
    const dayElement = getGanzhiElement(gameBazi.gzDay);
    const dayAnimal = gameBazi.gzDay.charAt(1);
    const monthAnimal = gameBazi.gzMonth.charAt(1);
    const hourAnimal = gameBazi.gzHour.charAt(1);

    // 1. Verificar Elemento do Dia (regra comum)
    if (!config.ELEMENTS.includes(dayElement)) {
        return false;
    }

    // 2. Verificar Tríades de Mês/Dia (para Madeira, Água, Terra)
    if (config.CHECK_MONTH_TRINE && config.CHECK_DAY_TRINE) {
        return config.ANIMALS.includes(monthAnimal) && config.ANIMALS.includes(dayAnimal);
    }
    
    // 3. Verificar Animais (regra original para Fogo/Metal e fallback)
    let animalCheck = config.ANIMALS.includes(dayAnimal);

    // 4. Verificar Ramo da Hora (regra específica de Fogo)
    if (config.USE_HOUR_BRANCH_FILTER) {
        animalCheck = animalCheck && config.ANIMALS.includes(hourAnimal);
    }
    
    return animalCheck;
};

const coherenceFilters = {
    FIRE: getCoherenceFilterCondition(DEFAULT_COHERENCE_CONFIGS.FIRE),
    METAL: getCoherenceFilterCondition(DEFAULT_COHERENCE_CONFIGS.METAL),
    WOOD: getCoherenceFilterCondition(DEFAULT_COHERENCE_CONFIGS.WOOD),
    WATER: getCoherenceFilterCondition(DEFAULT_COHERENCE_CONFIGS.WATER),
    EARTH: getCoherenceFilterCondition(DEFAULT_COHERENCE_CONFIGS.EARTH),
};

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


//todo parametros alternativos para dias de coêrencia:

// scoresConfig day_master_strength_weight: 50,  // Análise do Mestre do Dia e Elementos Úteis
//   branch_interactions_weight: 20,    // Conflitos, combinações, tríades
//   excess_deficiency_weight: 15,    // Análise de excesso e deficiência
//   seasonal_dominance_weight: 10,   // Influência da estação do jogo
//   qi_sha_penalty_weight: 5,        // Penalidade para "7 Killings"

//   // --- Opções de Ativação ---
//   use_day_master_strength_analysis: true,
//   use_branch_interactions: true,
//   use_excess_deficiency: true,
//   use_seasonal_dominance: true,

//   // Multiplicadores internos (não são pesos diretos, mas ajustam a intensidade dentro de uma categoria)
//   favorable_useful_element_multiplier: 1, 
//   unfavorable_useful_element_multiplier: 1,
// };

/**
 * Verifica se dois Ramos Terrestres estão em Choque (Chong).
 * @param {string} branch1 - O primeiro Ramo Terrestre.
 * @param {string} branch2 - O segundo Ramo Terrestre.
 * @returns {boolean} - Retorna true se houver um Choque.
 */
export function isClash(branch1, branch2) {
    if (!branch1 || !branch2) return false;

    // Pares de Choque Tradicional (Chong)
    const clashes = {
        '子': '午', // Rato vs Cavalo (Água vs Fogo)
        '午': '子', 
        '丑': '未', // Boi vs Cabra (Choque de Terra 1)
        '未': '丑',
        '寅': '申', // Tigre vs Macaco (Madeira vs Metal)
        '申': '寅',
        '卯': '酉', // Coelho vs Galo (Madeira vs Metal)
        '酉': '卯',
        '辰': '戌', // Dragão vs Cão (Choque de Terra 2)
        '戌': '辰',
        '巳': '亥', // Serpente vs Porco (Fogo vs Água)
        '亥': '巳',
    };

    // Normaliza para garantir que a verificação seja feita em ambas as direções
    const b1 = branch1.trim();
    const b2 = branch2.trim();

    return clashes[b1] === b2;
}
/**
 * Verifica se um conjunto de Ramos Terrestres forma uma Punição (Xing).
 * Esta função é melhor usada para verificar se a combinação de Ramos 
 * do Time + Jogo ativam uma Punição.
 * * @param {string[]} allBranches - Array contendo todos os Ramos (Time + Jogo).
 * @returns {string | null} - O tipo de Punição encontrada (e.g., 'Bullying', 'Ingratidao') ou null.
 */
export function isPunishment(allBranches) {
    if (allBranches.length < 2) return null;

    // Remove duplicatas para tratar o Bazi como um conjunto único de Ramos
    const uniqueBranches = Array.from(new Set(allBranches.map(b => b.trim())));

    // --- A. Punição de Bullying (Terra) ---
    // Envolve 丑 (Boi), 戌 (Cão), 未 (Cabra). 
    // Ativada por qualquer par (e.g., 丑 e 戌) ou a Tríade completa.
    const bullyingBranches = uniqueBranches.filter(b => ['丑', '戌', '未'].includes(b));
    if (bullyingBranches.length >= 2) {
        return 'Bullying';
    }

    // --- B. Punição de Ingratidão (Uncivilized) ---
    // Envolve 寅 (Tigre), 巳 (Serpente), 申 (Macaco).
    const ungratefulBranches = uniqueBranches.filter(b => ['寅', '巳', '申'].includes(b));
    if (ungratefulBranches.length >= 2) {
        return 'Ingratidao';
    }

    // --- C. Auto-Punição (Self Punishment) ---
    // Ocorre se o mesmo Ramo se repete no Bazi, mas vamos checar a presença simples
    // entre Time e Jogo para simplificar a penalidade.
    // Envolve 辰 (Dragão), 午 (Cavalo), 酉 (Galo), 亥 (Porco).
    const selfPunishmentRamos = ['辰', '午', '酉', '亥'];
    
    // Verifica se algum par de Auto-Punição está presente (Ex: 辰 no Time e 辰 no Jogo)
    for (const b of selfPunishmentRamos) {
        // Se a contagem desse Ramo no Bazi unificado for 2 ou mais, há Auto-Punição
        if (allBranches.filter(branch => branch.trim() === b).length >= 2) {
            return 'AutoPunicao';
        }
    }

    return null;
}
// -------------------------------------------------------------
//  2. ANÁLISE DE FAVORABILIDADE COMPLETA
// -------------------------------------------------------------
export function analyzeTeamFavorability(teamBazi, gameBazi, scoresConfig = DEFAULT_ANALYZE_SCORES) {
  
  const reasons = [];
  
  // Verifica qual elemento de coerência está ativo para o dia do jogo
  const activeCoherenceElement = Object.keys(coherenceFilters).find(key => {
    return gameBazi && coherenceFilters[key](gameBazi);
  });

  // Se um elemento de coerência for encontrado, verifica se sua flag de configuração customizada está ativa
  if (activeCoherenceElement) {
    const useCustomConfigFlag = `use_custom_config_for_${activeCoherenceElement.toLowerCase()}_coherence`;
    
    // Se a flag específica para este elemento estiver ativa, aplica os scores otimizados
    if (scoresConfig[useCustomConfigFlag] && BEST_SCORES_BY_COHERENCE[activeCoherenceElement]?.scores) {
      const bestConfig = BEST_SCORES_BY_COHERENCE[activeCoherenceElement];
      scoresConfig = {
        ...scoresConfig,
        ...bestConfig.scores
      };
      reasons.push(`⚡ Configuração otimizada para coerência de ${activeCoherenceElement} aplicada.`);
    }
  }

  // Verifica se a estrutura é { elemento_ano, animal_ano, ... } e converte para { gzYear, ... }
  if (teamBazi.elemento_ano && teamBazi.animal_ano) {
    teamBazi = {
      gzYear: `${teamBazi.elemento_ano}${teamBazi.animal_ano}`,
      gzMonth: teamBazi.elemento_mes && teamBazi.animal_mes ? `${teamBazi.elemento_mes}${teamBazi.animal_mes}` : null,
      gzDay: `${teamBazi.elemento_dia}${teamBazi.animal_dia}`,
      gzHour: teamBazi.elemento_hora && teamBazi.animal_hora ? `${teamBazi.elemento_hora}${teamBazi.animal_hora}` : null,
    };
  }

  const teamPercentages = calculateWuXing(teamBazi, gameBazi);
  const gamePercentages = calculateWuXing(gameBazi);

  if (!teamPercentages || !gamePercentages) return { score: 0, reasons: [] };

  let totalScore = 0;

  // -------------------------------------------------------------
  //  Funções de Cálculo de Pontuação por Categoria
  // -------------------------------------------------------------
  const calculateCategoryScore = (weight, points, maxPoints) => {
    if (maxPoints === 0) return 0;
    return (points / maxPoints) * weight;
  };

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
  if (scoresConfig.use_day_master_strength_analysis && teamBazi.gzDay && teamBazi.gzMonth) {
    let categoryPoints = 0;
    const maxCategoryPoints = 4 * Math.max(scoresConfig.favorable_useful_element_multiplier, scoresConfig.unfavorable_useful_element_multiplier);

    const dayStem = getGanzhiParts(teamBazi.gzDay).stem;
    const dayMasterElement = STEM_ELEMENTS[dayStem].element;

    const strength = getDayMasterStrength(dayMasterElement, teamPercentages, teamBazi.gzMonth);
    const useful = getUsefulElements(dayMasterElement, strength);

    const gameDominantPercentage = gamePercentages[gameDominant];
    const proportionalValue = getProportionalScoreValue(gameDominantPercentage);

    if (useful.favorable.includes(gameDominant)) {
      const points = proportionalValue * scoresConfig.favorable_useful_element_multiplier;
      categoryPoints += points;
      reasons.push(`[DM] Elemento do jogo (${gameDominant}) é FAVORÁVEL ao Day Master (${dayMasterElement} ${strength}).`);
    }

    if (useful.unfavorable.includes(gameDominant)) {
      const points = proportionalValue * scoresConfig.unfavorable_useful_element_multiplier;
      categoryPoints -= points;
      reasons.push(`[DM] Elemento do jogo (${gameDominant}) é DESFAVORÁVEL ao Day Master (${dayMasterElement} ${strength}).`);
    }
    totalScore += calculateCategoryScore(scoresConfig.day_master_strength_weight, categoryPoints, maxCategoryPoints);

    // Adiciona penalidade de Qi Sha (7 Killings)
    const gameDayStem = getGanzhiParts(gameBazi.gzDay).stem;
    const gameDayElement = STEM_ELEMENTS[gameDayStem].element;

    // Verifica se o elemento do dia do jogo controla o Day Master
    if (CONTROL_CYCLE[gameDayElement] === dayMasterElement) {
      const dayMasterPolarity = getElementPolarity(dayStem);
      const gameDayPolarity = getElementPolarity(gameDayStem);

      // Se ambos têm a mesma polaridade, é Qi Sha
      if (dayMasterPolarity === gameDayPolarity) {
        const qiShaScore = calculateCategoryScore(scoresConfig.qi_sha_penalty_weight, -1, 1);
        totalScore += qiShaScore;
        reasons.push(`[Qi Sha] Penalidade de 7 Killings: O dia do jogo controla o Day Master com mesma polaridade.`);
      }
      }
    }
 // -------------------------------------------------------------
//  2. Harmonia, Conflito, Combinação, Tríades, Punições
// -------------------------------------------------------------
const teamBranch = getGanzhiParts(teamBazi.gzYear).branch;
const gameDayBranch = getGanzhiParts(gameBazi.gzDay).branch;  
  const teamBranches = [teamBazi.gzYear, teamBazi.gzMonth, teamBazi.gzDay, teamBazi.gzHour].map(gz => gz ? getGanzhiParts(gz).branch : null).filter(Boolean);
  const gameBranches = [gameBazi.gzYear, gameBazi.gzMonth, gameBazi.gzDay, gameBazi.gzHour].map(gz => gz ? getGanzhiParts(gz).branch : null).filter(Boolean);


// Unificação de todos os ramos para checagem de punições/choques complexos
const allBranches = [...teamBranches, ...gameBranches];

if (scoresConfig.use_branch_interactions) {
    let categoryPoints = 0;
    const maxCategoryPoints = 2; // Max score for combination or trine

    // 2A. Conflitos Simples, Combinações e Tríades (Lógica existente)
    // ... (Seu código existente para BRANCH_CONFLICT e BRANCH_COMBINATIONS)
    if (BRANCH_CONFLICT[teamBranch] === gameDayBranch) {
        categoryPoints -= 1;
        reasons.push(`[Ramos] Conflito direto: ${teamBranch} × ${gameDayBranch}.`);
    }

    if (BRANCH_COMBINATIONS[teamBranch] === gameDayBranch) {
        categoryPoints += 2;
        reasons.push(`[Ramos] Combinação harmoniosa: ${teamBranch} + ${gameDayBranch}.`);
    }

    if (branchInSameTrine(teamBranch, gameDayBranch)) {
        categoryPoints += 2;
        reasons.push(`[Ramos] Harmonia de Tríade: ${teamBranch} e ${gameDayBranch} na mesma tríade.`);
    }

    // -------------------------------------------------------------
    // NOVO: 2B. Choques e Punições de Terra (Bullying/Uncivilized)
    // -------------------------------------------------------------
    const clashPenalty = scoresConfig.earth_clash_penalty || 1.5;
    const punishmentPenalty = scoresConfig.earth_punishment_penalty || 2.5;

    // 1. Choques de Terra (丑/未 ou 辰/戌) entre Pilares-chave (Ano do Time vs Dia do Jogo)
    if (isClash(teamBranch, gameDayBranch, ['丑', '未', '辰', '戌'])) {
        categoryPoints -= clashPenalty;
        reasons.push(`[Choque Terra] Choque severo de Terra: ${teamBranch} × ${gameDayBranch}.`);
    }

    // 2. Punição de Bullying (丑, 戌, 未) ou Ingratidão (寅, 巳, 申)
    // Verifica se os Ramos do Time e do Jogo juntos formam uma punição completa (3 Ramos)
    
    // Punição de Bullying (Pura Terra): 丑, 戌, 未
    if (allBranches.filter(b => ['丑', '戌', '未'].includes(b)).length >= 2) {
        // Esta punição é muito problemática se envolver o ano do time e o dia do jogo.
        if (['丑', '戌', '未'].includes(teamBranch) && ['丑', '戌', '未'].includes(gameDayBranch)) {
            categoryPoints -= punishmentPenalty;
            reasons.push(`[Punição] Punição de Bullying (Terra) ativada: ${teamBranch} e ${gameDayBranch} presentes.`);
        }
    }
    
    // Punição de Ingratidão (Metal/Madeira/Fogo): 寅, 巳, 申
    if (allBranches.filter(b => ['寅', '巳', '申'].includes(b)).length >= 2) {
        if (['寅', '巳', '申'].includes(teamBranch) && ['寅', '巳', '申'].includes(gameDayBranch)) {
            categoryPoints -= punishmentPenalty * 0.8; // Um pouco menos severa que a de Terra, mas grave
            reasons.push(`[Punição] Punição de Ingratidão ativada: ${teamBranch} e ${gameDayBranch} presentes.`);
        }
    }

    // Aplica a pontuação final da categoria
    totalScore += calculateCategoryScore(scoresConfig.branch_interactions_weight, categoryPoints, maxCategoryPoints);
}

// NOVO: Análise do Terceiro Místico (Formação de Tríade entre todos os pilares)

  let trineFound = false;
  for (const tBranch of teamBranches) {
    if (trineFound) break;
    for (const gBranch of gameBranches) {
      const mysticalTrineResult = findMysticalThirdForTrine(tBranch, gBranch);
      if (mysticalTrineResult) {
        let categoryPoints = 0;
        const maxCategoryPoints = Math.max(scoresConfig.mystical_trine_bonus, scoresConfig.mystical_trine_penalty);

        // Se a flag estiver ativa, verifica se o elemento da tríade é benéfico ou maléfico
        if (scoresConfig.triades_can_be_harmfull && scoresConfig.use_day_master_strength_analysis) {
          const dayStem = getGanzhiParts(teamBazi.gzDay).stem;
          const dayMasterElement = STEM_ELEMENTS[dayStem].element;
          const strength = getDayMasterStrength(dayMasterElement, teamPercentages, teamBazi.gzMonth);
          const useful = getUsefulElements(dayMasterElement, strength);

          if (useful.favorable.includes(mysticalTrineResult.element)) {
            categoryPoints += scoresConfig.mystical_trine_bonus;
            reasons.push(`[Tríade Mística] Bônus: Formação de tríade benéfica de ${mysticalTrineResult.element} (${tBranch} do time + ${gBranch} do jogo).`);
          } else if (useful.unfavorable.includes(mysticalTrineResult.element)) {
            categoryPoints -= scoresConfig.mystical_trine_penalty;
            reasons.push(`[Tríade Mística] Penalidade: Formação de tríade maléfica de ${mysticalTrineResult.element} (${tBranch} do time + ${gBranch} do jogo).`);
          }
        } else {
          // Comportamento padrão: sempre dá bônus pela formação da tríade
          categoryPoints += scoresConfig.mystical_trine_bonus;
          reasons.push(`[Tríade Mística] Bônus: Potencial de formação de tríade com ${mysticalTrineResult.thirdAnimal} (elemento ${mysticalTrineResult.element}) a partir de ${tBranch} do time e ${gBranch} do jogo.`);
        }
        
        if (categoryPoints !== 0) {
            totalScore += calculateCategoryScore(scoresConfig.mystical_trine_weight, categoryPoints, maxCategoryPoints);
            trineFound = true; // Marca que a tríade foi encontrada e processada
            break; // Sai do loop interno
        }
      }
    }
  }

  // -------------------------------------------------------------
  //  3. Excesso / Deficiência
  // -------------------------------------------------------------
  if (scoresConfig.use_excess_deficiency) {
    let categoryPoints = 0;
    const maxCategoryPoints = 1; // Max 1 point for bonus or penalty

    for (const el in teamPercentages) {
      if (teamPercentages[el] > 45 && CONTROL_CYCLE[gameDominant] === el) {
        categoryPoints += 1;
        reasons.push(`[Equilíbrio] Bônus: Jogo (${gameDominant}) controla excesso de ${el} do time.`);
      }
      if (teamPercentages[el] < 12 && GENERATION_CYCLE[gameDominant] === el) {
        categoryPoints -= 1;
        reasons.push(`[Equilíbrio] Penalidade: Jogo (${gameDominant}) drena ${el} deficiente do time.`);
      }
    }
    totalScore += calculateCategoryScore(scoresConfig.excess_deficiency_weight, categoryPoints, maxCategoryPoints);
  }
  // -------------------------------------------------------------
  //  4. Dominância sazonal
  // -------------------------------------------------------------
  if (scoresConfig.use_seasonal_dominance) {
    let categoryPoints = 0;
    const maxCategoryPoints = 1;

    const monthBranch = getGanzhiParts(gameBazi.gzMonth).branch;
    const seasonDominant = getSeasonDominantElement(monthBranch);

    if (seasonDominant) {
      if (GENERATION_CYCLE[seasonDominant] === teamDominant) {
        categoryPoints += 1;
        reasons.push(`[Sazonal] Mês (${seasonDominant}) fortalece o time (${teamDominant}).`);
      }

      if (CONTROL_CYCLE[seasonDominant] === teamDominant) {
        categoryPoints -= 1;
        reasons.push(`[Sazonal] Mês (${seasonDominant}) enfraquece o time (${teamDominant}).`);
      }
    }
    totalScore += calculateCategoryScore(scoresConfig.seasonal_dominance_weight, categoryPoints, maxCategoryPoints);
  }

  return { score: Math.round(Math.max(-100, Math.min(100, totalScore))), reasons };
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

/**
 * Verifica se dois ramos podem formar uma tríade e retorna o terceiro ramo e o elemento da tríade.
 * @param {string} branch1 Primeiro ramo animal.
 * @param {string} branch2 Segundo ramo animal.
 * @returns {{thirdAnimal: string, element: string} | null} Objeto com o terceiro animal e o elemento, ou nulo.
 */
function findMysticalThirdForTrine(branch1, branch2) {
  for (const trine of BRANCH_TRINES) {
    if (trine.includes(branch1) && trine.includes(branch2) && branch1 !== branch2) {
      const thirdAnimal = trine.find(animal => animal !== branch1 && animal !== branch2);
      const trineKey = trine.sort().join(',');
      const element = TRINE_TO_ELEMENT_MAP[trineKey];
      return { thirdAnimal, element };
    }
  }
  return null;
}
