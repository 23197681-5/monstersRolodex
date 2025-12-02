// Geração e Otimização de Genes (Atributos da Config) ---

import { hardcodedTeams } from '../src/lib/hardcoded-teams.js';
import { getBaziForDate, parseGameDate } from '../src/lib/bazi-calculator.js';
import { analyzeTeamFavorability } from '../src/lib/wuxing.js';

// Define as chaves dos genes contínuos e seus limites [min, max]
const CONTINUOUS_GENES = {
    // Pesos (1.00 a 16.00)
    day_master_strength_weight: [1.0, 16.0],
    branch_interactions_weight: [1.0, 16.0],
    excess_deficiency_weight: [1.0, 16.0],
    seasonal_dominance_weight: [1.0, 16.0],
    qi_sha_penalty_weight: [1.0, 16.0],
    mystical_trine_bonus: [1.0, 16.0],
    mystical_trine_penalty: [1.0, 16.0],
    stem_combination_bonus: [1.0, 16.0],
    stem_combination_penalty: [1.0, 16.0],
    branch_clash_penalty: [1.0, 16.0],
    earth_clash_penalty: [1.0, 16.0],
    earth_punishment_penalty: [1.0, 16.0],
    ten_god_analysis_weight: [1.0, 16.0],
    ten_god_bonus_zheng_guan: [1.0, 16.0],
    ten_god_bonus_zheng_cai: [1.0, 16.0],
    ten_god_bonus_pian_cai: [1.0, 16.0],
    cardinal_combination_bonus: [1.0, 16.0],
    movement_combination_bonus: [1.0, 16.0],
    secret_friendship_bonus: [1.0, 16.0],
    secret_enmity_penalty: [1.0, 16.0],
    punishment_penalty: [1.0, 16.0],
    normalization_offset_general: [1.0, 16.0],
    normalization_offset_fire: [1.0, 16.0],
    normalization_offset_metal: [1.0, 16.0],
    normalization_offset_wood: [1.0, 16.0],
    normalization_offset_water: [1.0, 16.0],
    normalization_offset_earth: [1.0, 16.0],

    // Multiplicadores (0.00 a 2.00)
    favorable_useful_element_multiplier: [0.0, 2.0],
    unfavorable_useful_element_multiplier: [0.0, 2.0],
    dm_strength_seasonal_bonus_multiplier: [1.0, 3.0],
    dm_strength_seasonal_penalty_multiplier: [0.1, 1.0],
    
    // Threshold (1.00 a 26.00)
    prediction_threshold: [1.0, 26.0],

    // Pesos de Pilar (0.00 a 3.00)
    pillar_weight_year: [0.0, 3.0],
    pillar_weight_month: [0.0, 3.0],
    pillar_weight_day: [0.0, 3.0],
    pillar_weight_hour: [0.0, 3.0],

    // Ratios de Força do Mestre do Dia (0.00 a 4.00)
    dm_strength_ratio_extremely_strong: [0.5, 4.0],
    dm_strength_ratio_strong: [0.5, 2.5],
    dm_strength_ratio_extremely_weak: [0.0, 0.5],
    dm_strength_ratio_weak: [0.2, 1.0],
};

// Define as chaves dos genes booleanos
const BOOLEAN_GENES = [
    'use_day_master_strength_analysis',
    'use_branch_interactions',
    'use_excess_deficiency',
    'use_seasonal_dominance',
    'triades_can_be_harmfull',
    'mystical_trine_can_be_harmful',
    'use_qi_sha_penalty',
];

/**
 * Gera um valor aleatório dentro da faixa definida e com duas casas decimais.
 */
