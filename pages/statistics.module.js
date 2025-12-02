import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './statistics.module.css';
import { parseGameDate, getBaziForDate } from '../src/lib/bazi-calculator';
import {generateWuxingDefaultStatistics} from '../scripts/generate-stats';
// --- Constantes de UI ---


const branchToAnimal = (b) => {
  const map = {
    '寅': 'Tigre', '卯': 'Coelho',
    '辰': 'Dragão', '巳': 'Serpente', '午': 'Cavalo', '未': 'Cabra',
    '申': 'Macaco', '酉': 'Galo', '戌': 'Cão', '亥': 'Porco', '子': 'Rato', '丑': 'Boi',
  };
  return map[b] || '';
};
// Define a ordem fixa dos meses lunares
const orderedBranches = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
const allLunarMonths = orderedBranches.map(branch => `Mês do ${branchToAnimal(branch)}`);

// Mapeamento das Tríades Elementares (Importado de wuxing.js para consistência)
import { TRINE_ANIMALS, getGanzhiElement, calculateWuXing } from '../src/lib/wuxing';
const TRINE_ELEMENTS_MAP = { // Renomeado para evitar confusão com TRINE_ANIMALS
  Fogo: TRINE_ANIMALS.FIRE,
  Madeira: TRINE_ANIMALS.WOOD,
  Água: TRINE_ANIMALS.WATER,
  Metal: TRINE_ANIMALS.METAL,
  Terra: TRINE_ANIMALS.EARTH, // A Terra também tem uma tríade em TRINE_ANIMALS
};

const getTrineForBranch = (branch) => {
  for (const element in TRINE_ELEMENTS_MAP) {
    if (TRINE_ELEMENTS_MAP[element].includes(branch)) {
      return element;
    }
  }
  return null;
};

// --- Componentes Reutilizáveis (Inalterados) ---

// Mapeamento para exibir os nomes das coerências e um reverso para lookup
const coherenceElementsDisplayMap = {
  FIRE: 'Fogo',
  METAL: 'Metal',
  WOOD: 'Madeira',
  WATER: 'Água',
  EARTH: 'Terra',
};

const reverseCoherenceElementsDisplayMap = Object.fromEntries(
  Object.entries(coherenceElementsDisplayMap).map(([key, value]) => [value, key])
);


const CoherenceTable = ({ title, stats }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedGameDetails, setSelectedGameDetails] = useState(null);

  if (!stats || stats.length === 0) {
    return (
        <div className={styles.tableContainer}>
            <h2 className={styles.title}>{title} - Não há jogos para análise.</h2>
        </div>
    );
  }

  // O cálculo da média de acerto deve ser feito com base no `totalGames` filtrado e `successRate`
  // A simulação calcula a taxa de acerto por time *dentro* do filtro de coerência.
  const totalGamesAnalyzed = stats.reduce((acc, team) => acc + team.totalGames, 0) / 2;
  
  // Calcula o número total de acertos ponderado pelo número de jogos de cada time.
  const totalSuccesses = stats.reduce((acc, team) => {
    // team.successRate é um percentual (ex: 75), então convertemos para o número de jogos.
    return acc + (team.totalGames * (team.successRate / 100));
  }, 0);

  const averageSuccessRate = totalGamesAnalyzed > 0 ? Math.round((totalSuccesses / (totalGamesAnalyzed * 2)) * 100) : 0;

  // Ordena os times pela taxa de acerto para exibição
  const sortedStats = [...stats].sort((a, b) => b.successRate - a.successRate);

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.title}>
        {title} Taxa de Acerto Média: {averageSuccessRate}%
        <span style={{ fontSize: '0.6em', color: '#050505ff', marginLeft: '10px' }}>({totalGamesAnalyzed} jogos)</span>
      </h2>
      <table className={styles.statsTable}>
        <thead>
          <tr>
            <th>Time</th>
            <th>% Acerto</th>
            <th>Total de Jogos</th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.map(stat => (
            <tr key={stat.team} onClick={() => setSelectedTeam(stat)} style={{ cursor: 'pointer' }}>
              <td className={styles.teamCell} >
                <Image src={stat.logo} alt={`Logo do ${stat.team}`} width={25} height={25} className={styles.teamLogo} /> 
                {stat.team}
              </td>
              <td>{stat.successRate}%</td>
              <td>{stat.totalGames}</td>
            </tr>
          ))}
        </tbody>
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
console.log(gameDetails);
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
          <div>Score {gameDetails.teamA}: {gameDetails.scoreA.score.toFixed(2)}</div>
          <div>Score {gameDetails.teamB}: {gameDetails.scoreB.score.toFixed(2)}</div>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          Fechar
        </button>
      </div>
    </div>
  );
};

