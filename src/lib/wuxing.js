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
/**
 * Define o ciclo de ser GERADO POR (Elemento 'Mãe').
 * Onde o elemento no lado esquerdo é GERADO POR (É o filho de) o elemento no lado direito.
 * Você pode usar isso para o Raciocínio (Recursos - Zheng Yin / Pian Yin).
 */
export const GENERATED_CYCLE = {
    fire: "wood",
    earth: "fire",
    metal: "earth",
    water: "metal",
    wood: "water"
};

/**
 * Define o ciclo de ser CONTROLADO POR (Elemento 'Controlador').
 * Onde o elemento no lado esquerdo é CONTROLADO POR (É a vítima de) o elemento no lado direito.
 * Você pode usar isso para o Poder/Autoridade (Zheng Guan / Qi Sha).
 */
export const CONTROLLED_CYCLE = {
    earth: "wood",
    water: "earth",
    fire: "water",
    metal: "fire",
    wood: "metal"
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

// Combinações Cardeais (Direcionais)
export const DIRECTIONAL_COMBINATIONS = {
  wood: ['寅', '卯', '辰'], // Leste
  fire: ['巳', '午', '未'], // Sul
  metal: ['申', '酉', '戌'], // Oeste
  water: ['亥', '子', '丑'], // Norte
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
  { branches: ['巳', '酉', '丑'], element: 'metal', centralBranch: '酉' }, // Metal (Serpente, Galo, Boi)
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
    PURE_SEMI: 15,         // Bônus para Semi-Tríade (Ramo Meio presente) sem Tronco visível
};


// Array de Troncos que tornam uma Semi-Tríade visível (Os Troncos Yin/Yang do elemento gerado)
const VISIBLE_STEMS = {
  wood: ['甲', '乙'],
  fire: ['丙', '丁'],
  metal: ['庚', '辛'],
  water: ['壬', '癸'],
  earth: ['戊', '己'], // Terra raramente usa Tríade, mas está aqui para completude
};
let statistics = {};

export async function initializeScores() {
  let statistics = {};
  try {
    // The path is relative to the `public` directory at runtime.
    let statsModule = await import('../../public/statistics.json', { assert: { type: 'json' } });
    statistics = statsModule.default;
  } catch (error) {
    // If the file is not found, we'll just use an empty object and fall back to defaults.
    if (error.code !== 'ERR_MODULE_NOT_FOUND') {
      console.error("Error loading statistics.json:", error);
    }
  }

  const baseScores = statistics?.bestScoresByCoherence?.GENERAL?.scores || {};

  let DEFAULT_ANALYZE_SCORES = { ...baseScores };
  return DEFAULT_ANALYZE_SCORES;
}

export async function initializeElementsScores() {
  let statistics = {};
  try {
    // The path is relative to the `public` directory at runtime.
    let statsModule = await import('../../public/statistics.json', { assert: { type: 'json' } });
    statistics = statsModule.default;
  } catch (error) {
    // If the file is not found, we'll just use an empty object and fall back to defaults.
    if (error.code !== 'ERR_MODULE_NOT_FOUND') {
      console.error("Error loading statistics.json:", error);
    }
  }

  const fireScores = statistics?.bestScoresByCoherence?.FIRE?.scores || {};
  const woodScores = statistics?.bestScoresByCoherence?.WOOD?.scores || {};
  const earthScores = statistics?.bestScoresByCoherence?.EARTH?.scores || {};
  const metalScores = statistics?.bestScoresByCoherence?.METAL?.scores || {};
  const waterScores = statistics?.bestScoresByCoherence?.WATER?.scores || {}; 

  let FIRE_SCORES = { ...fireScores };
  let WOOD_SCORES = { ...woodScores };
  let EARTH_SCORES = { ...earthScores };
  let METAL_SCORES = { ...metalScores };
  let WATER_SCORES = { ...waterScores };
  return {
    FIRE: FIRE_SCORES,
    WOOD: WOOD_SCORES,
    EARTH: EARTH_SCORES,
    METAL: METAL_SCORES,
    WATER: WATER_SCORES
  };
}

export let DEFAULT_ANALYZE_SCORES = await initializeScores();
export let ELEMENT_SCORES = {
    "FIRE": {
      "rate": 80,
      "count": 13,
      "total": 25,
      "scores": {
        "pillar_weight_year": 0.79,
        "pillar_weight_month": 1.45,
        "pillar_weight_day": 1.49,
        "pillar_weight_hour": 1.11,
        "dm_strength_ratio_extremely_strong": 3.79,
        "dm_strength_ratio_strong": 0.92,
        "dm_strength_ratio_extremely_weak": 0.24,
        "dm_strength_ratio_weak": 0.74,
        "day_master_strength_weight": 14.77,
        "branch_interactions_weight": 5.78,
        "excess_deficiency_weight": 12.38,
        "seasonal_dominance_weight": 5.09,
        "qi_sha_penalty_weight": 8.51,
        "mystical_trine_bonus": 15.47,
        "mystical_trine_penalty": 1.6,
        "stem_combination_bonus": 6.64,
        "stem_combination_penalty": 15.94,
        "branch_clash_penalty": 12.11,
        "earth_clash_penalty": 15.78,
        "earth_punishment_penalty": 4.72,
        "ten_god_analysis_weight": 12.16,
        "ten_god_bonus_zheng_guan": 9.61,
        "ten_god_bonus_zheng_cai": 8.26,
        "ten_god_bonus_pian_cai": 4.07,
        "cardinal_combination_bonus": 10.98,
        "movement_combination_bonus": 11.33,
        "secret_friendship_bonus": 13.86,
        "secret_enmity_penalty": 11.74,
        "punishment_penalty": 10.35,
        "normalization_offset_general": 8.42,
        "normalization_offset_fire": 1.63,
        "normalization_offset_metal": 6.16,
        "normalization_offset_wood": 6.81,
        "normalization_offset_water": 11.16,
        "normalization_offset_earth": 13.39,
        "favorable_useful_element_multiplier": 1.49,
        "unfavorable_useful_element_multiplier": 0.61,
        "dm_strength_seasonal_bonus_multiplier": 1.94,
        "dm_strength_seasonal_penalty_multiplier": 0.12,
        "prediction_threshold": 1.88,
        "use_day_master_strength_analysis": true,
        "use_branch_interactions": true,
        "use_excess_deficiency": true,
        "use_seasonal_dominance": false,
        "triades_can_be_harmfull": false,
        "mystical_trine_can_be_harmful": true,
        "use_qi_sha_penalty": false
      }
    },
    "METAL": {
      "rate": 67,
      "count": 27,
      "total": 57,
      "scores": {
        "pillar_weight_year": 0.85,
        "pillar_weight_month": 2.24,
        "pillar_weight_day": 1.47,
        "pillar_weight_hour": 2.64,
        "dm_strength_ratio_extremely_strong": 3.36,
        "dm_strength_ratio_strong": 0.64,
        "dm_strength_ratio_extremely_weak": 0.01,
        "dm_strength_ratio_weak": 0.33,
        "day_master_strength_weight": 12.49,
        "branch_interactions_weight": 7.17,
        "excess_deficiency_weight": 1.86,
        "seasonal_dominance_weight": 3.11,
        "qi_sha_penalty_weight": 11.78,
        "mystical_trine_bonus": 7.88,
        "mystical_trine_penalty": 13.84,
        "stem_combination_bonus": 2.61,
        "stem_combination_penalty": 13.62,
        "branch_clash_penalty": 4.87,
        "earth_clash_penalty": 5.5,
        "earth_punishment_penalty": 12.09,
        "ten_god_analysis_weight": 2.86,
        "ten_god_bonus_zheng_guan": 2.36,
        "ten_god_bonus_zheng_cai": 13.33,
        "ten_god_bonus_pian_cai": 2.2,
        "cardinal_combination_bonus": 14.86,
        "movement_combination_bonus": 11.24,
        "secret_friendship_bonus": 13.38,
        "secret_enmity_penalty": 1.4,
        "punishment_penalty": 9.27,
        "normalization_offset_general": 1.17,
        "normalization_offset_fire": 15.37,
        "normalization_offset_metal": 10.39,
        "normalization_offset_wood": 4.38,
        "normalization_offset_water": 12.78,
        "normalization_offset_earth": 12.45,
        "favorable_useful_element_multiplier": 0.76,
        "unfavorable_useful_element_multiplier": 0.53,
        "dm_strength_seasonal_bonus_multiplier": 2,
        "dm_strength_seasonal_penalty_multiplier": 0.31,
        "prediction_threshold": 1.1,
        "use_day_master_strength_analysis": true,
        "use_branch_interactions": true,
        "use_excess_deficiency": true,
        "use_seasonal_dominance": true,
        "triades_can_be_harmfull": false,
        "mystical_trine_can_be_harmful": true,
        "use_qi_sha_penalty": true
      }
    },
    "WOOD": {
      "rate": 73,
      "count": 5,
      "total": 14,
      "scores": {
        "pillar_weight_year": 1.82,
        "pillar_weight_month": 0.89,
        "pillar_weight_day": 0.68,
        "pillar_weight_hour": 0.7,
        "dm_strength_ratio_extremely_strong": 3.8,
        "dm_strength_ratio_strong": 0.89,
        "dm_strength_ratio_extremely_weak": 0.36,
        "dm_strength_ratio_weak": 0.62,
        "day_master_strength_weight": 12.01,
        "branch_interactions_weight": 13.7,
        "excess_deficiency_weight": 2.82,
        "seasonal_dominance_weight": 5.82,
        "qi_sha_penalty_weight": 10.46,
        "mystical_trine_bonus": 6.01,
        "mystical_trine_penalty": 13.25,
        "stem_combination_bonus": 5.31,
        "stem_combination_penalty": 1.61,
        "branch_clash_penalty": 2.42,
        "earth_clash_penalty": 7.54,
        "earth_punishment_penalty": 2.55,
        "ten_god_analysis_weight": 14.01,
        "ten_god_bonus_zheng_guan": 6.84,
        "ten_god_bonus_zheng_cai": 15.04,
        "ten_god_bonus_pian_cai": 15.17,
        "cardinal_combination_bonus": 5.42,
        "movement_combination_bonus": 7.46,
        "secret_friendship_bonus": 7.05,
        "secret_enmity_penalty": 13.08,
        "punishment_penalty": 1.61,
        "normalization_offset_general": 1.44,
        "normalization_offset_fire": 1.23,
        "normalization_offset_metal": 1.1,
        "normalization_offset_wood": 13.77,
        "normalization_offset_water": 5.64,
        "normalization_offset_earth": 3.38,
        "favorable_useful_element_multiplier": 1.7,
        "unfavorable_useful_element_multiplier": 0.23,
        "dm_strength_seasonal_bonus_multiplier": 2.2,
        "dm_strength_seasonal_penalty_multiplier": 0.91,
        "prediction_threshold": 4.94,
        "use_day_master_strength_analysis": true,
        "use_branch_interactions": false,
        "use_excess_deficiency": true,
        "use_seasonal_dominance": false,
        "triades_can_be_harmfull": false,
        "mystical_trine_can_be_harmful": false,
        "use_qi_sha_penalty": true
      }
    },
    "WATER": {
      "rate": 79,
      "count": 11,
      "total": 19,
      "scores": {
        "pillar_weight_year": 2.07,
        "pillar_weight_month": 0.31,
        "pillar_weight_day": 0.41,
        "pillar_weight_hour": 2.12,
        "dm_strength_ratio_extremely_strong": 3.7,
        "dm_strength_ratio_strong": 1.18,
        "dm_strength_ratio_extremely_weak": 0.05,
        "dm_strength_ratio_weak": 0.92,
        "day_master_strength_weight": 15.05,
        "branch_interactions_weight": 1.16,
        "excess_deficiency_weight": 15.22,
        "seasonal_dominance_weight": 2.47,
        "qi_sha_penalty_weight": 2.28,
        "mystical_trine_bonus": 13.98,
        "mystical_trine_penalty": 8.52,
        "stem_combination_bonus": 9.9,
        "stem_combination_penalty": 13.25,
        "branch_clash_penalty": 10.18,
        "earth_clash_penalty": 9.32,
        "earth_punishment_penalty": 11.31,
        "ten_god_analysis_weight": 4.53,
        "ten_god_bonus_zheng_guan": 10.91,
        "ten_god_bonus_zheng_cai": 11.14,
        "ten_god_bonus_pian_cai": 15.82,
        "cardinal_combination_bonus": 7.15,
        "movement_combination_bonus": 12.17,
        "secret_friendship_bonus": 2.58,
        "secret_enmity_penalty": 14.89,
        "punishment_penalty": 13.59,
        "normalization_offset_general": 5.06,
        "normalization_offset_fire": 9.75,
        "normalization_offset_metal": 15.1,
        "normalization_offset_wood": 11.36,
        "normalization_offset_water": 2.84,
        "normalization_offset_earth": 7.34,
        "favorable_useful_element_multiplier": 1.65,
        "unfavorable_useful_element_multiplier": 1.42,
        "dm_strength_seasonal_bonus_multiplier": 1.16,
        "dm_strength_seasonal_penalty_multiplier": 0.87,
        "prediction_threshold": 1.56,
        "use_day_master_strength_analysis": true,
        "use_branch_interactions": true,
        "use_excess_deficiency": true,
        "use_seasonal_dominance": true,
        "triades_can_be_harmfull": true,
        "mystical_trine_can_be_harmful": true,
        "use_qi_sha_penalty": false
      }
    },
    "EARTH": {
      "rate": 82,
      "count": 9,
      "total": 17,
      "scores": {
        "pillar_weight_year": 0.99,
        "pillar_weight_month": 1.48,
        "pillar_weight_day": 0.22,
        "pillar_weight_hour": 2.83,
        "dm_strength_ratio_extremely_strong": 1.85,
        "dm_strength_ratio_strong": 0.81,
        "dm_strength_ratio_extremely_weak": 0.41,
        "dm_strength_ratio_weak": 0.78,
        "day_master_strength_weight": 11.68,
        "branch_interactions_weight": 1.46,
        "excess_deficiency_weight": 15.67,
        "seasonal_dominance_weight": 15.91,
        "qi_sha_penalty_weight": 6.42,
        "mystical_trine_bonus": 6.97,
        "mystical_trine_penalty": 1.57,
        "stem_combination_bonus": 14.25,
        "stem_combination_penalty": 12.91,
        "branch_clash_penalty": 2.94,
        "earth_clash_penalty": 13.07,
        "earth_punishment_penalty": 6.06,
        "ten_god_analysis_weight": 7.46,
        "ten_god_bonus_zheng_guan": 15.03,
        "ten_god_bonus_zheng_cai": 7.16,
        "ten_god_bonus_pian_cai": 10.41,
        "cardinal_combination_bonus": 3.25,
        "movement_combination_bonus": 2.39,
        "secret_friendship_bonus": 4.61,
        "secret_enmity_penalty": 9.75,
        "punishment_penalty": 1.07,
        "normalization_offset_general": 12.3,
        "normalization_offset_fire": 3.71,
        "normalization_offset_metal": 14.64,
        "normalization_offset_wood": 10.84,
        "normalization_offset_water": 2.17,
        "normalization_offset_earth": 14.38,
        "favorable_useful_element_multiplier": 1.8,
        "unfavorable_useful_element_multiplier": 0.76,
        "dm_strength_seasonal_bonus_multiplier": 2.64,
        "dm_strength_seasonal_penalty_multiplier": 0.23,
        "prediction_threshold": 2.1,
        "use_day_master_strength_analysis": false,
        "use_branch_interactions": true,
        "use_excess_deficiency": true,
        "use_seasonal_dominance": false,
        "triades_can_be_harmfull": false,
        "mystical_trine_can_be_harmful": true,
        "use_qi_sha_penalty": true
      }
    }
}
  //wait initializeElementsScores();
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
 * Retorna o nome do 10 Deus (Shen) que o targetStem é em relação ao dmStem.
 * @param {string} dmStem - Tronco Celestial do Mestre do Dia (Time).
 * @param {string} targetStem - Tronco Celestial do Alvo (Jogo).
 * @returns {string | null} - Ex: 'Zheng Cai', 'Qi Sha', 'Bi Jian', etc.
 */
export function getTenGodRelationship(dmStem, targetStem) {
    if (!dmStem || !targetStem) return null;

    const dmElement = STEM_ELEMENTS[dmStem].element;
    const dmPolarity = getElementPolarity(dmStem);
    const targetElement = STEM_ELEMENTS[targetStem].element;
    const targetPolarity = getElementPolarity(targetStem);
    
    // Mapeamento de 10 Deuses baseado no Ciclo de Geração e Controle (Wu Xing)
    // E na Polaridade (Yin/Yang)
    const relationships = {
        // Gera o DM (Recursos)
        [GENERATION_CYCLE[dmElement]]: targetPolarity === dmPolarity ? 'Pian Yin' : 'Zheng Yin',
        // É gerado pelo DM (Expressão)
        [GENERATED_CYCLE[dmElement]]: targetPolarity === dmPolarity ? 'Shi Shen' : 'Shang Guan',
        // Controla o DM (Poder/Autoridade)
        [CONTROL_CYCLE[dmElement]]: targetPolarity === dmPolarity ? 'Qi Sha' : 'Zheng Guan',
        // É controlado pelo DM (Riqueza)
        [CONTROLLED_CYCLE[dmElement]]: targetPolarity === dmPolarity ? 'Pian Cai' : 'Zheng Cai',
        // Idêntico ao DM (Companheiros/Amigos)
        [dmElement]: targetPolarity === dmPolarity ? 'Bi Jian' : 'Jie Cai',
    };
    
    // Busca o Deus (Shen)
    for (const el in relationships) {
        if (el === targetElement) {
            return relationships[el];
        }
    }
    return null;
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
        Object.assign(standardized, data);
    } else {
        return null; // Formato de entrada inválido
    }

    // Deriva arrays de stems (Troncos) e branches (Ramos)
    // Garante que a derivação aconteça mesmo se a entrada já for padronizada.
    if (!standardized.stems || !standardized.branches) {
        const gzPillars = [standardized.gzYear, standardized.gzMonth, standardized.gzDay, standardized.gzHour].filter(Boolean);
        standardized.stems = gzPillars.map(gz => getGanzhiParts(gz).stem);
        standardized.branches = gzPillars.map(gz => getGanzhiParts(gz).branch);
    }

    return standardized;
}

