import fs from 'fs';
import path from 'path';
import { Genetic, Select } from 'async-genetic';
import { fileURLToPath } from 'url';


import { allGamesSerieA } from '../src/lib/hard-coded-serie-a-games.js';
import { allGamesSerieB } from '../src/lib/hard-coded-serie-b-games.js';
import { serieA, serieB } from '../src/lib/brasileirao-a-b-table.js';
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
import {
    initializePopulation,
    calculateFitness,
    crossover,
    mutate,
    clearBestResults,
    getBestResults
} from './genetic_algorithm_utils.js';
import { DEFAULT_ANALYZE_SCORES } from '../src/lib/wuxing.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// --- Parâmetros do Algoritmo Genético ---
const POPULATION_SIZE = 2000; // Número de configurações em cada geração
const MAX_GENERATIONS = 30;  // Número de gerações para rodar
const MUTATION_RATE = 0.33;  // 25% de chance de um gene sofrer mutação
const CROSSOVER_RATE = 0.7;  // 70% de chance de um par de pais se cruzar

// --- FLAG DE CONTROLE ---
// Defina como `true` para salvar o resultado da simulação mesmo que seja pior que o existente.
const SOBRESCREVER_RESULTADO_PIOR = true; 
// ---

async function main() {
    console.log("Iniciando a geração de estatísticas...");
    const startTime = Date.now();

    const outputPath = path.join(__dirname, '..', 'public', 'statistics.json');
    let existingStats = null;
    if (fs.existsSync(outputPath)) {
        try {
            existingStats = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
            console.log("Arquivo statistics.json existente carregado para comparação.");
        } catch (e) { console.error("Erro ao ler o arquivo statistics.json existente:", e); }
    }

    const gaResult = await runGeneticAlgorithm(allGamesSerieA, DEFAULT_ANALYZE_SCORES);
    const bestScoresFromGA = gaResult.bestConfig;

    const elements = ['FIRE', 'METAL', 'WOOD', 'WATER', 'EARTH'];
    const bestCoherenceResults = {};

    elements.forEach(element => {
        const coherenceFilter = getCoherenceFilterCondition(DEFAULT_COHERENCE_CONFIGS[element]);
        const coherenceResult = calculateCoherenceSuccessRate(allGamesSerieA, bestScoresFromGA, coherenceFilter);
        bestCoherenceResults[element] = { ...coherenceResult, scores: bestScoresFromGA };
 
    });

    console.log("Calculando estatísticas finais com as melhores configurações...");
    const teamsA_Stats = serieA.map(team => ({ ...team, ...getTeamStats(team.name, allGamesSerieA, bestScoresFromGA) }));
    const teamsB_Stats = serieB.map(team => ({ ...team, ...getTeamStats(team.name, allGamesSerieB, bestScoresFromGA) }));
    const teamCoherenceStats = {};
    const allCoherenceStats = {
        FIRE: getFireCoherenceStats(bestCoherenceResults.FIRE.scores),
        METAL: getMetalCoherenceStats(bestCoherenceResults.METAL.scores),
        WOOD: getWoodCoherenceStats(bestCoherenceResults.WOOD.scores),
        WATER: getWaterCoherenceStats(bestCoherenceResults.WATER.scores),
        EARTH: getEarthCoherenceStats(bestCoherenceResults.EARTH.scores),
    };

    for (const coherenceElement in allCoherenceStats) {
        console.log(coherenceElement);
        console.log(allCoherenceStats);
        (allCoherenceStats[coherenceElement] || []).forEach(teamStat => {
            if (!teamCoherenceStats[teamStat.team]) {
                teamCoherenceStats[teamStat.team] = {};
            }
            teamCoherenceStats[teamStat.team][coherenceElement] = { successRate: teamStat.successRate, totalGames: teamStat.totalGames };
        });
    }

    const finalStats = {
        bestScoresByCoherence: {
            GENERAL: { rate: gaResult.maxSuccessRate, totalGames: allGamesSerieA.length, scores: bestScoresFromGA },
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
          monthlyA: calculateMonthlyStatsForGames(allGamesSerieA, bestScoresFromGA),
            monthlyB: calculateMonthlyStatsForGames(allGamesSerieB, bestScoresFromGA),
        },
        fireCoherenceStats: allCoherenceStats.FIRE,
        metalCoherenceStats: allCoherenceStats.METAL,
        woodCoherenceStats: allCoherenceStats.WOOD,
        waterCoherenceStats: allCoherenceStats.WATER,
        earthCoherenceStats: allCoherenceStats.EARTH,
        generatedAt: new Date().toISOString(),
    };

    // --- Lógica de Comparação e Salvamento Condicional ---
    let anyImprovementFound = false;
    const improvementMessages = [];
    let statsToSave;

    if (!existingStats) {
        anyImprovementFound = true;
        statsToSave = finalStats; // Se não há arquivo antigo, o novo é o que será salvo.
        improvementMessages.push("✨ Criado novo arquivo statistics.json com os resultados da simulação.");
    } else {
        statsToSave = JSON.parse(JSON.stringify(existingStats)); // Cria uma cópia profunda para modificar

        // Compara a categoria GERAL
        if (finalStats.bestScoresByCoherence.GENERAL.rate > statsToSave.bestScoresByCoherence.GENERAL.rate) {
            anyImprovementFound = true;
            improvementMessages.push(`✨ Sucesso maior encontrado para a categoria GERAL: ${finalStats.bestScoresByCoherence.GENERAL.rate}%`);
            statsToSave.bestScoresByCoherence.GENERAL = finalStats.bestScoresByCoherence.GENERAL;
            // Atualiza os dados gerais se a categoria GERAL melhorar
            statsToSave.defaultData = finalStats.defaultData;
        }

        // Compara as coerências
        elements.forEach(element => {
            const newCoherence = finalStats.bestScoresByCoherence[element];
            const oldCoherence = statsToSave.bestScoresByCoherence[element];
            if (newCoherence.count > oldCoherence.count || (newCoherence.count === oldCoherence.count && newCoherence.totalGames >= oldCoherence.totalGames)) {
                anyImprovementFound = true;
                improvementMessages.push(`✨ Sucesso maior encontrado para a coerência ${element}: ${newCoherence.rate}% (${newCoherence.count}/${newCoherence.totalGames})`);
                statsToSave.bestScoresByCoherence[element] = newCoherence;
                // Atualiza os dados de coerência específicos se essa coerência melhorar
                statsToSave[`${element.toLowerCase()}CoherenceStats`] = finalStats[`${element.toLowerCase()}CoherenceStats`];
                statsToSave.teamCoherenceStats = finalStats.teamCoherenceStats; // Recalcula tudo para consistência
            }
        });
    }

    if (anyImprovementFound || SOBRESCREVER_RESULTADO_PIOR) {
        if (anyImprovementFound) {
            console.log("\nMelhorias encontradas! Atualizando o arquivo de estatísticas.");
            improvementMessages.forEach(msg => console.log(msg));
        } else {
            console.log("\nNenhuma melhoria encontrada, mas a flag 'SOBRESCREVER_RESULTADO_PIOR' está ativa. Sobrescrevendo...");
        }
        statsToSave.generatedAt = new Date().toISOString(); // Atualiza o timestamp
        fs.writeFileSync(outputPath, JSON.stringify(statsToSave, null, 2));
        console.log(`\nArquivo de estatísticas gerado com sucesso em: ${outputPath}`);
    } else { 
        console.log("\nNenhuma melhoria encontrada. O arquivo statistics.json não foi atualizado.");
    }

    const endTime = Date.now();
    const totalTimeInSeconds = (endTime - startTime) / 1000;
    console.log(`Tempo total de geração: ${totalTimeInSeconds.toFixed(2)} segundos.`);
}

