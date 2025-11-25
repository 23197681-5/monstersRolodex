
import { allGamesSerieA } from '../src/lib/hard-coded-serie-a-games.js';
import { allGamesSerieB } from '../src/lib/hard-coded-serie-b-games.js';
import { hardcodedTeams} from '../src/lib/hardcoded-teams.js';
import { serieA, serieB } from '../src/lib/teams.js';
import { getBaziForDate, parseGameDate } from '../src/lib/bazi-calculator.js';
import { DEFAULT_ANALYZE_SCORES, analyzeTeamFavorability, getGanzhiElement } from '../src/lib/wuxing.js'
// ----------------------------------------------------------------------
// --- 1. CONFIGURAÇÕES E FUNÇÕES AUXILIARES DE COERÊNCIA (WUXING) ---
// ----------------------------------------------------------------------


const branchToAnimal = (b) => {
    const map = {
      '寅': 'Tigre', '卯': 'Coelho', '辰': 'Dragão', '巳': 'Serpente', '午': 'Cavalo', '未': 'Cabra',
      '申': 'Macaco', '酉': 'Galo', '戌': 'Cão', '亥': 'Porco', '子': 'Rato', '丑': 'Boi',
    };
    return map[b] || '';
};

const getMonthAnimalName = (gameData) => {
    const gameDate = parseGameDate(gameData);
    const gameBazi = getBaziForDate(gameDate);
    if (!gameBazi || !gameBazi.gzMonth) return null;
    const monthBranch = gameBazi.gzMonth.charAt(1);
    return `Mês do ${branchToAnimal(monthBranch)}`;
};

const orderedBranches = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
const allLunarMonths = orderedBranches.map(branch => `Mês do ${branchToAnimal(branch)}`);
const monthToIndexMap = allLunarMonths.reduce((acc, month, index) => ({ ...acc, [month]: index }), {});
const MAX_COLUMNS = allLunarMonths.length;


// --- Configurações Padrão de Coerência para as 5 Fases ---

const TRINE_ANIMALS = {
    FIRE: ["寅", "午", "戌"], // Tigre, Cavalo, Cão
    METAL: ["巳", "酉", "丑"], // Serpente, Galo, Boi
    WOOD: ["亥", "卯", "未"], // Porco, Coelho, Cabra
    WATER: ["申", "子", "辰"], // Macaco, Rato, Dragão
    EARTH: ["辰", "戌", "丑", "未"], // Dragão, Cão, Boi, Cabra
};

const ELEMENT_FILTERS = {
    FIRE: ['fire', 'wood', 'earth'],
    METAL: ['metal', 'water'],
    WOOD: ['wood', 'water', 'fire'],
    WATER: ['water', 'metal', 'wood'],
    EARTH: ['earth', 'fire', 'metal'],
};