const elementColors = {
  wood: '#28a745',
  fire: '#dc3545',
  earth: '#ffc107',
  metal: '#adb5bd',
  water: '#007bff',
};
const TopTeamsTable = ({ title, stats }) => {
  if (!stats || stats.length === 0) {
    return null; // Não renderiza nada se não houver estatísticas
  }

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.title}>{title}</h2>
      <table className={styles.statsTable}>
        <thead>
          <tr>
            <th>Time</th>
            <th>% Acerto na Tríade</th>
            <th>Jogos na Tríade</th>
            <th>Elemento Preponderante nas Vitórias</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(stat => (
            <tr key={stat.name}>
              <td className={styles.teamCell}>
                <Image 
                  src={stat.logo} 
                  alt={`Logo do ${stat.name}`} 
                  width={25} 
                  height={25} 
                  className={styles.teamLogo} 
                />
                {stat.name}
              </td>
              <td>{stat.successRate}%</td>
              <td>{stat.totalGames}</td>
              <td>
                <div className={styles.miniChartContainer}>
                  {Object.entries(stat.winningElements).map(([element, count]) => (
                    count > 0 && (
                      <div key={element} className={styles.miniBarWrapper}>
                        <div 
                          className={styles.miniBar} 
                          style={{ height: `${(count / stat.successes) * 100}%`, backgroundColor: elementColors[element] }}
                          title={`${element.charAt(0).toUpperCase() + element.slice(1)}: ${count} vitórias`}
                        ></div>
                        <span className={styles.miniBarLabel}>{element.charAt(0).toUpperCase()}</span>
                      </div>
                    )
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ScoreVarianceChart = ({ title, data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.chartContainer}>
        {data.map(item => (
          <div key={item.range} className={styles.barWrapper}>
            <div className={styles.barLabelTop}>{item.successRate.toFixed(1)}%</div>
            <div className={styles.bar} style={{ height: `${item.successRate}%` }}>
            </div>
            <div className={styles.barLabelBottom}>{item.range}</div>
            <div className={styles.barLabelGames}>({item.totalGames} jogos)</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TopWinsChart = ({ title, stats }) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  const maxWins = Math.max(...stats.map(s => s.wins), 0);

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.barChartWinsContainer}>
        {stats.map(stat => (
          <div key={stat.name} className={styles.barChartWinsRow}>
            <div className={styles.teamCell} style={{ width: '150px', flexShrink: 0 }}>
              <Image 
                src={stat.logo} 
                alt={`Logo do ${stat.name}`} 
                width={25} 
                height={25} 
                className={styles.teamLogo} 
              />
              {stat.name}
            </div>
            <div className={styles.barContainer}>
              <div className={styles.barWins} style={{ width: `${(stat.wins / maxWins) * 100}%` }}>
                <span className={styles.barWinsLabel}>{stat.wins} vitórias</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ErrorAnalysisTextArea = ({ title, data }) => {
  if (!data) {
    return null;
  }

  // Formata o objeto para uma string JSON bonita para exibição
  const dataString = JSON.stringify(data, null, 2);

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.title}>{title}</h2>
      <textarea readOnly className={styles.jsonTextArea} value={dataString} />
    </div>
  );
};
const TrineStatsModal = ({ team, teamTrineStats, onClose }) => {
  if (!team) return null;

  const { name: teamName, history } = team;

  // 1. Estatísticas Gerais de Coerência (dados já calculados)
  const generalCoherenceStats = teamTrineStats[teamName] 
    ? Object.entries(teamTrineStats[teamName]).map(([key, value]) => ({
        element: coherenceElementsDisplayMap[key],
        successRate: value.successRate,
        totalGames: value.totalGames,
      })).sort((a, b) => b.successRate - a.successRate)
    : [];

  // 2. Estatísticas por Meses da Tríade
  const trineMonthStats = Object.entries(TRINE_ELEMENTS_MAP).map(([elementName, branches]) => {
    let successes = 0;
    let totalGames = 0;

    history.flat().forEach(game => {
      const gameDate = parseGameDate(game.date);
      const gameBazi = getBaziForDate(gameDate);
      if (!gameBazi) return;

      const monthBranch = gameBazi.gzMonth.charAt(1);
      if (branches.includes(monthBranch)) {
        totalGames++;
        if (game.result === 'C') {
          successes++;
        }
      }
    });

    return {
      element: elementName,
      successRate: totalGames > 0 ? Math.round((successes / totalGames) * 100) : 0,
      totalGames: totalGames,
    };
  }).sort((a, b) => b.successRate - a.successRate);

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h3>Estatísticas para {teamName}</h3>
        
        <h4 style={{ marginTop: '1.5rem', textAlign: 'left' }}>Desempenho em Dias de Coerência</h4>
        {generalCoherenceStats.length > 0 ? (
          <table className={styles.statsTable}>
            <thead>
              <tr>
                <th>Coerência</th>
                <th>% Acerto</th>
                <th>Jogos</th>
              </tr>
            </thead>
            <tbody>
              {generalCoherenceStats.map((stat) => (
                <tr key={stat.element}>
                  <td>{stat.element}</td>
                  <td>{stat.successRate}%</td>
                  <td>{stat.totalGames}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>Sem dados de coerência para este time.</p>}

        <h4 style={{ marginTop: '1.5rem', textAlign: 'left' }}>Desempenho nos Meses da Tríade</h4>
        {trineMonthStats.length > 0 ? (
          <table className={styles.statsTable}>
            <thead>
              <tr>
                <th>Tríade (Elemento)</th>
                <th>% Acerto</th>
                <th>Jogos</th>
              </tr>
            </thead>
            <tbody>
              {trineMonthStats.map((stat) => (
                <tr key={stat.element}>
                  <td>{stat.element}</td>
                  <td>{stat.successRate}%</td>
                  <td>{stat.totalGames}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>Sem dados de meses da tríade para este time.</p>}

        <button onClick={onClose} className={styles.closeButton}>Fechar</button>
      </div>
    </div>
  );
};

const TeamStatsTable = ({ title, teamsWithStats, monthlyStats, teamTrineStats, currentMonthBranch }) => {
  if(!teamsWithStats)
    return (
      <div className={styles.tableContainer}>
        <h2 className={styles.title}>{title} - Não há dados para exibir.</h2>
      </div>
    );
    console.log(teamsWithStats);
  const sortedTeamsWithStats = [...teamsWithStats].sort((a, b) => b.successRate - a.successRate);
  const currentMonthTrine = currentMonthBranch ? getTrineForBranch(currentMonthBranch) : null;
  
  // Mapeia o nome da tríade (ex: "Fogo") para a chave da coerência (ex: "FIRE")
  const coherenceElementKeyForMonthTrine = currentMonthTrine ? reverseCoherenceElementsDisplayMap[currentMonthTrine] : null;

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedGameDetails, setSelectedGameDetails] = useState(null);
  let totalSuccess = 0;
  let totalError = 0;
  // Calcula o acerto geral para o título (mantido como estava)
  if(!teamsWithStats || !teamsWithStats[0] || !teamsWithStats[0].history){
     }
  else{
    totalSuccess = teamsWithStats.reduce((acc, team) => acc + team.history.flat().filter(h => h.result === 'C').length, 0);
    totalError = teamsWithStats.reduce((acc, team) => acc + team.history.flat().filter(h => h.result === 'X').length, 0);
  }
  const totalGames = totalSuccess + totalError;
  const overallSuccessRate = totalGames > 0 ? Math.round((totalSuccess / totalGames) * 100) : 0;

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.title}>
        {title} - Taxa de Acerto Geral: **{overallSuccessRate}%**
      </h2>
      <table className={styles.statsTable}>
        <thead>
          <tr>
            <th>Time</th>
            <th>% Acerto</th>
            <th>% Erro</th>
            {allLunarMonths.map(month => {
              const stats = monthlyStats ? monthlyStats[month] : { total: 0, successes: 0 };
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
            const rowStyle = {}; 
            const teamCellStyle = { cursor: 'pointer' };

            // Verifica se há uma coerência correspondente ao mês atual e se a taxa de acerto é >= 50%
            if (coherenceElementKeyForMonthTrine && teamTrineStats[team.name] && teamTrineStats[team.name][coherenceElementKeyForMonthTrine]?.successRate >= 50) {
              rowStyle.backgroundColor = '#e6ffed'; 
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
                {(team.history || []).map((gamesInMonth, index) => {
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
          team={selectedTeam}
          teamTrineStats={teamTrineStats}
          onClose={() => setSelectedTeam(null)}
        />
      )}
      {selectedGameDetails && (
        <GameDetailsModal gameDetails={selectedGameDetails} onClose={() => setSelectedGameDetails(null)} />
      )}
    </div> 
  );
};

// --- Componente Principal Atualizado ---
import { DEFAULT_ANALYZE_SCORES } from '../src/lib/wuxing';

const Statistics = () => {
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topWoodTrineTeams, setTopWoodTrineTeams] = useState([]);
  const [topHighFireTeams, setTopHighFireTeams] = useState([]);
  const [scoreVarianceData, setScoreVarianceData] = useState([]);
  const [teamsAWithErrors, setTeamsAWithErrors] = useState([]);
  const [teamsBWithErrors, setTeamsBWithErrors] = useState([]);
  const [errorAnalysisA, setErrorAnalysisA] = useState({});
  const [errorAnalysisB, setErrorAnalysisB] = useState({});
  const woodTrineBranches = TRINE_ELEMENTS_MAP['Madeira']; // Mantido fora, pois é uma constante

  // Efeito 1: Carrega os dados principais (statsData)
  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = generateWuxingDefaultStatistics(DEFAULT_ANALYZE_SCORES);
        setStatsData(stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  // Efeito 2: Calcula as estatísticas derivadas *após* statsData estar carregado
  useEffect(() => {
    const calculateDerivedStats = () => {
      if (!statsData || !statsData.defaultData) return;
      
      // ******* CORREÇÃO APLICADA AQUI *******
      // Garante que as listas de times sejam lidas DENTRO do useEffect
      const serieATeams = statsData.defaultData.teamsA || [];
      const serieBTeams = statsData.defaultData.teamsB || [];
      // ***************************************

      // Lógica para calcular o Top 10 da Tríade de Madeira
      const woodTrineTeams = serieATeams.map(team => {
        let successes = 0;
        let totalGames = 0;
        const winningElements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
        console.log(team);
        if(team.history)
        team.history.flat().forEach(game => {
          const gameDate = parseGameDate(game.date);
          const gameBazi = getBaziForDate(gameDate);
          if (!gameBazi || !gameBazi.gzMonth) return;

          const monthBranch = gameBazi.gzMonth.charAt(1);
          if (woodTrineBranches.includes(monthBranch)) {
            totalGames++;
            if (game.result === 'C') {
              successes++;
              const gamePercentages = calculateWuXing(gameBazi, null, DEFAULT_ANALYZE_SCORES);
              if (gamePercentages) {
                const dominantElement = (Object.keys(gamePercentages) || []).reduce((a, b) => gamePercentages[a] > gamePercentages[b] ? a : b);
                if (winningElements.hasOwnProperty(dominantElement)) {
                  winningElements[dominantElement]++;
                }
              }
            }
          }
        });

        return {
          ...team, successRate: totalGames > 0 ? Math.round((successes / totalGames) * 100) : 0, totalGames, successes, winningElements
        };
      });

      const finalTopWoodTrineTeams = woodTrineTeams
        .filter(team => team.totalGames > 3)
        .sort((a, b) => b.successRate - a.successRate)
        .slice(0, 10);
      setTopWoodTrineTeams(finalTopWoodTrineTeams);

      // Lógica para times com mais vitórias em dias de Fogo >= 33%
      const highFireTeams = serieATeams.map(team => {
        let highFireWins = 0;
        console.log(team);
        if(team.history)
        team.history.flat().forEach(game => {
          if (game.result === 'C') {
            const gameDate = parseGameDate(game.date);
            const gameBazi = getBaziForDate(gameDate);
            if (!gameBazi) return;

            const gamePercentages = calculateWuXing(gameBazi, null, DEFAULT_ANALYZE_SCORES);
            if (gamePercentages && gamePercentages.fire >= 33) {
              highFireWins++;
            }
          }
        });
        return { ...team, wins: highFireWins };
      });

      const finalTopHighFireTeams = highFireTeams
        .filter(team => team.wins > 0)
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10);
      setTopHighFireTeams(finalTopHighFireTeams);

      // Lógica para agrupar taxa de acerto por diferença de score
      const scoreVarianceRanges = {
        '0-15': { successes: 0, totalGames: 0 },
        '16-30': { successes: 0, totalGames: 0 },
        '31-50': { successes: 0, totalGames: 0 },
        '51+': { successes: 0, totalGames: 0 },
      };

      const allGames = [...serieATeams, ...serieBTeams] // Agora serieATeams e serieBTeams estão definidos
        .flatMap(team => {
          if(team.history){
          team.history.flat()}
    });

      const processedGames = new Set();
      allGames.forEach(game => {
        if(!game || !game.date || !game.teamA || !game.teamB) return;
        const gameId = `${game.date}-${game.teamA}-${game.teamB}`;
        if (processedGames.has(gameId) || !game.scoreA || !game.scoreB) return;
        processedGames.add(gameId);

        const scoreDiff = Math.abs(game.scoreA.score - game.scoreB.score);
        let rangeKey;
        if (scoreDiff <= 15) rangeKey = '0-15';
        else if (scoreDiff <= 30) rangeKey = '16-30';
        else if (scoreDiff <= 50) rangeKey = '31-50';
        else rangeKey = '51+';

        scoreVarianceRanges[rangeKey].totalGames++;
        if (game.result === 'C') {
          scoreVarianceRanges[rangeKey].successes++;
        }
      });

      const finalScoreVarianceData = Object.entries(scoreVarianceRanges).map(([range, stats]) => ({
        range, ...stats, successRate: stats.totalGames > 0 ? (stats.successes / stats.totalGames) * 100 : 0
      }));
      setScoreVarianceData(finalScoreVarianceData);

      // Função para calcular as categorias de erro para uma lista de times
      const calculateErrorCategories = (teams) => {
        if (!teams) return [];
        return teams.map(team => {
          const errorCategories = {
            predictedLossWon: { total: 0, elements: { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 } },
            wrongResultDraw: { total: 0, elements: { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 } },
            predictedWinLost: { total: 0, elements: { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 } },
          };
        console.log(team);
        if(team.history)
          team.history.flat().forEach(game => {
            if (game.result === 'X') {
              const isTeamA = team.name === game.teamA;
              let category = null;

              if ((isTeamA && game.resultadoPredito === 'b' && game.resultadoReal === 'a') ||
                  (!isTeamA && game.resultadoPredito === 'a' && game.resultadoReal === 'b')) {
                category = 'predictedLossWon';
              } else if (game.resultadoReal === 'empate' && game.resultadoPredito !== 'empate') {
                category = 'wrongResultDraw';
              } else if ((isTeamA && game.resultadoPredito === 'a' && game.resultadoReal === 'b') ||
                       (!isTeamA && game.resultadoPredito === 'b' && game.resultadoReal === 'a')) {
                category = 'predictedWinLost';
              }

              if (category) {
                errorCategories[category].total++;
                const gameDate = parseGameDate(game.date);
                const gameBazi = getBaziForDate(gameDate);
                if (gameBazi) {
                  const gamePercentages = calculateWuXing(gameBazi, null, DEFAULT_ANALYZE_SCORES);
                  if (gamePercentages) {
                    const dominantElement = Object.keys(gamePercentages).reduce((a, b) => gamePercentages[a] > gamePercentages[b] ? a : b);
                    if (errorCategories[category].elements.hasOwnProperty(dominantElement)) {
                      errorCategories[category].elements[dominantElement]++;
                    }
                  }
                }
              }
            }
          });
          return { ...team, errorCategories };
        });
      };

      const finalTeamsAWithErrors = calculateErrorCategories(serieATeams, DEFAULT_ANALYZE_SCORES);
      const finalTeamsBWithErrors = calculateErrorCategories(serieBTeams, DEFAULT_ANALYZE_SCORES);
      setTeamsAWithErrors(finalTeamsAWithErrors);
      setTeamsBWithErrors(finalTeamsBWithErrors);


      const generateErrorAnalysisObject = (teams) => {
        if (!teams) return {};
        return teams.reduce((acc, team) => {
          const beneficos = team.errorCategories.predictedLossWon.elements;
          const maleficos = team.errorCategories.predictedWinLost.elements;

          const filteredBeneficos = Object.fromEntries(Object.entries(beneficos).filter(([, count]) => count >= 3));
          const filteredMaleficos = Object.fromEntries(Object.entries(maleficos).filter(([, count]) => count >= 3));

          if (Object.keys(filteredBeneficos).length > 0 || Object.keys(filteredMaleficos).length > 0) {
            acc[team.name] = {
              elementos_beneficos: filteredBeneficos,
              elementos_maleficos: filteredMaleficos,
            };
          }
          return acc;
        }, {});
      };

      setErrorAnalysisA(generateErrorAnalysisObject(finalTeamsAWithErrors));
      setErrorAnalysisB(generateErrorAnalysisObject(finalTeamsBWithErrors));
    };

    // Dependência do useEffect permanece [statsData]
    calculateDerivedStats();
  }, [statsData]);;

  if (isLoading) {
    return <div className={styles.loadingMessage}>Carregando estatísticas...</div>;
  }

  if (error) {
    return <div className={styles.loadingMessage} style={{ color: 'red' }}>Erro: {error}</div>;
  }

  if (!statsData) {
    return <div className={styles.loadingMessage}>Nenhum dado de estatística encontrado.</div>;
  }


  // Desestrutura os dados de coerência
  const { 
    fireCoherenceStats, 
    metalCoherenceStats, 
    woodCoherenceStats, 
    waterCoherenceStats, 
    earthCoherenceStats, 
    teamCoherenceStats, // Novo: Estatísticas de coerência agregadas por time
    bestScoresByCoherence 
  } = statsData;

  return (
    <div style={{ paddingBottom: '50px' }}>
   

    

      <hr />
      <h1>Estatísticas Padrão por Mês Lunar</h1>
      <hr />
      {/* Tabela Padrão Série A */}
      <TeamStatsTable
        title="Série A (Padrão)"
        teamsWithStats={teamsAWithErrors}
        monthlyStats={statsData.defaultData?.monthlyA}
        teamTrineStats={teamCoherenceStats} // Passa as novas estatísticas de coerência por time
      />
      
      {/* Tabela Padrão Série B */}
      <TeamStatsTable
        title="Série B (Padrão)"
        teamsWithStats={teamsBWithErrors}
        monthlyStats={statsData.defaultData?.monthlyB}
        teamTrineStats={teamCoherenceStats} // Passa as novas estatísticas de coerência por time
      />
       <h1>Estatísticas de Coerência Wuxing (Série A)</h1>
      <hr />

      {/* Tabela de Coerência Fogo */}
      <CoherenceTable 
        title={`🔥 Jogos em Dias de Coerência Fogo` } 
        stats={fireCoherenceStats} 
      />
      
      {/* Tabela de Coerência Metal */}
      <CoherenceTable 
        title={`⚙️ Jogos em Dias de Coerência Metal`} 
        stats={metalCoherenceStats} 
      />
      
      {/* Tabela de Coerência Madeira */}
      <CoherenceTable 
        title={`🌳 Jogos em Dias de Coerência Madeira`} 
        stats={woodCoherenceStats} 
      />

      {/* Tabela de Coerência Água */}
      <CoherenceTable 
        title={`💧 Jogos em Dias de Coerência Água`} 
        stats={waterCoherenceStats} 
      />

      {/* Tabela de Coerência Terra */}
      <CoherenceTable 
        title={`⛰️ Jogos em Dias de Coerência Terra`} 
        stats={earthCoherenceStats} 
      />

      <hr />
         <TopWinsChart
        title="🔥 Top 10 Times com Vitórias em Dias de Fogo (>= 33%)"
        stats={topHighFireTeams}
      />
      <TopTeamsTable 
        title="🏆 Top 10 Times na Tríade de Madeira (Coelho, Cabra, Porco)"
        stats={topWoodTrineTeams}
      />
      <ScoreVarianceChart
        title="📊 Taxa de Acerto por Diferença de Score"
        data={scoreVarianceData}
      />
      <ErrorAnalysisTextArea
        title="🔬 Análise de Erros - Elementos Preponderantes (Série A)"
        data={errorAnalysisA}
      />

      <ErrorAnalysisTextArea
        title="🔬 Análise de Erros - Elementos Preponderantes (Série B)"
        data={errorAnalysisB}
      />
    </div>
  );
};

export default Statistics;