import React, { useState } from 'react';
import Image from 'next/image';
import styles from './statistics.module.css';
import { serieA, serieB } from '../src/lib/teams';
import { allGames, jogosRodada20Detalhados } from '../src/lib/hadcoded-games';
import { hardcodedTeams } from '../src/lib/hardcoded-teams'; 
import { analyzeTeamFavorability } from '../src/lib/wuxing';
import { DEFAULT_ANALYZE_SCORES } from '../src/lib/wuxing'; // Importar DEFAULT_ANALYZE_SCORES aqui
import { getBaziForDate, parseGameDate } from '../src/lib/bazi-calculator';

const branchToAnimal = (b) => {
  const map = {
    '寅': 'Tigre', '卯': 'Coelho',
    '辰': 'Dragão', '巳': 'Serpente', '午': 'Cavalo', '未': 'Cabra',
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

// Define a ordem fixa dos meses lunares
const orderedBranches = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
const allLunarMonths = orderedBranches.map(branch => `Mês do ${branchToAnimal(branch)}`);

const monthToIndexMap = allLunarMonths.reduce((acc, month, index) => ({ ...acc, [month]: index }), {});
const MAX_COLUMNS = allLunarMonths.length;

// Mapeamento das Tríades Elementares
const TRINE_ELEMENTS = {
  Fogo: ["寅", "午", "戌"],
  Madeira: ["亥", "卯", "未"],
  Água: ["申", "子", "辰"],
  Metal: ["巳", "酉", "丑"],
};

const getTrineForBranch = (branch) => {
  for (const element in TRINE_ELEMENTS) {
    if (TRINE_ELEMENTS[element].includes(branch)) {
      return element;
    }
  }
  return null;
};

// Determina a Tríade do Mês Atual
const currentMonthBazi = getBaziForDate(new Date());
const currentMonthBranch = currentMonthBazi ? currentMonthBazi.gzMonth.charAt(1) : null;
const currentMonthTrine = currentMonthBranch ? getTrineForBranch(currentMonthBranch) : null;
console.log(`Mês Atual: ${branchToAnimal(currentMonthBranch)} (${currentMonthBranch}), Tríade: ${currentMonthTrine}`);


const calculateMonthlyStats = (games, customScores) => {
  const monthlyStatsResult = allLunarMonths.reduce((acc, monthName) => {
  acc[monthName] = { successes: 0, total: 0 };
  return acc;
}, {});
  games.forEach(game => {
  const monthName = getMonthAnimalName(game.data);
  if (!monthName) return;

  const teamA_Bazi = hardcodedTeams.find(t => t.nome === game.timeA);
  const teamB_Bazi = hardcodedTeams.find(t => t.nome === game.timeB);
  const gameDate = parseGameDate(game.data);
  const game_Bazi = getBaziForDate(gameDate);

    if (!teamA_Bazi || !teamB_Bazi || !game_Bazi) return;

    const analysisA = analyzeTeamFavorability(teamA_Bazi, game_Bazi);
    const analysisB = analyzeTeamFavorability(teamB_Bazi, game_Bazi);
 console.log(analysisA, analysisB)
      let predictedWinner = 'empate';
     
  if (analysisA.score > analysisB.score + 25) predictedWinner = 'a';
  if (analysisB.score > analysisA.score + 25) predictedWinner = 'b';

  if (predictedWinner === game.resultado) {
      monthlyStatsResult[monthName].successes++;
  }
    monthlyStatsResult[monthName].total++;
});
  return monthlyStatsResult;
};


const getTeamStats = (teamName, customScores = DEFAULT_ANALYZE_SCORES) => {
  // Inicializa o histórico como um array de arrays vazios para armazenar múltiplos jogos por mês.
  const history = Array.from({ length: MAX_COLUMNS }, () => []);

  let successCount = 0;
  let errorCount = 0;

  allGames.forEach(game => {
    if (game.timeA === teamName || game.timeB === teamName) {

      // Obter dados Bazi dos times
      const teamA_Bazi = hardcodedTeams.find(t => t.nome === game.timeA);
      const teamB_Bazi = hardcodedTeams.find(t => t.nome === game.timeB);
      console.log('teamA_Bazi', teamA_Bazi);
      console.log('teamB_Bazi', teamB_Bazi);

      // Obter Bazi da data do jogo
      const gameDate = parseGameDate(game.data);
      const game_Bazi = getBaziForDate(gameDate);
      console.log('game_Bazi', game_Bazi);

      const monthName = getMonthAnimalName(game.data);
      const columnIndex = monthToIndexMap[monthName];

      if (!teamA_Bazi || !teamB_Bazi || !game_Bazi || columnIndex === undefined) {
        // Se não encontrar dados ou o mês, não preenche
        return;
      }

      // Analisar favoritismo
      const analysisA = analyzeTeamFavorability(teamA_Bazi, game_Bazi, customScores);
      const analysisB = analyzeTeamFavorability(teamB_Bazi, game_Bazi, customScores);
 console.log(analysisA, analysisB)
      let predictedWinner = 'empate';
     
      if (analysisA.score > analysisB.score - 20) predictedWinner = 'a';
      if (analysisB.score > analysisA.score) predictedWinner = 'b';

      // Comparar com resultado real (usando os scores padrão para esta função)
      if (predictedWinner === game.resultado) { // This function should also accept customScores
        history[columnIndex].push({
          result: 'C', date: game.data, teamA: game.timeA, teamB: game.timeB,
          placar: game.placar, resultadoReal: game.resultado, resultadoPredito: predictedWinner,
          scoreA: analysisA.score, scoreB: analysisB.score
        });
        successCount++;
      } else {
        history[columnIndex].push({
          result: 'X', date: game.data, teamA: game.timeA, teamB: game.timeB,
          placar: game.placar, resultadoReal: game.resultado, resultadoPredito: predictedWinner,
          scoreA: analysisA.score, scoreB: analysisB.score
        });
        errorCount++;
      }
    }
  });

  const totalGames = successCount + errorCount;
  const successRate = totalGames > 0 ? Math.round((successCount / totalGames) * 100) : 0;
  const errorRate = totalGames > 0 ? 100 - successRate : 0;

  return { successRate, errorRate, history, successCount, errorCount };
};

const getTrineStatsForTeam = (teamName, customScores = DEFAULT_ANALYZE_SCORES) => {
  const trineStats = {
    Fogo: { successes: 0, total: 0 },
    Madeira: { successes: 0, total: 0 },
    Água: { successes: 0, total: 0 },
    Metal: { successes: 0, total: 0 },
  };

  allGames.forEach(game => {
    if (game.timeA === teamName || game.timeB === teamName) {
      const gameDate = parseGameDate(game.data);
      const gameBazi = getBaziForDate(gameDate);
      if (!gameBazi || !gameBazi.gzMonth) return;

      const monthBranch = gameBazi.gzMonth.charAt(1);
      const trine = getTrineForBranch(monthBranch);
      if (!trine) return;

      const teamA_Bazi = hardcodedTeams.find(t => t.nome === game.timeA);
      const teamB_Bazi = hardcodedTeams.find(t => t.nome === game.timeB);

      if (!teamA_Bazi || !teamB_Bazi || !gameBazi) return;

      const analysisA = analyzeTeamFavorability(teamA_Bazi, gameBazi, customScores);
      const analysisB = analyzeTeamFavorability(teamB_Bazi, gameBazi, customScores);
      console.log(analysisA, analysisB)
      let predictedWinner = 'empate';
      if (analysisA.score > analysisB.score +50) predictedWinner = 'a';
      if (analysisB.score > analysisA.score +50) predictedWinner = 'b';

      if (predictedWinner === game.resultado) {
        trineStats[trine].successes++;
      }
      trineStats[trine].total++;
    }
  });

  // Calcula as porcentagens
  const result = {};
  for (const trine in trineStats) {
    const { successes, total } = trineStats[trine];
    result[trine] = {
      successRate: total > 0 ? Math.round((successes / total) * 100) : 0,
      totalGames: total,
    };
  }
  return result;
};

const getGanzhiElement = (ganzhi) => {
  if (!ganzhi) return null;
  const stem = ganzhi.charAt(0);
  const stemMap = { '甲': 'wood', '乙': 'wood', '丙': 'fire', '丁': 'fire', '戊': 'earth', '己': 'earth', '庚': 'metal', '辛': 'metal', '壬': 'water', '癸': 'water' };
  return stemMap[stem] || null;
};

const getCoherenceStats = (games, teams, filterCondition, coherenceElement) => {
  const filteredGames = games.filter(game => {
    const gameBazi = getBaziForDate(parseGameDate(game.data));
    return gameBazi && filterCondition(gameBazi, coherenceElement);
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

      if (!teamA_Bazi || !teamB_Bazi || !gameBazi) return;

      const analysisA = analyzeTeamFavorability(teamA_Bazi, gameBazi);
      const analysisB = analyzeTeamFavorability(teamB_Bazi, gameBazi);

      let predictedWinner = 'empate';
      let bonus = 0;
      if (coherenceElement === 'fire') bonus = 40;
      if (analysisA.score > analysisB.score + bonus) predictedWinner = 'a';
      if (analysisB.score > analysisA.score + bonus) predictedWinner = 'b';

      const isSuccess = predictedWinner === game.resultado;
      if (predictedWinner === game.resultado) {
        successCount++;
      }
      totalGames++;
      teamGames.push({
        result: isSuccess ? 'C' : 'X',
        date: game.data,
        teamA: game.timeA,
        teamB: game.timeB,
        placar: game.placar,
        resultadoReal: game.resultado,
        resultadoPredito: predictedWinner,
        scoreA: analysisA.score,
        scoreB: analysisB.score,
      });
    });

    return {
      team: team.name,
      logo: team.logo,
      successRate: totalGames > 0 ? Math.round((successCount / totalGames) * 100) : 0,
      totalGames: totalGames,
      games: teamGames,
    };
  });

  return teamStats.filter(t => t.totalGames > 0).sort((a, b) => b.successRate - a.successRate);
};

