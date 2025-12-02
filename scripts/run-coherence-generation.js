import fs from 'fs';
import path from 'path';
import { Genetic, Select } from 'async-genetic';
import { fileURLToPath } from 'url';

import { allGamesSerieA } from '../src/lib/hard-coded-serie-a-games.js';
import { getBaziForDate, parseGameDate } from '../src/lib/bazi-calculator.js';
import {
    getCoherenceFilterCondition,
    DEFAULT_COHERENCE_CONFIGS,
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
const POPULATION_SIZE = 4000;
const MAX_GENERATIONS = 30;
const MUTATION_RATE = 0.3;
const CROSSOVER_RATE = 0.7;

async function main() {
    console.log("Iniciando otimização de scores para CADA COERÊNCIA...");
    const startTime = Date.now();

    const outputPath = path.join(__dirname, '..', 'public', 'statistics.json');
    let statsToSave = null;

    if (fs.existsSync(outputPath)) {
        try {
            statsToSave = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
            console.log("Arquivo statistics.json existente carregado para atualização.");
        } catch (e) {
            console.error("Erro ao ler o arquivo statistics.json. Abortando.", e);
            return;
        }
    } else {
        console.error("Arquivo statistics.json não encontrado. Execute o script de geração geral primeiro.");
        return;
    }

    const elements = ['FIRE', 'METAL', 'WOOD', 'WATER', 'EARTH'];
    let anyImprovementFound = false;

    for (const element of elements) {
        console.log(`\n--- Otimizando para Coerência: ${element} ---`);

        const coherenceFilter = getCoherenceFilterCondition(DEFAULT_COHERENCE_CONFIGS[element]);
        const coherenceGames = allGamesSerieA.filter(game => {
            const gameBazi = getBaziForDate(parseGameDate(game.data));
            return gameBazi && coherenceFilter(gameBazi);
        });

        if (coherenceGames.length === 0) {
            console.log(`Nenhum jogo encontrado para a coerência ${element}. Pulando.`);
            continue;
        }

        console.log(`Encontrados ${coherenceGames.length} jogos para a coerência ${element}.`);

        const gaResult = await runGeneticAlgorithmForCoherence(coherenceGames, DEFAULT_ANALYZE_SCORES, element);

        const oldCoherence = statsToSave.bestScoresByCoherence[element];
        const newRate = gaResult.maxSuccessRate;

        if (newRate > (oldCoherence?.rate || 0)) {
            anyImprovementFound = true;
            console.log(`✨ MELHORIA PARA ${element}: ${oldCoherence?.rate || 0}% -> ${newRate}%`);
            
            // Atualiza apenas os scores para esta coerência específica
            statsToSave.bestScoresByCoherence[element] = {
                ...(statsToSave.bestScoresByCoherence[element] || {}), // Mantém dados como 'count', 'totalGames'
                rate: newRate,
                scores: gaResult.bestConfig,
            };
        } else {
            console.log(`Nenhuma melhoria para ${element}. Mantendo taxa de ${oldCoherence?.rate || 0}%.`);
        }
    }

    if (anyImprovementFound) {
        console.log("\nMelhorias encontradas! Atualizando o arquivo de estatísticas...");
        statsToSave.generatedAt = new Date().toISOString();
        fs.writeFileSync(outputPath, JSON.stringify(statsToSave, null, 2));
        console.log(`Arquivo de estatísticas atualizado com sucesso em: ${outputPath}`);
    } else {
        console.log("\nNenhuma melhoria encontrada em nenhuma coerência. O arquivo statistics.json não foi atualizado.");
    }

    const endTime = Date.now();
    const totalTimeInSeconds = (endTime - startTime) / 1000;
    console.log(`Tempo total de otimização: ${totalTimeInSeconds.toFixed(2)} segundos.`);
}

export const runGeneticAlgorithmForCoherence = async (games, defaultScores, coherenceName) => {
  console.log(`Executando GA para ${coherenceName}...`);

  clearBestResults();

  const genetic = new Genetic({
    populationSize: POPULATION_SIZE,
    mutationFunction: (phenotype) => mutate(phenotype, MUTATION_RATE),
    crossoverFunction: (parentA, parentB) => {
      const child1 = crossover(parentA, parentB);
      const child2 = crossover(parentB, parentA);
      return [child1, child2];
    },
    fitnessFunction: async (phenotype) => {
      const fitness = await calculateFitness(phenotype, games);
      return { fitness };
    },
    select1: Select.Fittest,
    select2: Select.Tournament2,
  });

  const initialPopulation = initializePopulation(POPULATION_SIZE, defaultScores);
  await genetic.seed(initialPopulation);

  for (let i = 0; i < MAX_GENERATIONS; i++) {
    await genetic.estimate();
    await genetic.breed();
    const bestArray = getBestResults();
    if (i % 5 === 0 && bestArray && bestArray.length > 0) { // Log a cada 5 gerações
      const fitness = bestArray[0].fitness || 0;
      console.log(`[${coherenceName} - Geração ${i + 1}] Melhor Taxa: ${fitness.toFixed(2)}%`);
    }
  }

  const best = getBestResults()[0];

  console.log(`Algoritmo Genético para ${coherenceName} concluído.`);
  return {
    bestConfig: best.entity,
    maxSuccessRate: best.fitness,
  };
};

main();