export const DEFAULT_COHERENCE_CONFIGS = {
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

// --- Funções de Condição de Filtro (Unificadas) ---

export const getCoherenceFilterCondition = (config) => (gameBazi) => {
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


// ----------------------------------------------------------------------
// --- 2. FUNÇÕES DE CÁLCULO E SIMULAÇÃO (CORE) ---
// ----------------------------------------------------------------------

export const calculateOverallSuccessRate = (games, customScores) => {
  let successCount = 0; 
  let totalGames = 0;

  games.forEach(game => {
    const teamA_Bazi = hardcodedTeams.find(t => t.nome === game.timeA);
    const teamB_Bazi = hardcodedTeams.find(t => t.nome === game.timeB);
    const game_Bazi = getBaziForDate(parseGameDate(game.data));

    if (!teamA_Bazi || !teamB_Bazi || !game_Bazi) return;

    const analysisA = analyzeTeamFavorability(teamA_Bazi, game_Bazi, customScores);
    const analysisB = analyzeTeamFavorability(teamB_Bazi, game_Bazi, customScores);

    let predictedWinner = 'empate';
    if (analysisA.score > analysisB.score) predictedWinner = 'a';
    if (analysisB.score > analysisA.score) predictedWinner = 'b';

    if (predictedWinner === game.resultado) {
      successCount++;
    }
    totalGames++;
  });

  return totalGames > 0 ? Math.round((successCount / totalGames) * 100) : 0;
};

export const calculateCoherenceSuccessRate = (games, customScores, filterCondition) => {
    let successCount = 0;
    let totalGames = 0;

    games.forEach(game => {
        const gameDate = parseGameDate(game.data);
        const game_Bazi = getBaziForDate(gameDate);

        if (!game_Bazi) return;

        // 1. Aplicar a Condição de Coerência
        if (!filterCondition(game_Bazi)) {
            return; // Ignora jogos que não se enquadram na coerência
        }

        // 2. Análise e Predição (somente para jogos filtrados)
        const teamA_Bazi = hardcodedTeams.find(t => t.nome === game.timeA);
        const teamB_Bazi = hardcodedTeams.find(t => t.nome === game.timeB);

        if (!teamA_Bazi || !teamB_Bazi) return;

        const analysisA = analyzeTeamFavorability(teamA_Bazi, game_Bazi, customScores);
        const analysisB = analyzeTeamFavorability(teamB_Bazi, game_Bazi, 
);

        let predictedWinner = 'empate';
        if (analysisA.score > analysisB.score) predictedWinner = 'a';
        if (analysisB.score > analysisA.score) predictedWinner = 'b';

        console.log(customScores);
        console.log(`[Coherence Check] Game: ${game.timeA} vs ${game.timeB} | Scores: A=${analysisA.score}, B=${analysisB.score} | Predicted: ${predictedWinner}, Real: ${game.resultado}`);

        if (predictedWinner === game.resultado) {
            successCount++;
        }
        totalGames++;
    });

    return {
        rate: totalGames > 0 ? Math.round((successCount / totalGames) * 100) : 0,
        count: successCount,
        total: totalGames
    };
};


// ----------------------------------------------------------------------
// --- 3. FUNÇÕES DE ESTATÍSTICAS DETALHADAS ---
// ----------------------------------------------------------------------

export const getTeamStats = (teamName, games, customScores) => {
  const history = Array.from({ length: MAX_COLUMNS }, () => []);
  let successCount = 0;
  let errorCount = 0;

  games.forEach(game => {
    if (game.timeA === teamName || game.timeB === teamName) {
      const teamA_Bazi = hardcodedTeams.find(t => t.nome === game.timeA);
      const teamB_Bazi = hardcodedTeams.find(t => t.nome === game.timeB);
      const gameDate = parseGameDate(game.data);
      const game_Bazi = getBaziForDate(gameDate);
      const monthName = getMonthAnimalName(game.data);
      const columnIndex = monthToIndexMap[monthName];

      if (!teamA_Bazi || !teamB_Bazi || !game_Bazi || columnIndex === undefined) return;

      const analysisA = analyzeTeamFavorability(teamA_Bazi, game_Bazi, customScores);
      const analysisB = analyzeTeamFavorability(teamB_Bazi, game_Bazi, customScores);

      let predictedWinner = 'empate';
      if (analysisA.score > analysisB.score) predictedWinner = 'a';
      if (analysisB.score > analysisA.score) predictedWinner = 'b';

      const gameResult = {
        result: predictedWinner === game.resultado ? 'C' : 'X',
        date: game.data, teamA: game.timeA, teamB: game.timeB,
        placar: game.placar, resultadoReal: game.resultado, resultadoPredito: predictedWinner,
        scoreA: analysisA, scoreB: analysisB
      };

      history[columnIndex].push(gameResult);
      if (gameResult.result === 'C') successCount++;
      else errorCount++;
    }
  });

  const totalGames = successCount + errorCount;
  const successRate = totalGames > 0 ? Math.round((successCount / totalGames) * 100) : 0;
  const errorRate = totalGames > 0 ? 100 - successRate : 0;

  return { successRate, errorRate, history, successCount, errorCount };
};

export const calculateMonthlyStatsForGames = (games, customScores) => {
    const monthlyStatsResult = allLunarMonths.reduce((acc, monthName) => ({ ...acc, [monthName]: { successes: 0, total: 0 } }), {});
    games.forEach(game => {
        const monthName = getMonthAnimalName(game.data);
        if (!monthName) return;

        const teamA_Bazi = hardcodedTeams.find(t => t.nome === game.timeA);
        const teamB_Bazi = hardcodedTeams.find(t => t.nome === game.timeB);
        const game_Bazi = getBaziForDate(parseGameDate(game.data));

        if (!teamA_Bazi || !teamB_Bazi || !game_Bazi) return;

        const analysisA = analyzeTeamFavorability(teamA_Bazi, game_Bazi, customScores);
        const analysisB = analyzeTeamFavorability(teamB_Bazi, game_Bazi, customScores);

        let predictedWinner = 'empate';
        if (analysisA.score > analysisB.score) predictedWinner = 'a';
        if (analysisB.score > analysisA.score) predictedWinner = 'b';

        if (predictedWinner === game.resultado) {
            monthlyStatsResult[monthName].successes++;
        }
        monthlyStatsResult[monthName].total++;
    });
    return monthlyStatsResult;
};

export const getCoherenceStats = (games, teams, filterCondition, customScores) => {
    const filteredGames = games.filter(game => {
        const gameBazi = getBaziForDate(parseGameDate(game.data));
        return gameBazi && filterCondition(gameBazi);
    });

    const teamStats = teams.map(team => {
        let successCount = 0;
        let totalGames = 0;
        const teamGames = [];

        const relevantGames = filteredGames.filter(g => g.timeA === team.name || g.timeB === team.name);

        relevantGames.forEach(game => {
            const teamA_Bazi = hardcodedTeams.find(t => t.nome === game.timeA);
            const teamB_Bazi = hardcodedTeams.find(t => t.nome === game.timeB);
            if (!teamA_Bazi || !teamB_Bazi) return;
            const gameBazi = getBaziForDate(parseGameDate(game.data));
            if (!gameBazi) return;

            const analysisA = analyzeTeamFavorability(teamA_Bazi, gameBazi, customScores);
            const analysisB = analyzeTeamFavorability(teamB_Bazi, gameBazi, customScores);

            let predictedWinner = 'empate';
            if (analysisA.score > analysisB.score) predictedWinner = 'a';
            if (analysisB.score > analysisA.score) predictedWinner = 'b';

            const isSuccess = predictedWinner === game.resultado;
            if (isSuccess) successCount++;
            totalGames++;

            teamGames.push({
                result: isSuccess ? 'C' : 'X', date: game.data, teamA: game.timeA, teamB: game.timeB,
                placar: game.placar, resultadoReal: game.resultado, resultadoPredito: predictedWinner,
                scoreA: analysisA, scoreB: analysisB,
            });
        });

        return {
            team: team.name, logo: team.logo,
            successRate: totalGames > 0 ? Math.round((successCount / totalGames) * 100) : 0,
            totalGames: totalGames, games: teamGames,
        };
    });

    return teamStats.filter(t => t.totalGames > 0).sort((a, b) => b.successRate - a.successRate);
};

// --- Funções Específicas para Coerência (usando a função de filtro unificada) ---

export const getFireCoherenceStats = (scores) => {
    const config = DEFAULT_COHERENCE_CONFIGS.FIRE;
    const filterCondition = getCoherenceFilterCondition(config);
    return getCoherenceStats(allGamesSerieA, serieA, filterCondition, scores);
};

export const getMetalCoherenceStats = (scores) => {
    const config = DEFAULT_COHERENCE_CONFIGS.METAL;
    const filterCondition = getCoherenceFilterCondition(config);
    return getCoherenceStats(allGamesSerieA, serieA, filterCondition, scores);
};


export const getWoodCoherenceStats = (scores) => {
    const config = DEFAULT_COHERENCE_CONFIGS.WOOD;
    const filterCondition = getCoherenceFilterCondition(config);
    return getCoherenceStats(allGamesSerieA, serieA, filterCondition, scores);
};

export const getWaterCoherenceStats = (scores) => {
    const config = DEFAULT_COHERENCE_CONFIGS.WATER;
    const filterCondition = getCoherenceFilterCondition(config);
    return getCoherenceStats(allGamesSerieA, serieA, filterCondition, scores);
};

export const getEarthCoherenceStats = (scores) => {
    const config = DEFAULT_COHERENCE_CONFIGS.EARTH;
    const filterCondition = getCoherenceFilterCondition(config);
    return getCoherenceStats(allGamesSerieA, serieA, filterCondition, scores);
};


// ----------------------------------------------------------------------
// --- 4. SCRIPT PRINCIPAL ---
// ----------------------------------------------------------------------



export function generateWuxingDefaultStatistics() {
    console.log("Iniciando a geração de estatísticas com a configuração padrão...");

    // 1. Definir a configuração de scores a ser usada:
    // Não faremos a simulação (runSimulation); usaremos a configuração padrão.
    const standardScores = DEFAULT_ANALYZE_SCORES;
    
    // 2. Definir as configurações de coerência e filtros
    const coherenceFilters = {
        FIRE: getCoherenceFilterCondition(DEFAULT_COHERENCE_CONFIGS.FIRE),
        METAL: getCoherenceFilterCondition(DEFAULT_COHERENCE_CONFIGS.METAL),
        WOOD: getCoherenceFilterCondition(DEFAULT_COHERENCE_CONFIGS.WOOD),
        WATER: getCoherenceFilterCondition(DEFAULT_COHERENCE_CONFIGS.WATER),
        EARTH: getCoherenceFilterCondition(DEFAULT_COHERENCE_CONFIGS.EARTH),
    };

    // 3. Calcular as taxas de acerto por coerência (para fins de resumo)
    const fireStats = calculateCoherenceSuccessRate(allGamesSerieA, standardScores, coherenceFilters.FIRE);
    const metalStats = calculateCoherenceSuccessRate(allGamesSerieA, standardScores, coherenceFilters.METAL);
    const woodStats = calculateCoherenceSuccessRate(allGamesSerieA, standardScores, coherenceFilters.WOOD);
    const waterStats = calculateCoherenceSuccessRate(allGamesSerieA, standardScores, coherenceFilters.WATER);
    const earthStats = calculateCoherenceSuccessRate(allGamesSerieA, standardScores, coherenceFilters.EARTH);
    
    const overallRate = calculateOverallSuccessRate(allGamesSerieA, standardScores);


    // 4. Calcular estatísticas detalhadas para as equipes e mensais usando standardScores
    console.log("Calculando estatísticas finais com a configuração padrão...");
    const teamsA_Stats = serieA.map(team => ({ 
        ...team, 
        ...getTeamStats(team.name, allGamesSerieA, standardScores) 
    }));
    const teamsB_Stats = serieB.map(team => ({ 
        ...team, 
        ...getTeamStats(team.name, allGamesSerieB, standardScores) 
    }));

    // Agrega as estatísticas de coerência por time
    const teamCoherenceStats = {};
    const allCoherenceStats = {
        FIRE: getFireCoherenceStats(standardScores),
        METAL: getMetalCoherenceStats(standardScores),
        WOOD: getWoodCoherenceStats(standardScores),
        WATER: getWaterCoherenceStats(standardScores),
        EARTH: getEarthCoherenceStats(standardScores),
    };

    for (const coherenceElement in allCoherenceStats) {
        allCoherenceStats[coherenceElement].forEach(teamStat => {
            if (!teamCoherenceStats[teamStat.team]) {
                teamCoherenceStats[teamStat.team] = {};
            }
            teamCoherenceStats[teamStat.team][coherenceElement] = { successRate: teamStat.successRate, totalGames: teamStat.totalGames };
        });
    }

    // 5. Estruturar o objeto de retorno
    const statsResult = {
        // Agora, isso é apenas um resumo de UMA iteração (o padrão)
        simulationResultsSummary: [{ 
            iteration: 1, 
            overallRate: overallRate, 
            fireRate: fireStats.rate, 
            metalRate: metalStats.rate,
            woodRate: woodStats.rate,
            waterRate: waterStats.rate,
            earthRate: earthStats.rate,
        }], 
        
        bestScoresByCoherence: {
            // Usamos as taxas calculadas acima. Os scores são sempre os padrão.
            FIRE: { rate: fireStats.rate, total: fireStats.total, scores: standardScores },
            METAL: { rate: metalStats.rate, total: metalStats.total, scores: standardScores },
            WOOD: { rate: woodStats.rate, total: woodStats.total, scores: standardScores },
            WATER: { rate: waterStats.rate, total: waterStats.total, scores: standardScores },
            EARTH: { rate: earthStats.rate, total: earthStats.total, scores: standardScores },
        },
        
        teamCoherenceStats: teamCoherenceStats,
        defaultData: {
            teamsA: teamsA_Stats,
            teamsB: teamsB_Stats,
            monthlyA: calculateMonthlyStatsForGames(allGamesSerieA, standardScores),
            monthlyB: calculateMonthlyStatsForGames(allGamesSerieB, standardScores),
        },
        
        // Estatísticas detalhadas de coerência usando a CONFIG PADRÃO
        fireCoherenceStats: allCoherenceStats.FIRE,
        metalCoherenceStats: allCoherenceStats.METAL,
        woodCoherenceStats: allCoherenceStats.WOOD,
        waterCoherenceStats: allCoherenceStats.WATER,
        earthCoherenceStats: allCoherenceStats.EARTH,

        generatedAt: new Date().toISOString(),
    };

    console.log("Geração de estatísticas concluída. Retornando objeto.");
    
    return statsResult;
}