const getRandomValue = (min, max) => {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

/**
 * 👶 Cria a população inicial de indivíduos (configs).
 */
export const initializePopulation = (size, defaultScores) => {
    const population = [];
    for (let i = 0; i < size; i++) {
        const individual = { ...defaultScores };

        // Preenche genes contínuos
        for (const [key, [min, max]] of Object.entries(CONTINUOUS_GENES)) {
            individual[key] = getRandomValue(min, max);
        }

        // Preenche genes booleanos
        BOOLEAN_GENES.forEach(key => {
            individual[key] = Math.random() < 0.5;
        });

        population.push(individual);
    }
    return population;
};

let bestResults = [];
const MAX_RESULTS_TO_KEEP = 100; // To manage memory, we'll keep the top 100 results.

/**
 * Clears the stored best results. Should be called before starting a new GA run.
 */
export function clearBestResults() {
    bestResults = [];
}

/**
 * Returns the sorted list of best results found so far.
 */
export function getBestResults() {
    return bestResults;
}

// Placeholder para o cálculo de taxa de sucesso geral. 
// **É FUNDAMENTAL que você substitua esta função pela sua lógica REAL.**
// Tornada async para alinhar com a API do async-genetic.
export function calculateOverallSuccessRate(games, config) {
  let correctPredictions = 0;
  let totalGames = 0;

  return new Promise(resolve => {
    games.forEach(game => {
      const teamA_Bazi = hardcodedTeams.find(t => t.nome === game.timeA);
      const teamB_Bazi = hardcodedTeams.find(t => t.nome === game.timeB);
      const game_Bazi = getBaziForDate(parseGameDate(game.data));

      if (!teamA_Bazi || !teamB_Bazi || !game_Bazi) {
        return;
      }

      const analysisA = analyzeTeamFavorability(teamA_Bazi, game_Bazi, config);
      const analysisB = analyzeTeamFavorability(teamB_Bazi, game_Bazi, config);

      if (!analysisA || !analysisB) {
          return;
      }

      let predictedWinner = 'empate';
      const scoreDiff = Math.abs(analysisA.score - analysisB.score);

      if (scoreDiff > (config.prediction_threshold || 0)) {
          predictedWinner = analysisA.score > analysisB.score ? 'a' : 'b';
      }

      if (predictedWinner === game.resultado) {
        correctPredictions++;
      }
      totalGames++;
    });
    const successRate = totalGames > 0 ? Math.round((correctPredictions / totalGames) * 100) : 0;
    resolve(successRate);
  });
}

/**
 * ⭐ Calcula a aptidão (fitness) de um indivíduo de forma assíncrona.
 * @param {Object} config - A configuração (indivíduo) a ser avaliada.
 * @param {Array} games - O conjunto de dados para validação.
 * @returns {Promise<number>} A taxa de sucesso geral (fitness score).
 */
export async function calculateFitness (config, games) {
    // ATENÇÃO: Esta é a sua função-chave. Deve retornar o score de precisão.
    const successRate = await calculateOverallSuccessRate(games, config);

    // Store the result in our custom array
    bestResults.push({
        fitness: successRate,
        entity: config,
        state: {}, // As requested
    });

    // Sort the array from most successful to worst
    bestResults.sort((a, b) => b.fitness - a.fitness);

    // Keep only the top N results to manage memory usage
    if (bestResults.length > MAX_RESULTS_TO_KEEP) {
        bestResults.splice(MAX_RESULTS_TO_KEEP);
    }

    return successRate;
};

/**
 * 👑 Seleciona os pais para a próxima geração (Seleção por Ranking).
 * @param {Array<Object>} evaluatedPopulation - População com scores de fitness.
 * @param {number} targetSize - O tamanho total da população.
 * @returns {Array<Object>} Um array dos melhores indivíduos (configs).
 */
export const selectParents = (evaluatedPopulation, targetSize) => {
    // Seleção por Ranking: os 50% melhores são selecionados para serem pais
    const topHalfIndex = Math.floor(targetSize * 0.5);
    return evaluatedPopulation.slice(0, topHalfIndex).map(item => item.config);
};

/**
 * 🤝 Executa o cruzamento (crossover) entre dois pais.
 * @param {Object} parent1 - Configuração do primeiro pai.
 * @param {Object} parent2 - Configuração do segundo pai.
 * @returns {Object} O indivíduo (config) filho.
 */
export const crossover = (parent1, parent2) => {
    const child = {};
    const keys = Object.keys(parent1); // Todos os genes

    // Ponto de corte aleatório (single-point crossover)
    const crossoverPoint = Math.floor(Math.random() * keys.length);

    keys.forEach((key, index) => {
        if (index < crossoverPoint) {
            child[key] = parent1[key];
        } else {
            child[key] = parent2[key];
        }
    });

    return child;
};

/**
 * 💥 Introduz mutação em um indivíduo (alteração aleatória de um gene).
 * @param {Object} individual - O indivíduo a ser mutado.
 * @param {number} mutationRate - A probabilidade de um gene sofrer mutação.
 * @returns {Object} O indivíduo (config) mutado.
 */
export const mutate = (individual, mutationRate) => {
    const mutatedIndividual = { ...individual };

    // Mutação para genes contínuos
    for (const [key, [min, max]] of Object.entries(CONTINUOUS_GENES)) {
        if (Math.random() < mutationRate) {
            // Se mutar, o gene recebe um novo valor aleatório (dentro de sua faixa)
            mutatedIndividual[key] = getRandomValue(min, max);
        }
    }

    // Mutação para genes booleanos
    BOOLEAN_GENES.forEach(key => {
        if (Math.random() < mutationRate) {
            // Se mutar, inverte o valor booleano
            mutatedIndividual[key] = !mutatedIndividual[key];
        }
    });

    return mutatedIndividual;
};