/**
 * 🧬 Executa o Algoritmo Genético para otimizar os pesos do modelo Bazi.
 * Substitui a simulação de Monte Carlo por um processo evolutivo de convergência.
 * * @param {Array} games - O conjunto de dados (jogos) para avaliação.
 * @returns {Object} O melhor indivíduo (config) encontrado e seu score.
 */
export const runGeneticAlgorithm = async (games, DEFAULT_ANALYZE_SCORES) => {
  console.log(`Iniciando Algoritmo Genético com 'async-genetic': População=${POPULATION_SIZE}, Gerações=${MAX_GENERATIONS}`);

  clearBestResults(); // Clear previous run results

  const genetic = new Genetic({
    populationSize: POPULATION_SIZE,
    mutationFunction: (phenotype) => mutate(phenotype, MUTATION_RATE),
    crossoverFunction: (parentA, parentB) => {
      // The library expects an array of two children.
      // We can create two children from one crossover, or run it twice.
      // For simplicity, we'll create two slightly different children.
      const child1 = crossover(parentA, parentB);
      const child2 = crossover(parentB, parentA); // Swap parents for variety
      return [child1, child2];
    },
    fitnessFunction: async (phenotype) => {
      const fitness = await calculateFitness(phenotype, games);
      return { fitness, state: {phenotype}}; // The library expects an object with a 'fitness' key
    },
    // Using the library's built-in selection methods
    select1: Select.Fittest,
    select2: Select.Tournament2,
  });

  const initialPopulation = initializePopulation(POPULATION_SIZE, DEFAULT_ANALYZE_SCORES);
  await genetic.seed(initialPopulation);

  for (let i = 0; i < MAX_GENERATIONS; i++) {
    await genetic.estimate();
    await genetic.breed();
    const bestArray = getBestResults();
    if (bestArray && bestArray.length > 0) {
      const fitness = bestArray[0].fitness || 0;
      console.log(`[Geração ${i + 1}] Melhor Taxa: ${fitness.toFixed(2)}%`);
    }
  }

  const best = getBestResults()[0];

    console.log('Algoritmo Genético concluído.');
    return {
        bestConfig: best.entity,
        maxSuccessRate: best.fitness,
    }
};
main();