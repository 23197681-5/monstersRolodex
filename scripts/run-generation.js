import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


import { allGamesSerieA } from '../src/lib/hard-coded-serie-a-games.js';
import { allGamesSerieB } from '../src/lib/hard-coded-serie-b-games.js';
import { serieA, serieB } from '../src/lib/teams.js';
import {
    getCoherenceFilterCondition,
    DEFAULT_COHERENCE_CONFIGS,
    calculateOverallSuccessRate,
    calculateCoherenceSuccessRate,
    getTeamStats,
    calculateMonthlyStatsForGames,
    getFireCoherenceStats,
    getMetalCoherenceStats,
    getWoodCoherenceStats,
    getWaterCoherenceStats,
    getEarthCoherenceStats
} from './generate-stats.js';
import { DEFAULT_ANALYZE_SCORES } from '../src/lib/wuxing.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
    console.log("Iniciando a geração de estatísticas...");

    const simulationResults = runSimulation(allGamesSerieA);

    const bestOverallResult = simulationResults.length > 0 ? simulationResults.sort((a, b) => b.successRate - a.successRate)[0] : { scores: DEFAULT_ANALYZE_SCORES, successRate: 0, totalGames: allGamesSerieA.length };

    const elements = ['FIRE', 'METAL', 'WOOD', 'WATER', 'EARTH'];
    const bestCoherenceResults = {};

    elements.forEach(element => {
        let bestResult = { count: -1, totalGames: 0, scores: null };
        simulationResults.forEach(res => {
            // Prioritize the highest count of successes. If counts are equal, use totalGames as a tie-breaker.
            if (res[element].count > bestResult.count || (res[element].count === bestResult.count && res[element].total > bestResult.totalGames)) {
                bestResult = {
                    count: res[element].count,
                    totalGames: res[element].total,
                    scores: res[element].scores
                };
            } else if (res[element].count === bestResult.count && res[element].total > bestResult.totalGames) {
                bestResult = {
                    count: res[element].count,
                    totalGames: res[element].total,
                    scores: res[element].scores
                };
            }
        });
        bestCoherenceResults[element] = bestResult;
    });

    console.log("Calculando estatísticas finais com as melhores configurações...");
    const teamsA_Stats = serieA.map(team => ({ ...team, ...getTeamStats(team.name, allGamesSerieA, bestOverallResult.scores) }));
    const teamsB_Stats = serieB.map(team => ({ ...team, ...getTeamStats(team.name, allGamesSerieB, bestOverallResult.scores) }));

    const teamCoherenceStats = {};
    const allCoherenceStats = {
        FIRE: getFireCoherenceStats(bestCoherenceResults.FIRE.scores),
        METAL: getMetalCoherenceStats(bestCoherenceResults.METAL.scores),
        WOOD: getWoodCoherenceStats(bestCoherenceResults.WOOD.scores),
        WATER: getWaterCoherenceStats(bestCoherenceResults.WATER.scores),
        EARTH: getEarthCoherenceStats(bestCoherenceResults.EARTH.scores),
    };

    for (const coherenceElement in allCoherenceStats) {
        allCoherenceStats[coherenceElement].forEach(teamStat => {
            if (!teamCoherenceStats[teamStat.team]) {
                teamCoherenceStats[teamStat.team] = {};
            }
            teamCoherenceStats[teamStat.team][coherenceElement] = { successRate: teamStat.successRate, totalGames: teamStat.totalGames };
        });
    }

    const finalStats = {
        bestScoresByCoherence: {
            GENERAL: { rate: bestOverallResult.successRate, totalGames: bestOverallResult.totalGames, scores: bestOverallResult.scores },
            FIRE: bestCoherenceResults.FIRE,
            METAL: bestCoherenceResults.METAL,
            WOOD: bestCoherenceResults.WOOD,
            WATER: bestCoherenceResults.WATER,
            EARTH: bestCoherenceResults.EARTH,
        },
        teamCoherenceStats: teamCoherenceStats,
        defaultData: {
            teamsA: teamsA_Stats,
            teamsB: teamsB_Stats,
            monthlyA: calculateMonthlyStatsForGames(allGamesSerieA, bestOverallResult.scores),
            monthlyB: calculateMonthlyStatsForGames(allGamesSerieB, bestOverallResult.scores),
        },
        fireCoherenceStats: allCoherenceStats.FIRE,
        metalCoherenceStats: allCoherenceStats.METAL,
        woodCoherenceStats: allCoherenceStats.WOOD,
        waterCoherenceStats: allCoherenceStats.WATER,
        earthCoherenceStats: allCoherenceStats.EARTH,
        generatedAt: new Date().toISOString(),
    };

    const outputPath = path.join(__dirname, '..', 'public', 'statistics.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalStats, null, 2));

    console.log(`Arquivo de estatísticas gerado com sucesso em: ${outputPath}`);
}