const getMetalCoherenceStats = () => {
  const METAL_ANIMALS = ["申", "酉", "丑", "巳"];
  const filterCondition = (gameBazi, coherenceElement) => {
    const dayElement = getGanzhiElement(gameBazi.gzDay);
    const dayAnimal = gameBazi.gzDay.charAt(1);
    // A lógica de coerência agora pode usar o 'coherenceElement'
    return (dayElement === coherenceElement || dayElement === 'water') && METAL_ANIMALS.includes(dayAnimal);
  };
  return getCoherenceStats(allGames, serieA, filterCondition, 'metal');
};

const getFireCoherenceStats = () => {
  const FIRE_ANIMALS = ["寅", "午", "戌", "巳"];
  const filterCondition = (gameBazi, coherenceElement) => {
    const dayElement = getGanzhiElement(gameBazi.gzDay);
    const dayAnimal = gameBazi.gzDay.charAt(1);
    const hourAnimal = gameBazi.gzHour.charAt(1);

    return (dayElement === coherenceElement || dayElement === 'wood' || dayElement === 'earth') &&
      FIRE_ANIMALS.includes(dayAnimal) &&
      FIRE_ANIMALS.includes(hourAnimal);
  };
  return getCoherenceStats(allGames, serieA, filterCondition, 'fire');
};