// -------------------------------------------------------------
//  1. FUNÇÃO PRINCIPAL DE CÁLCULO WUXING
// -------------------------------------------------------------

function getGanzhiParts(ganzhi) {
    if (!ganzhi || ganzhi.length !== 2) return { stem: null, branch: null };
    return { stem: ganzhi.charAt(0), branch: ganzhi.charAt(1) };
}


export function calculateWuXing(baziData, gameBazi = null, scoresConfig) {
  // console.log(baziData, gameBazi);
  // 1. Padronizar e Inicializar Pilares
  const primaryBazi = standardizeBaziInput(baziData);
  const secondaryBazi = gameBazi ? standardizeBaziInput(gameBazi) : null;

  if (!primaryBazi || !primaryBazi.gzYear || !primaryBazi.gzMonth || !primaryBazi.gzDay) return null;

  const { gzYear, gzMonth, gzDay, gzHour, stems, branches } = primaryBazi;

  // Define dayMasterElement for internal calculations like semi-trines
  let dayMasterElement = null;
  if (gzDay) {
    dayMasterElement = getGanzhiElement(gzDay);
  }

  // NOVO: Unificação de Troncos e Ramos dos dois mapas Bazi (se o secundário existir)
  const secondaryStems = secondaryBazi ? secondaryBazi.stems : [];
  const secondaryBranches = secondaryBazi ? secondaryBazi.branches : [];

  // Define os ramos do time e do jogo para a análise de interação
  const teamBranches = primaryBazi.branches;
  const gameBranches = secondaryBazi ? secondaryBazi.branches : [];

  const allStems = [...stems, ...secondaryStems];
  const allBranches = [...branches, ...secondaryBranches];
  // FIM NOVO

  const pillars = [
    { ...getGanzhiParts(gzYear), weight: scoresConfig.pillar_weight_year },
    { ...getGanzhiParts(gzMonth), weight: scoresConfig.pillar_weight_month }, // Mês mais pesado
    { ...getGanzhiParts(gzDay), weight: scoresConfig.pillar_weight_day } // Dia/Day Master mais pesado
  ];

  if (gzHour) {
    pillars.push({ ...getGanzhiParts(gzHour), weight: scoresConfig.pillar_weight_hour });
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
  const appliedCombinations = new Set(); // Para evitar aplicar o mesmo bônus duas vezes
  for (let i = 0; i < teamBranches.length; i++) {
      for (let j = 0; j < gameBranches.length; j++) {
          // Verifica se os pilares são os mesmos ou adjacentes
          if (Math.abs(i - j) <= 1) {
              const tBranch = teamBranches[i];
              const gBranch = gameBranches[j];
              const combinationKey = [tBranch, gBranch].sort().join(',');

              if (BRANCH_COMBINATIONS[tBranch] === gBranch && !appliedCombinations.has(combinationKey)) {
                  const comboInfo = BRANCH_COMBINATIONS_WEIGTHS.find(c => c.pair.includes(tBranch) && c.pair.includes(gBranch));
                  if (comboInfo) {
                      initialSums[comboInfo.element] += comboInfo.bonus * COMBINATION_BONUS_MULTIPLIER;
                      appliedCombinations.add(combinationKey);
                  }
              }
          }
      }
  }


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
      // NOVO: Verificar semi-tríade entre Dia e Hora do time
      if (gzDay && gzHour) {
        const dayBranch = getGanzhiParts(gzDay).branch;
        const currentDayMasterElement = getGanzhiElement(gzDay); // Deriva o DM do mapa atual
        const hourBranch = getGanzhiParts(gzHour).branch;

        // Verifica se Dia e Hora pertencem à tríade atual e um deles é o ramo central
        if (
          triadBranches.includes(dayBranch) &&
          triadBranches.includes(hourBranch) &&
          (dayBranch === centralBranch || hourBranch === centralBranch) &&
          currentDayMasterElement === triadElement
        ) {
          bonusPercentage = TRIAD_BONUS_PERCENTAGES.FULL_TRIAD * 1.5; 
          if(getGanzhiElement(gzHour) === triadElement){
            bonusPercentage = TRIAD_BONUS_PERCENTAGES.FULL_TRIAD * 5; 
          }
            
            
          // Aplica bônus de semi-tríade{
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
  // Adiciona uma verificação para evitar divisão por zero, que causa NaN.
  if (Object.values(initialSums).reduce((a, b) => a + b, 0) === 0) {
    return { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  }

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

export const STEM_ELEMENTS = {
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


/**
 * Verifica se o mapa é um Padrão de 'Segue Produção/Criança'.
 * Ocorre quando o MD é extremamente fraco E a energia de Produção/Output é dominante.
 * * Lógica Simplificada: Output deve ser dominante e o Suporte (Self + Resource) deve ser mínimo.
 * @returns {boolean}
 */
function checkFollowOutputPattern(wuXingMap, dayMasterElement) {
    const totalPower = Object.values(wuXingMap).reduce((sum, val) => sum + val, 0);
    if (totalPower === 0) return false;

    // Elementos chave
    const produced = GENERATION_CYCLE[dayMasterElement]; // Output
    const generating = Object.keys(GENERATION_CYCLE).find(e => GENERATION_CYCLE[e] === dayMasterElement); // Recurso
    
    // Pesos
    const outputPower = wuXingMap[produced];
    const resourcePower = wuXingMap[generating];
    const selfPower = wuXingMap[dayMasterElement];
    
    // Condições quantitativas simplificadas
    const outputRatio = outputPower / totalPower;
    const supportRatio = (resourcePower + selfPower) / totalPower;

    // 1. Output é muito dominante (Ex: > 40% da energia total)
    const isOutputDominant = outputRatio >= 0.40;
    
    // 2. Suporte ao MD é extremamente fraco (Ex: < 15% da energia total)
    const isMDSupportWeak = supportRatio <= 0.15;

    // 3. Output é significativamente mais forte que o Suporte
    const isOutputMuchStronger = outputPower > (selfPower + resourcePower) * 2.5;
    
    // Para ser um Follow Output, deve haver um output dominante E suporte fraco.
    if (isOutputDominant && isMDSupportWeak && isOutputMuchStronger) {
        return true;
    }

    return false;
}

/**
 * Verifica se o mapa é um Padrão de 'Segue Poder'.
 * Ocorre quando o MD é extremamente fraco E a energia de Poder/Oficial é dominante.
 * * Lógica Simplificada: Poder/Oficial deve ser dominante e o Suporte (Self + Resource) deve ser mínimo.
 * @returns {boolean}
 */
function checkFollowPowerPattern(wuXingMap, dayMasterElement) {
    const totalPower = Object.values(wuXingMap).reduce((sum, val) => sum + val, 0);
    if (totalPower === 0) return false;

    // Elementos chave
    const controller = Object.keys(CONTROL_CYCLE).find(e => CONTROL_CYCLE[e] === dayMasterElement); // Poder/Oficial
    const generating = Object.keys(GENERATION_CYCLE).find(e => GENERATION_CYCLE[e] === dayMasterElement); // Recurso
    
    // Pesos
    const controllerPower = wuXingMap[controller];
    const resourcePower = wuXingMap[generating];
    const selfPower = wuXingMap[dayMasterElement];
    
    // Condições quantitativas simplificadas
    const controllerRatio = controllerPower / totalPower;
    const supportRatio = (resourcePower + selfPower) / totalPower;

    // 1. Poder/Oficial é muito dominante (Ex: > 40% da energia total)
    const isControllerDominant = controllerRatio >= 0.40;
    
    // 2. Suporte ao MD é extremamente fraco (Ex: < 15% da energia total)
    const isMDSupportWeak = supportRatio <= 0.15;

    // 3. Poder/Oficial é significativamente mais forte que o Suporte
    const isControllerMuchStronger = controllerPower > (selfPower + resourcePower) * 2.5;
    
    // Para ser um Follow Power, deve haver um controlador dominante E suporte fraco.
    if (isControllerDominant && isMDSupportWeak && isControllerMuchStronger) {
        return true;
    }

    return false;
}

// -------------------------------------------------------------
//  FORÇA DO DAY MASTER (NOVO)
// -------------------------------------------------------------
export function getDayMasterStrength(dayMasterElement, wuXingMap, gzMonth, gzDay, scoresConfig) {
    // --- 1. Determinação dos Elementos (Peso Bruto) ---
    const self = wuXingMap[dayMasterElement];
    
    const supporterElement = Object.keys(GENERATION_CYCLE).find(e => GENERATION_CYCLE[e] === dayMasterElement);
    const supporter = wuXingMap[supporterElement];

    const output = wuXingMap[GENERATION_CYCLE[dayMasterElement]];

    const controllerElement = Object.keys(CONTROL_CYCLE).find(e => CONTROL_CYCLE[e] === dayMasterElement);
    const controller = wuXingMap[controllerElement]; 
    
    const wealthElement = CONTROL_CYCLE[dayMasterElement]; // Correção para definir wealthElement
    const wealth = wuXingMap[wealthElement];

    // --- 2. Hierarquia Sazonal (Mês) ---
    
    let seasonalMultiplier = 1.0;
    
    // Assume que gzMonth é uma string Ganzhi (ex: '庚申')
    const monthBranch = getGanzhiParts(gzMonth).branch; 
    const monthMultipliers = SEASON_MULTIPLIERS[monthBranch] || {};
    
    const isMonthFavorable = monthMultipliers[dayMasterElement] || monthMultipliers[supporterElement]; 
    
    if (isMonthFavorable) {
        seasonalMultiplier = scoresConfig.dm_strength_seasonal_bonus_multiplier || 1.8; // Bônus por estar em estação.
    } else if (monthMultipliers[controllerElement] || monthMultipliers[wealthElement]) {
        seasonalMultiplier = scoresConfig.dm_strength_seasonal_penalty_multiplier || 0.6; // Penalidade por estar em estação de dreno/controle.
    }
    
    // --- 3. Cálculo Ponderado ---

    const drainingPowerTotal = output + controller + wealth;
    const supportivePowerWeighted = (self + supporter) * seasonalMultiplier;
    const finalRatio = supportivePowerWeighted / (drainingPowerTotal + 1);

    // --- 4. DETERMINAÇÃO DE PADRÕES ESPECIAIS (CASOS DE SEGUIMENTO) ---
    // Estas verificações anulam as classificações de Fraco.
    
    if (checkFollowPowerPattern(wuXingMap, dayMasterElement)) {
        return "followPower"; 
    }

    if (checkFollowOutputPattern(wuXingMap, dayMasterElement)) {
        return "followOutput";
    }

    // --- 5. Determinação da Força Padrão (Limiares Ajustados) ---
    
    if (finalRatio >= scoresConfig.dm_strength_ratio_extremely_strong) {
        return "extremelyStrong";
    }
    if (finalRatio >= scoresConfig.dm_strength_ratio_strong) {
        return "strong"; 
    }
    
    // Fraco
    if (finalRatio <= scoresConfig.dm_strength_ratio_extremely_weak) {
        return "extremelyWeak";
    }
    if (finalRatio <= scoresConfig.dm_strength_ratio_weak) {
        return "weak";
    }
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
    // Adiciona uma verificação para garantir que gameBazi e suas propriedades existem
    if (!gameBazi || !gameBazi.gzDay || !gameBazi.gzMonth) {
        return false;
    }

    const dayElement = getGanzhiElement(gameBazi.gzDay);
    const dayAnimal = gameBazi.gzDay.charAt(1);
    const monthAnimal = gameBazi.gzMonth.charAt(1);
    const hourAnimal = gameBazi.gzHour? gameBazi.gzHour.charAt(1) : null;

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
  // Elementos do Ciclo Wu Xing
  const generating = Object.keys(GENERATION_CYCLE).find(e => GENERATION_CYCLE[e] === dayMasterElement); // Recurso
  const produced = GENERATION_CYCLE[dayMasterElement]; // Produção/Output
  const controller = Object.keys(CONTROL_CYCLE).find(e => CONTROL_CYCLE[e] === dayMasterElement); // Poder/Oficial
  const controlled = CONTROL_CYCLE[dayMasterElement]; // Riqueza/Wealth
  
  switch (strength) {
    // 1. 🌊 Caso Especial: Segue Poder (Follow Power / Cong Qiang - 従強)
    // O MD é extremamente fraco e a energia dominante no mapa é o Poder/Oficial.
    case "followPower":
      return {
        // Favoráveis: O Poder dominante e o elemento que o gera (Riqueza do MD).
        favorable: [controller, controlled],
        // Maléficos: Tentar apoiar o MD fraco ou drenar o Poder.
        unfavorable: [dayMasterElement, generating, produced] 
      };

    // 2. 👶 Caso Especial: Segue Produção/Criança (Follow Output / Cong Er - 従兒)
    // O MD é extremamente fraco e a energia dominante é a Produção/Output.
    case "followOutput":
      return {
        // Favoráveis: A Produção dominante e o elemento que ela gera (Riqueza).
        favorable: [produced, controlled],
        // Maléficos: Tentar controlar a Produção ou fortalecer o MD.
        unfavorable: [dayMasterElement, generating, controller] 
      };

    case "weak":
    case "extremelyWeak":
      // MD Fraco Típico: Precisa ser apoiado.
      return {
        favorable: [dayMasterElement, generating],
        unfavorable: [controller, controlled] // Corrigido para incluir o Controlador e o Controlado como Maléficos.
      };

    case "strong":
      // MD Forte Típico: Precisa ser drenado e controlado.
      return {
        favorable: [produced, controlled, controller], // Inclui o Controlador para balancear.
        unfavorable: [dayMasterElement, generating]
      };

    case "extremelyStrong":
      // MD Extremamente Forte (Força Total): Priorizar vazão (Produção) e evitar confronto (Poder).
      return {
        favorable: [produced, controlled], // Foco em Dreno (Output e Wealth)
        unfavorable: [dayMasterElement, generating, controller] // Evita o confronto (Controller)
      };

    case "balanced":
    default:
      // MD Equilibrado: Busca fluidez (Produção) e Controle (Oficial) para mantê-lo sob controle.
      return {
        favorable: [produced, controller], // Busca Produção e Controle sutil.
        unfavorable: [generating] // Recurso (geração) pode desequilibrar.
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
/**
 * Verifica se dois Troncos Celestes (Tiangan) formam uma Combinação (He Hua)
 * e retorna o elemento resultante da transformação, se bem-sucedida.
 * * @param {string} stem1 - O primeiro Tronco Celestial (e.g., '甲', '乙').
 * @param {string} stem2 - O segundo Tronco Celestial (e.g., '己', '庚').
 * @returns {string | null} - O elemento resultante ('wood', 'fire', 'earth', 'metal', 'water') ou null se não houver combinação.
 */
export function getStemCombinationElement(stem1, stem2) {
    if (!stem1 || !stem2) return null;

    // Normaliza e define os pares de combinação e seus elementos transformados
    // NOTA: Em uma análise completa, a transformação só é bem-sucedida se for suportada
    // pelo Mês (Qi) ou pelo Bazi em geral. Aqui, estamos apenas verificando o potencial de combinação.
    const combinationsMap = {
        '甲': { partner: '己', element: 'earth' }, // Jia (甲) + Ji (己) -> Earth
        '己': { partner: '甲', element: 'earth' }, 

        '乙': { partner: '庚', element: 'metal' }, // Yi (乙) + Geng (庚) -> Metal
        '庚': { partner: '乙', element: 'metal' },

        '丙': { partner: '辛', element: 'water' }, // Bing (丙) + Xin (辛) -> Water
        '辛': { partner: '丙', element: 'water' },

        '丁': { partner: '壬', element: 'wood' },  // Ding (丁) + Ren (壬) -> Wood
        '壬': { partner: '丁', element: 'wood' },

        '戊': { partner: '癸', element: 'fire' },  // Wu (戊) + Gui (癸) -> Fire
        '癸': { partner: '戊', element: 'fire' },
    };

    const s1 = stem1.trim();
    const s2 = stem2.trim();

    // 1. Verifica se o primeiro Tronco faz parte de uma combinação
    if (combinationsMap[s1]) {
        // 2. Verifica se o segundo Tronco é o parceiro necessário
        if (combinationsMap[s1].partner === s2) {
            // 3. Retorna o elemento transformado
            return combinationsMap[s1].element;
        }
    }

    // Retorna null se não houver combinação
    return null;
}
let use_branch_priority_system = false
// -------------------------------------------------------------
//  2. ANÁLISE DE FAVORABILIDADE COMPLETA
// -------------------------------------------------------------
export function analyzeTeamFavorability(teamBazi, gameBazi, scoresConfig = null) {

  const reasons = [];
  // Verifica se a estrutura é { elemento_ano, animal_ano, ... } e converte para { gzYear, ... }
  if (teamBazi.elemento_ano && teamBazi.animal_ano) {
    teamBazi = {
      gzYear: `${teamBazi.elemento_ano}${teamBazi.animal_ano}`,
      gzMonth: teamBazi.elemento_mes && teamBazi.animal_mes ? `${teamBazi.elemento_mes}${teamBazi.animal_mes}` : null,
      gzDay: `${teamBazi.elemento_dia}${teamBazi.animal_dia}`,
      gzHour: teamBazi.elemento_hora && teamBazi.animal_hora ? `${teamBazi.elemento_hora}${teamBazi.animal_hora}` : null,
    };
  }

    if (gameBazi.elemento_ano && gameBazi.animal_ano) {
    gameBazi = {
      gzYear: `${gameBazi.elemento_ano}${gameBazi.animal_ano}`,
      gzMonth: gameBazi.elemento_mes && gameBazi.animal_mes ? `${gameBazi.elemento_mes}${gameBazi.animal_mes}` : null,
      gzDay: `${gameBazi.elemento_dia}${gameBazi.animal_dia}`,
      gzHour: gameBazi.elemento_hora && gameBazi.animal_hora ? `${gameBazi.elemento_hora}${gameBazi.animal_hora}` : null,
    };
  }
  // -------------------------------------------------------------
  //  Core Utility Functions (Restored from optimized version)
  // -------------------------------------------------------------
  
  // Função auxiliar para determinar o valor base proporcional (1, 2, 3 ou 4)
  const getProportionalScoreValue = (percentage) => {
    if (percentage >= 75) return 4;
    if (percentage >= 50) return 3;
    if (percentage >= 25) return 2;
    return 1;
  };

  // Funções de Cálculo de Pontuação por Categoria (Restored normalization)
  // MaxPoints é NECESSÁRIO para garantir que a pontuação da categoria seja
  // normalizada antes de ser multiplicada pelo peso total.
  const calculateCategoryScore = (weight, points, maxPoints) => {
    // Fallback para evitar NaN se maxPoints for undefined.
    if (maxPoints === undefined) {
        maxPoints = 1;
    }
    // (Pontos recebidos / Pontos máximos) * Peso total
    return (points / maxPoints) * weight;
  };


  // Verifica qual elemento de coerência está ativo para o dia do jogo
  const activeCoherenceElement = Object.keys(coherenceFilters).find(key => {
    return gameBazi && coherenceFilters[key](gameBazi);
  });

  // Define o valor de normalização a ser usado
  let normalizationOffset = scoresConfig?.normalization_offset_general ?? 0;
  if (activeCoherenceElement) {
    const coherenceOffsetKey = `normalization_offset_${activeCoherenceElement.toLowerCase()}`;
    if (scoresConfig[coherenceOffsetKey] !== undefined) {
      normalizationOffset = scoresConfig[coherenceOffsetKey];
      reasons.push(`[Norm] Offset de normalização para ${activeCoherenceElement} aplicado: ${normalizationOffset}.`);
    }
  } else {
      reasons.push(`[Norm] Offset de normalização geral aplicado: ${normalizationOffset}.`);
  }

  // Se um elemento de coerência for encontrado, verifica se sua flag de configuração customizada está ativa
  if (activeCoherenceElement) {
    // console.log(activeCoherenceElement);
    // ELEMENT_SCORES = initializeElementsScores();
    // console.log(ELEMENT_SCORES)
    scoresConfig = ELEMENT_SCORES[activeCoherenceElement].scores;
    reasons.push(`⚡ Configuração otimizada para coerência de ${activeCoherenceElement} aplicada.`);
  }else{
    scoresConfig = DEFAULT_ANALYZE_SCORES;
  }

  let totalScore = 0;

  let teamPercentages = calculateWuXing(teamBazi, gameBazi, scoresConfig);
  let gamePercentages = calculateWuXing(gameBazi, null, scoresConfig);

  // -------------------------------------------------------------
  //  Elemento dominante REAL
  // -------------------------------------------------------------
  if (!teamPercentages || !gamePercentages) {
    console.error("ANALYZE ERROR: wuxing calculation returned null. Aborting.");
    return { score: NaN, reasons: ["Erro no cálculo de WuXing inicial."] };
  }
  const teamDominant = getTrueDominantElement(teamPercentages);
  const gameDominant = getTrueDominantElement(gamePercentages);

  
  // -------------------------------------------------------------
  //  NOVO: Day Master + Elementos Úteis (Condicional)
  // -------------------------------------------------------------
  let useful;
  let dayMasterElement = null;
  let dayStem = null;
  let strength = null;

  if (teamBazi.gzDay) {
    dayStem = getGanzhiParts(teamBazi.gzDay).stem;
    dayMasterElement = STEM_ELEMENTS[dayStem].element;
    strength = getDayMasterStrength(dayMasterElement, teamPercentages, teamBazi.gzMonth, teamBazi.gzDay, scoresConfig);

    // Prioriza os elementos hardcoded se existirem
    if (teamBazi.elementos_beneficos && teamBazi.elementos_maleficos) {
      useful = {
        favorable: Object.keys(teamBazi.elementos_beneficos),
        unfavorable: Object.keys(teamBazi.elementos_maleficos),
      };
    } else {
      useful = getUsefulElements(dayMasterElement, strength);
    }
  }

  if (scoresConfig.use_day_master_strength_analysis && teamBazi.gzDay && teamBazi.gzMonth) {
    let categoryPoints = 0;
    
    // MaxPoints baseado na estrutura do código OTIMIZADO anterior
    const maxCategoryPoints = 4 * Math.max(
        scoresConfig.favorable_useful_element_multiplier, 
        Math.abs(scoresConfig.unfavorable_useful_element_multiplier)
    );

    const gameDominantPercentage = gamePercentages[gameDominant];
    
    // REVERTIDO: Usa o valor proporcional (1-4) em vez do percentual (1-100)
    const proportionalValue = getProportionalScoreValue(gameDominantPercentage);

    // Bônus/Penalidade pelo elemento DOMINANTE do jogo
    if (useful.favorable.includes(gameDominant)) {
      const points = proportionalValue * scoresConfig.favorable_useful_element_multiplier;
      categoryPoints += points;
      reasons.push(`[DM] Elemento do jogo (${gameDominant}) é FAVORÁVEL ao Day Master (${dayMasterElement} ${strength}).`);
    }

    // NOVO: Bônus se um elemento favorável estiver presente entre 30-50% no jogo
    useful.favorable.forEach(favElement => {
      if (gamePercentages[favElement] >= 30 && gamePercentages[favElement] <= 50) {
        // Adiciona um bônus fixo, ponderado pelo multiplicador de elemento favorável
        const bonusPoints = 10 * scoresConfig.favorable_useful_element_multiplier;
        categoryPoints += bonusPoints;
        reasons.push(`[DM] Bônus: Elemento favorável '${favElement}' está forte (${gamePercentages[favElement]}%) no mapa do jogo.`);
      }
    });

    if (useful.unfavorable.includes(gameDominant)) {
      const points = proportionalValue * scoresConfig.unfavorable_useful_element_multiplier;
      categoryPoints += points; // Note: multiplier must be negative for penalty
      reasons.push(`[DM] Elemento do jogo (${gameDominant}) é DESFAVORÁVEL ao Day Master (${dayMasterElement} ${strength}).`);
    }

    // Adiciona penalidade de Qi Sha (7 Killings)
    if (scoresConfig.use_qi_sha_penalty) {
      const gameDayStem = getGanzhiParts(gameBazi.gzDay).stem;
      const gameDayElement = STEM_ELEMENTS[gameDayStem].element;

      // Verifica se o elemento do dia do jogo controla o Day Master
      if (CONTROL_CYCLE[gameDayElement] === dayMasterElement) {
        const dayMasterPolarity = getElementPolarity(dayStem);
        const gameDayPolarity = getElementPolarity(gameDayStem);

        // Se ambos têm a mesma polaridade, é Qi Sha
        if (dayMasterPolarity === gameDayPolarity) {
          // Usa 1 como MaxPoints para a penalidade Qi Sha
          const qiShaScore = calculateCategoryScore(scoresConfig.qi_sha_penalty_weight, -1, 1);
          totalScore += qiShaScore;
          reasons.push(`[Qi Sha] Penalidade de 7 Killings: O dia do jogo controla o Day Master com mesma polaridade.`);
        }
      }
    }
    
    // Usa o calculateCategoryScore REVERTIDO (normalizado)
    const dmScore = calculateCategoryScore(scoresConfig.day_master_strength_weight, categoryPoints, maxCategoryPoints);
    totalScore += dmScore;
  }


  // -------------------------------------------------------------
  //  Combinação de Troncos Celestes do Dia
  // -------------------------------------------------------------
  if (scoresConfig.use_stem_combinations && teamBazi.gzDay && gameBazi.gzDay) {
      
      const teamDayStem = getGanzhiParts(teamBazi.gzDay).stem;
      const gameDayStem = getGanzhiParts(gameBazi.gzDay).stem;
      const combinationResult = getStemCombinationElement(teamDayStem, gameDayStem);
      
      if (combinationResult) {
          let categoryPoints = 5;
          let maxCategoryPoints = 5 + scoresConfig.stem_combination_bonus; // Max points is base (5) + max bonus

          // Verifica se o elemento transformado é favorável ao Day Master do Time
          if (scoresConfig.use_day_master_strength_analysis) {
            
              if (useful.favorable.includes(combinationResult)) {
                  categoryPoints += scoresConfig.stem_combination_bonus;
                  reasons.push(`[Tronco He] Bônus: Combinação Dia-Dia (${teamDayStem}-${gameDayStem}) transforma em ${combinationResult}, que é FAVORÁVEL.`);
              } else if (useful.unfavorable.includes(combinationResult)) {
                  categoryPoints -= scoresConfig.stem_combination_penalty;
                  maxCategoryPoints = Math.max(maxCategoryPoints, scoresConfig.stem_combination_penalty); // Max points must cover max penalty
                  reasons.push(`[Tronco He] Penalidade: Combinação Dia-Dia (${teamDayStem}-${gameDayStem}) transforma em ${combinationResult}, que é DESFAVORÁVEL.`);
              }
          } else {
              // Comportamento padrão: sempre dá bônus pela ligação e transformação
              categoryPoints += scoresConfig.stem_combination_bonus * 0.5; // Bônus neutro
              reasons.push(`[Tronco He] Bônus: Combinação Dia-Dia (${teamDayStem}-${gameDayStem}) transforma em ${combinationResult} (Sinergia).`);
          }
          
          const stemComboScore = calculateCategoryScore(scoresConfig.stem_combination_weight, categoryPoints, maxCategoryPoints);
          totalScore += stemComboScore;
      }
  }

  // -------------------------------------------------------------
  //  2. Harmonia, Conflito, Combinação, Tríades, Punições
  // -------------------------------------------------------------
  let categoryPoints = 0;
  const teamBranch = getGanzhiParts(teamBazi.gzYear).branch;
  const gameDayBranch = getGanzhiParts(gameBazi.gzDay).branch;  
  const teamBranches = [teamBazi.gzYear, teamBazi.gzMonth, teamBazi.gzDay, teamBazi.gzHour].map(gz => gz ? getGanzhiParts(gz).branch : null).filter(Boolean);
  const gameBranches = [gameBazi.gzYear, gameBazi.gzMonth, gameBazi.gzDay, gameBazi.gzHour].map(gz => gz ? getGanzhiParts(gz).branch : null).filter(Boolean);


  // Unificação de todos os ramos para checagem de punições/choques complexos
  const allBranches = [...teamBranches, ...gameBranches];

  let usedBranches = new Set(); // Armazena ramos já usados em combinações de maior prioridade


  if (scoresConfig.use_branch_interactions) {
    let categoryPoints = 0;
    
    // Define o MaxPoints com base na maior pontuação positiva possível (Ex: Cardinal Combination)
    const maxCategoryPoints = scoresConfig.cardinal_combination_bonus || 5;

    // 1. Combinação Cardeal (Direcional) - Maior Prioridade
    for (const element in DIRECTIONAL_COMBINATIONS) {
        const requiredBranches = DIRECTIONAL_COMBINATIONS[element];        
        // Note: use_branch_priority_system is assumed to be defined/passed in the scope or scoresConfig
        const presentBranches = allBranches.filter(b => 
            requiredBranches.includes(b) && (typeof use_branch_priority_system === 'undefined' || use_branch_priority_system === false || !usedBranches.has(b))
        );
        if (new Set(presentBranches).size === 3) {
            categoryPoints += maxCategoryPoints; // Usa o MaxPoints como pontuação
            reasons.push(`[Ramos] Combinação Cardeal de ${element.toUpperCase()} formada.`);
            if (typeof use_branch_priority_system !== 'undefined' && use_branch_priority_system !== false) requiredBranches.forEach(b => usedBranches.add(b));
            break; // Encontrou a mais forte, para a verificação
        }
    }
    
    if (branchInSameTrine(teamBranch, gameDayBranch)) {
            categoryPoints += 2;
            reasons.push(`[Ramos] Harmonia de Tríade: ${teamBranch} e ${gameDayBranch} na mesma tríade.`); 
    }
    
    // 2. Combinação de Movimento (Tríade)
    if (usedBranches.size < allBranches.length) {
        for (const triad of BRANCH_TRINES) {            
            const presentBranches = allBranches.filter(b => 
                triad.includes(b) && (typeof use_branch_priority_system === 'undefined' || use_branch_priority_system === false || !usedBranches.has(b))
            );
            if (new Set(presentBranches).size === 3) {
                categoryPoints += scoresConfig.movement_combination_bonus || 4;
                reasons.push(`[Ramos] Tríade de Movimento completa formada.`);
                if (typeof use_branch_priority_system !== 'undefined' && use_branch_priority_system !== false) triad.forEach(b => usedBranches.add(b));
                break;
            }
        }
    }

    // 3. Amizade Secreta (Liu He)
    if (usedBranches.size < allBranches.length) {
        for (const branch1 of teamBranches) {
            if (typeof use_branch_priority_system !== 'undefined' && use_branch_priority_system !== false && usedBranches.has(branch1)) continue;
            for (const branch2 of gameBranches) {
                if (typeof use_branch_priority_system !== 'undefined' && use_branch_priority_system !== false && usedBranches.has(branch2)) continue;
                if (BRANCH_COMBINATIONS[branch1] === branch2) {
                    categoryPoints += scoresConfig.secret_friendship_bonus || 3;
                    reasons.push(`[Ramos] Amizade Secreta (Liu He): ${branch1} e ${branch2}.`);
                    usedBranches.add(branch1); // Marca o ramo do time como usado
                    usedBranches.add(branch2); // Marca o ramo do jogo como usado
                }
            }
        }
    }

    // 4. Oposição (Chong)
    if (BRANCH_CONFLICT[teamBranch] === gameDayBranch) {
      if (!usedBranches.has(teamBranch) && !usedBranches.has(gameDayBranch)) {
          categoryPoints -= scoresConfig.branch_clash_penalty || 2;
          reasons.push(`[Ramos] Oposição (Chong): ${teamBranch} × ${gameDayBranch}.`);
          if (typeof use_branch_priority_system !== 'undefined' && use_branch_priority_system !== false) usedBranches.add(teamBranch);
          if (typeof use_branch_priority_system !== 'undefined' && use_branch_priority_system !== false) usedBranches.add(gameDayBranch);
      }
    }

    // 5. Inimizade Secreta (Harm)
    if (usedBranches.size < allBranches.length) {
        for (const harmPair of HARMS) {
            const [b1, b2] = harmPair;            
            if (allBranches.includes(b1) && allBranches.includes(b2) && (typeof use_branch_priority_system === 'undefined' || use_branch_priority_system === false || (!usedBranches.has(b1) && !usedBranches.has(b2)))) {
                categoryPoints -= scoresConfig.secret_enmity_penalty || 2;
                reasons.push(`[Ramos] Inimizade Secreta (Hai): ${b1} e ${b2}.`);
                if (typeof use_branch_priority_system !== 'undefined' && use_branch_priority_system !== false) usedBranches.add(b1);
                if (typeof use_branch_priority_system !== 'undefined' && use_branch_priority_system !== false) usedBranches.add(b2);
            }
        }
    }

    // 6. Punição (Xing)
    const punishmentType = isPunishment(allBranches.filter(b => !usedBranches.has(b)));
    if (punishmentType) {
        categoryPoints -= scoresConfig.punishment_penalty || 3;
        reasons.push(`[Ramos] Punição de ${punishmentType} ativada.`);
    }

    const branchScore = calculateCategoryScore(scoresConfig.branch_interactions_weight, categoryPoints, maxCategoryPoints);
    totalScore += branchScore;
  }


  // -------------------------------------------------------------
  // NOVO: 3. Análise de Riqueza e Autoridade (Zheng Guan, Cai)
  // -------------------------------------------------------------
  if (scoresConfig.use_ten_god_analysis && teamBazi.gzDay && gameBazi.gzDay) {
      // Logic for Ten God analysis (commented out by user)
      let categoryPoints = 0;
      // ... (your existing Ten God analysis logic) ...
      
      // Assumindo um MaxPoints razoável, se for implementado no futuro
      const tenGodMaxPoints = 5; 
      const tenGodScore = calculateCategoryScore(scoresConfig.ten_god_analysis_weight || 1.0, categoryPoints, tenGodMaxPoints);
      totalScore += tenGodScore;
  }


 
  // -------------------------------------------------------------
  //  Combinação de Troncos Celestes do Dia
  // -------------------------------------------------------------
  if (scoresConfig.use_stem_combinations && teamBazi.gzDay && gameBazi.gzDay) {
      
      const teamDayStem = getGanzhiParts(teamBazi.gzDay).stem;
      const gameDayStem = getGanzhiParts(gameBazi.gzDay).stem;
      const combinationResult = getStemCombinationElement(teamDayStem, gameDayStem);
      
      if (combinationResult) {
          let categoryPoints = 5;
          let maxCategoryPoints = 5 + scoresConfig.stem_combination_bonus; // Max points is base (5) + max bonus

          // Verifica se o elemento transformado é favorável ao Day Master do Time
          if (scoresConfig.use_day_master_strength_analysis) {
            
              if (useful.favorable.includes(combinationResult)) {
                  categoryPoints += scoresConfig.stem_combination_bonus;
                  reasons.push(`[Tronco He] Bônus: Combinação Dia-Dia (${teamDayStem}-${gameDayStem}) transforma em ${combinationResult}, que é FAVORÁVEL.`);
              } else if (useful.unfavorable.includes(combinationResult)) {
                  categoryPoints -= scoresConfig.stem_combination_penalty;
                  maxCategoryPoints = Math.max(maxCategoryPoints, scoresConfig.stem_combination_penalty); // Max points must cover max penalty
                  reasons.push(`[Tronco He] Penalidade: Combinação Dia-Dia (${teamDayStem}-${gameDayStem}) transforma em ${combinationResult}, que é DESFAVORÁVEL.`);
              }
          } else {
              // Comportamento padrão: sempre dá bônus pela ligação e transformação
              categoryPoints += scoresConfig.stem_combination_bonus * 0.5; // Bônus neutro
              reasons.push(`[Tronco He] Bônus: Combinação Dia-Dia (${teamDayStem}-${gameDayStem}) transforma em ${combinationResult} (Sinergia).`);
          }
          
          const stemComboScore2 = calculateCategoryScore(scoresConfig.stem_combination_weight, categoryPoints, maxCategoryPoints);
          totalScore += stemComboScore2;
      }
  }
    // -------------------------------------------------------------
    // NOVO: 2B. Choques e Punições de Terra (Bullying/Uncivilized)
    // -------------------------------------------------------------
    const clashPenalty = scoresConfig.earth_clash_penalty;
    const punishmentPenalty = scoresConfig.earth_punishment_penalty;

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
    const earthClashScore = calculateCategoryScore(scoresConfig.branch_interactions_weight, categoryPoints, 5);
    totalScore += earthClashScore;

// NOVO: Análise do Terceiro Místico (Formação de Tríade entre todos os pilares)

  let trineFound = false;
  for (const tBranch of teamBranches) {
    if (trineFound) break;
    for (const gBranch of gameBranches) {
      const mysticalTrineResult = findMysticalThirdForTrine(tBranch, gBranch);
      if (mysticalTrineResult) {
        let categoryPoints = 0;

        // Se a flag estiver ativa, verifica se o elemento da tríade é benéfico ou maléfico
        if (scoresConfig.triades_can_be_harmfull && scoresConfig.use_day_master_strength_analysis) {
          const dayStem = getGanzhiParts(teamBazi.gzDay).stem;
          const dayMasterElement = STEM_ELEMENTS[dayStem].element;
          const strength = getDayMasterStrength(dayMasterElement, teamPercentages, teamBazi.gzMonth, teamBazi.gzDay, scoresConfig);
          const useful = getUsefulElements(dayMasterElement, strength);

          if (useful.favorable.includes(mysticalTrineResult.element)) {
            categoryPoints += scoresConfig.mystical_trine_bonus;
            reasons.push(`[Tríade Mística] Bônus: Formação de tríade benéfica de ${mysticalTrineResult.element} (${tBranch} do time + ${gBranch} do jogo).`);
          } else if (useful.unfavorable.includes(mysticalTrineResult.element) && scoresConfig.mystical_trine_can_be_harmful) {
            categoryPoints -= scoresConfig.mystical_trine_penalty;
            reasons.push(`[Tríade Mística] Penalidade: Formação de tríade maléfica de ${mysticalTrineResult.element} (${tBranch} do time + ${gBranch} do jogo).`);
          }
        } else {
          // Comportamento padrão: sempre dá bônus pela formação da tríade
          categoryPoints += scoresConfig.mystical_trine_bonus;
          reasons.push(`[Tríade Mística] Bônus: Potencial de formação de tríade com ${mysticalTrineResult.thirdAnimal} (elemento ${mysticalTrineResult.element}) a partir de ${tBranch} do time e ${gBranch} do jogo.`);
        }
        
        if (categoryPoints !== 0) {
            const trineScore = calculateCategoryScore(scoresConfig.mystical_trine_weight, categoryPoints, 5);
            totalScore += trineScore || 0;
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
    const excessScore = calculateCategoryScore(scoresConfig.excess_deficiency_weight, categoryPoints, 2);
    totalScore += excessScore;
  }

  // -------------------------------------------------------------
  //  4. Dominância sazonal
  // -------------------------------------------------------------
  if (scoresConfig.use_seasonal_dominance) {
    let categoryPoints = 0;

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
    const seasonalScore = calculateCategoryScore(scoresConfig.seasonal_dominance_weight, categoryPoints, 1);
    totalScore += seasonalScore;
  }

  return { score: totalScore, reasons: reasons || [] };

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