export const runSimulation = (games) => {
    const NUM_ITERATIONS = 10000;
    console.log(`Iniciando simulação de ${NUM_ITERATIONS} scores para 5 Coerências...`);
    const results = [];

    // Obter as 5 funções de filtro
    const coherenceFilters = {
        FIRE: getCoherenceFilterCondition(DEFAULT_COHERENCE_CONFIGS.FIRE),
        METAL: getCoherenceFilterCondition(DEFAULT_COHERENCE_CONFIGS.METAL),
        WOOD: getCoherenceFilterCondition(DEFAULT_COHERENCE_CONFIGS.WOOD),
        WATER: getCoherenceFilterCondition(DEFAULT_COHERENCE_CONFIGS.WATER),
        EARTH: getCoherenceFilterCondition(DEFAULT_COHERENCE_CONFIGS.EARTH),
    };

    for (let i = 1; i <= NUM_ITERATIONS; i++) {
        // --- Geração de Scores Customizados ---
        const weights = Array.from({ length: 5 }, () => Math.random());
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        const normalizedWeights = weights.map(w => (w / totalWeight) * 100);

        const customScores = {
            ...DEFAULT_ANALYZE_SCORES,
            day_master_strength_weight: parseFloat(normalizedWeights[0].toFixed(2)),
            branch_interactions_weight: parseFloat(normalizedWeights[1].toFixed(2)),
            excess_deficiency_weight: parseFloat(normalizedWeights[2].toFixed(2)),
            seasonal_dominance_weight: parseFloat(normalizedWeights[3].toFixed(2)),
            qi_sha_penalty_weight: parseFloat(normalizedWeights[4].toFixed(2)),
            use_day_master_strength_analysis: Math.random() < 0.5,
            use_branch_interactions: Math.random() < 0.5,
            use_excess_deficiency: Math.random() < 0.5,
            use_seasonal_dominance: Math.random() < 0.5,
            favorable_useful_element_multiplier: parseFloat((Math.random() * 1.5 + 0.5).toFixed(2)),
            unfavorable_useful_element_multiplier: parseFloat((Math.random() * 1.5 + 0.5).toFixed(2)),
            triades_can_be_harmfull: Math.random() < 0.5,
            mystical_trine_bonus: parseFloat((Math.random() * 3 + 1).toFixed(2)),
            mystical_trine_penalty: parseFloat((Math.random() * 3 + 1).toFixed(2)),
            prediction_threshold: parseFloat((Math.random() * 70 + 10).toFixed(2)),
        };
        // -------------------------------------

        // --- Cálculo de Acerto Geral ---
        const successRate = calculateOverallSuccessRate(games, customScores);

        // --- Cálculo de Acerto das 5 Coerências ---
        const fireStats = calculateCoherenceSuccessRate(games, customScores, coherenceFilters.FIRE);
        const metalStats = calculateCoherenceSuccessRate(games, customScores, coherenceFilters.METAL);
        const woodStats = calculateCoherenceSuccessRate(games, customScores, coherenceFilters.WOOD);
        const waterStats = calculateCoherenceSuccessRate(games, customScores, coherenceFilters.WATER);
        const earthStats = calculateCoherenceSuccessRate(games, customScores, coherenceFilters.EARTH);

        // --- Armazenamento de Resultados ---
        results.push({
            iteration: i,
            successRate: successRate,
            scores: customScores, // Salva a configuração de scores para o resultado geral
            totalGames: games.length,
            FIRE: { rate: fireStats.rate, total: fireStats.total, scores: customScores },
            METAL: { rate: metalStats.rate, total: metalStats.total, scores: customScores },
            WOOD: { rate: woodStats.rate, total: woodStats.total, scores: customScores },
            WATER: { rate: waterStats.rate, total: waterStats.total, scores: customScores },
            EARTH: { rate: earthStats.rate, total: earthStats.total, scores: customScores },
        });
    }
    
    console.log('Simulação concluída.');
    return results;
};
main();