const CoherenceTable = ({ title, stats }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedGameDetails, setSelectedGameDetails] = useState(null);

  const totalGamesAnalyzed = stats.reduce((acc, team) => acc + team.totalGames, 0) / 2;
  
  // Para calcular a média geral, precisamos do total de acertos.
  // Como não temos o successCount individual, vamos recalcular a partir dos jogos filtrados.
  const totalSuccesses = stats.reduce((acc, team) => {
    // Aproximação do número de acertos a partir da taxa de acerto arredondada
    return acc + (team.successRate / 100) * team.totalGames;
  }, 0) / 2; // Divide por 2 porque cada jogo é contado para dois times

  const averageSuccessRate = totalGamesAnalyzed > 0 ? Math.round((totalSuccesses / totalGamesAnalyzed) * 100) : 0;

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.title}>{title} - Média de Acerto: {averageSuccessRate}%</h2>
      <table className={styles.statsTable}>
        <thead>
          <tr>
            <th>Time</th>
            <th>% Acerto</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(stat => (
            <tr key={stat.team} onClick={() => setSelectedTeam(stat)} style={{ cursor: 'pointer' }}>
              <td className={styles.teamCell} >
                <Image src={stat.logo} alt={`Logo do ${stat.team}`} width={25} height={25} className={styles.teamLogo} /> 
                {stat.team}
              </td>
              <td>{stat.successRate}%</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" style={{ textAlign: 'center', fontStyle: 'italic', color: '#555' }}>
              Total de jogos analisados: {totalGamesAnalyzed}
            </td>
          </tr>
        </tfoot>
      </table>
      {selectedTeam && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedTeam(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3>Jogos de Coerência para {selectedTeam.team}</h3>
            <div className={styles.gameResultsContainer} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {selectedTeam.games.map((game, index) => (
                <div
                  key={index}
                  className={`${game.result === 'C' ? styles.successCell : styles.errorCell} ${styles.clickableCell}`}
                  onClick={() => setSelectedGameDetails(game)}
                >
                  <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{game.result}</div>
                  <div style={{ fontSize: '0.7em', color: '#666', marginTop: '4px' }}>
                    {new Date(parseGameDate(game.date)).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedTeam(null)} className={styles.closeButton}>Fechar</button>
          </div>
        </div>
      )}
      {selectedGameDetails && (
        <GameDetailsModal gameDetails={selectedGameDetails} onClose={() => setSelectedGameDetails(null)} />
      )}
    </div>
  );
};

const GameDetailsModal = ({ gameDetails, onClose }) => {
  if (!gameDetails) return null;

  const translateResult = (result, teamA, teamB) => {
    if (result === 'a') return `Vitória ${teamA}`;
    if (result === 'b') return `Vitória ${teamB}`;
    return 'Empate';
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h3>Detalhes do Jogo</h3>
        <div className={styles.gameDetailRow}>
          <strong>Partida:</strong> {gameDetails.teamA} vs {gameDetails.teamB}
        </div>
        <div className={styles.gameDetailRow}>
          <strong>Data:</strong> {gameDetails.date}
        </div>
        <div className={styles.gameDetailRow}>
          <strong>Placar Real:</strong> {gameDetails.placar}
        </div>
        <hr className={styles.modalSeparator} />
        <div className={styles.gameDetailRow}>
          <strong>Resultado Real:</strong> {translateResult(gameDetails.resultadoReal, gameDetails.teamA, gameDetails.teamB)}
        </div>
        <div className={styles.gameDetailRow}>
          <strong>Resultado Predito:</strong> {translateResult(gameDetails.resultadoPredito, gameDetails.teamA, gameDetails.teamB)}
        </div>
        <div className={styles.gameDetailRow}>
          <strong>Análise de Score:</strong>
          <div>Score {gameDetails.teamA}: {gameDetails.scoreA}</div>
          <div>Score {gameDetails.teamB}: {gameDetails.scoreB}</div>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          Fechar
        </button>
      </div>
    </div>
  );
};

const TrineStatsModal = ({ teamName, stats, onClose }) => {
  // Converte o objeto de estatísticas em um array e ordena pela taxa de acerto (decrescente)
  const sortedStats = Object.entries(stats).sort(([, a], [, b]) => b.successRate - a.successRate);

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h3>Taxa de Acerto por Tríade do Mês - {teamName}</h3>
        {sortedStats.map(([trine, data]) => (
          <div key={trine} className={styles.trineStat}>
            <strong>{trine}:</strong> {data.successRate}% ({data.totalGames} jogos)
          </div>
        ))}
        <button onClick={onClose} className={styles.closeButton}>Fechar</button>
      </div>
    </div>
  );
};

const TeamStatsTable = ({ title, teamsWithStats, monthlyStats, teamTrineStats }) => {
  // O componente agora recebe os dados já calculados.
  // A ordenação é mantida para garantir que os times com melhor desempenho apareçam primeiro.
  const sortedTeamsWithStats = [...teamsWithStats].sort((a, b) => b.successRate - a.successRate);

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedGameDetails, setSelectedGameDetails] = useState(null);

  return (
    <div className={styles.tableContainer}>
      {(() => {
        return (
          <> {/* Adicionado React.Fragment aqui */}
            <h2 className={styles.title}>
              {title} - Taxa de Acerto Geral: {
                (() => {
                  // Acha o array de histórico para que possamos filtrar todos os jogos, não apenas os arrays de meses
                  const totalSuccess = teamsWithStats.reduce((acc, team) => acc + team.history.flat().filter(h => h.result === 'C').length, 0);
                  const totalError = teamsWithStats.reduce((acc, team) => acc + team.history.flat().filter(h => h.result === 'X').length, 0);
                  const totalGames = totalSuccess + totalError;
                  return totalGames > 0 ? Math.round((totalSuccess / totalGames) * 100) : 0;
                })()
              }%
            </h2>
            <table className={styles.statsTable}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>% Acerto</th>
                  <th>% Erro</th>
                  {allLunarMonths.map(month => {
                    const stats = monthlyStats[month];
                    const successRate = stats.total > 0 ? Math.round((stats.successes / stats.total) * 100) : 0;
                    return (<th key={month}>
                      <div>{month}</div>
                      <div style={{ fontSize: '0.8em', fontWeight: 'normal', color: '#555' }}>({successRate}%)</div>
                    </th>)
                  })}
                </tr>
              </thead>
              <tbody>
                {sortedTeamsWithStats.map((team) => {
                  let showHighlightAndTooltip = false;
                  const rowStyle = {}; // Estilo da linha
                  const teamCellStyle = { cursor: 'pointer' }; // Estilo da célula do time

                  // Verifica se o time tem 50% ou mais de acerto na Tríade do mês atual
                  if (currentMonthTrine && teamTrineStats[team.name] && teamTrineStats[team.name][currentMonthTrine]?.successRate >= 50) {
                    rowStyle.backgroundColor = '#e6ffed'; // Verde claro para destaque
                    showHighlightAndTooltip = true;
                  }

                  return (
                    <tr key={team.name} style={rowStyle}>
                      <td
                        className={styles.teamCell}
                        onClick={() => setSelectedTeam(team)}
                        style={teamCellStyle}
                      >
                        <Image
                          src={team.logo}
                          alt={`Brasão do ${team.name}`}
                          width={25}
                          height={25}
                          className={styles.teamLogo}
                        />
                        {team.name}
                        {showHighlightAndTooltip && (
                          <div className={styles.tooltip}>
                            <span className={styles.tooltipIcon}>⚽</span>
                            <span className={styles.tooltipText}>{`odds a partir de 2 vale a pena apostar no mês do ${branchToAnimal(currentMonthBranch)}`}</span>
                          </div>
                        )}
                      </td>
                      <td>{team.successRate}%</td>
                      <td>{team.errorRate}%</td>
                      {team.history.map((gamesInMonth, index) => {
                        const monthlySuccesses = gamesInMonth.filter(g => g.result === 'C').length;
                        const monthlyTotal = gamesInMonth.length;
                        const monthlySuccessRate = monthlyTotal > 0 ? Math.round((monthlySuccesses / monthlyTotal) * 100) : null;

                        return (
                          <td key={index} className={styles.monthCell}>
                            <div className={styles.gameResultsContainer}>
                              {gamesInMonth.map((gameResult, gameIndex) => (
                                <div
                                  key={gameIndex}
                                  className={`${gameResult.result === 'C' ? styles.successCell : styles.errorCell} ${styles.clickableCell}`}
                                  onClick={() => setSelectedGameDetails(gameResult)}
                                >
                                  <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{gameResult.result}</div>
                                  {gameResult.date && (
                                    <div style={{ fontSize: '0.7em', color: '#666', marginTop: '4px' }}>
                                      {new Date(parseGameDate(gameResult.date)).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                      })}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            {monthlySuccessRate !== null && <div className={styles.monthlyRate}>{monthlySuccessRate}%</div>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {selectedTeam && (
              <TrineStatsModal
                teamName={selectedTeam.name}
                stats={teamTrineStats[selectedTeam.name]}
                onClose={() => setSelectedTeam(null)}
              />
            )}
            {selectedGameDetails && (
              <GameDetailsModal gameDetails={selectedGameDetails} onClose={() => setSelectedGameDetails(null)} />
            )}
          </>
        );
      })()}
    </div>
  );
};

const Statistics = () => {
  // Calcula os dados para as tabelas usando os scores padrão.
  const calculateAllStats = (scores) => {
    const teamsA = serieA.map(team => ({ ...team, ...getTeamStats(team.name, scores) }));
    const teamsB = serieB.map(team => ({ ...team, ...getTeamStats(team.name, scores) }));
    const allTeams = [...teamsA, ...teamsB];
    const trineStats = allTeams.reduce((acc, team) => ({ ...acc, [team.name]: getTrineStatsForTeam(team.name, scores) }), {});
    return {
      teamsA,
      teamsB,
      monthly: calculateMonthlyStats(allGames, scores),
      trine: trineStats,
    };
  };

  const defaultData = calculateAllStats(DEFAULT_ANALYZE_SCORES);

  return (
    <div style={{ paddingBottom: '50px' }}>      
     <CoherenceTable title="Jogos em Dias de Coerência Fogo (Série A)" stats={getFireCoherenceStats()} />
      <CoherenceTable title="Jogos em Dias de Coerência Metal (Série A)" stats={getMetalCoherenceStats()} />
      <TeamStatsTable
        title="Série A (Padrão)"
        teamsWithStats={defaultData.teamsA}
        monthlyStats={defaultData.monthly}
        teamTrineStats={defaultData.trine}
      />
      <TeamStatsTable
        title="Série B (Padrão)"
        teamsWithStats={defaultData.teamsB}
        monthlyStats={defaultData.monthly}
        teamTrineStats={defaultData.trine}
      />
    </div>
  );
};

export default Statistics;