import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './statistics.module.css';
import { parseGameDate, getBaziForDate } from '../src/lib/bazi-calculator'; // Apenas o parseDate é necessário aqui
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
import { TRINE_ANIMALS, getGanzhiElement } from '../src/lib/wuxing';
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
          <div>Score {gameDetails.teamA}: {gameDetails.scoreA?.score?.toFixed(2)}</div>
          <div>Score {gameDetails.teamB}: {gameDetails.scoreB?.score?.toFixed(2)}</div>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          Fechar
        </button>
      </div>
    </div>
  );
};

const TrineStatsModal = ({ team, onClose }) => {
  if (!team) return null;

  const { name: teamName, history } = team;

  // Objeto para armazenar as estatísticas calculadas para cada coerência
  const coherenceStats = { FIRE: { successes: 0, total: 0 }, METAL: { successes: 0, total: 0 }, WOOD: { successes: 0, total: 0 }, WATER: { successes: 0, total: 0 }, EARTH: { successes: 0, total: 0 } };

  // Itera sobre todos os jogos do histórico do time
  history.flat().forEach(game => {
    const gameDate = parseGameDate(game.date);
    const gameBazi = getBaziForDate(gameDate);
    if (!gameBazi) return;

    const dayElement = getGanzhiElement(gameBazi.gzDay);

    // Verifica a qual coerência este jogo pertence
    for (const coherenceKey in coherenceElementsDisplayMap) {
      const trineName = coherenceElementsDisplayMap[coherenceKey];
      const trineBranches = TRINE_ELEMENTS_MAP[trineName];

      if (trineBranches && trineBranches.includes(gameBazi.gzMonth.charAt(1)) && dayElement === coherenceKey.toLowerCase()) {
        coherenceStats[coherenceKey].total++;
        if (game.result === 'C') {
          coherenceStats[coherenceKey].successes++;
        }
      }
    }
  });

  // Formata os dados para exibição na tabela
  const statsArray = Object.entries(coherenceStats).map(([key, value]) => ({
    element: coherenceElementsDisplayMap[key],
    successRate: value.total > 0 ? Math.round((value.successes / value.total) * 100) : 0,
    totalGames: value.total,
  })).sort((a, b) => b.successRate - a.successRate);

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h3>Estatísticas de Coerência para {teamName}</h3>
        <table className={styles.statsTable}>
          <thead>
            <tr>
              <th>Coerência</th>
              <th>% Acerto</th>
              <th>Jogos</th>
            </tr>
          </thead>
          <tbody>
            {statsArray.map((stat) => (
              <tr key={stat.element}>
                <td>{stat.element}</td>
                <td>{stat.successRate}%</td>
                <td>{stat.totalGames}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
  const sortedTeamsWithStats = [...teamsWithStats].sort((a, b) => b.successRate - a.successRate);
  const currentMonthTrine = currentMonthBranch ? getTrineForBranch(currentMonthBranch) : null;
  
  // Mapeia o nome da tríade (ex: "Fogo") para a chave da coerência (ex: "FIRE")
  const coherenceElementKeyForMonthTrine = currentMonthTrine ? reverseCoherenceElementsDisplayMap[currentMonthTrine] : null;

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedGameDetails, setSelectedGameDetails] = useState(null);

  // Calcula o acerto geral para o título (mantido como estava)
  const totalSuccess = teamsWithStats.reduce((acc, team) => acc + team.history.flat().filter(h => h.result === 'C').length, 0);
  const totalError = teamsWithStats.reduce((acc, team) => acc + team.history.flat().filter(h => h.result === 'X').length, 0);
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
          team={selectedTeam} // Passa o objeto completo do time, que inclui o histórico de jogos
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
 
export const DEFAULT_ANALYZE_SCORES = {
  // Pesos percentuais para cada categoria de análise. A soma total deve ser 100.
  day_master_strength_weight: 15.48,
  branch_interactions_weight: 28.67,
  excess_deficiency_weight: 21.05,
  seasonal_dominance_weight: 13.01,
  qi_sha_penalty_weight: 21.79,
  mystical_trine_weight: 10, 
  use_day_master_strength_analysis: true,
  use_branch_interactions: true,
  use_excess_deficiency: true,
  use_seasonal_dominance: true,
  triades_can_be_harmfull: false, // Nova flag para penalizar tríades maléficas
  // Bônus e penalidades para a Tríade Mística
  mystical_trine_bonus: 2,
  mystical_trine_penalty: 2, // Usado como valor negativo
  // Limiar de pontuação para considerar uma previsão de vitória (em vez de empate)
  prediction_threshold: 50,
  favorable_useful_element_multiplier: 1.47,
  unfavorable_useful_element_multiplier: 1.06
};

const Statistics = () => {
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  try {
    const stats = generateWuxingDefaultStatistics(DEFAULT_ANALYZE_SCORES);

    setStatsData(stats);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
}, []);

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

  const getBestRate = (element) => {
      const result = bestScoresByCoherence?.[element];
      return result ? `` : '';
  };

  return (
    <div style={{ paddingBottom: '50px' }}>
      
     
      
      <hr />
      <h1>Estatísticas Padrão por Mês Lunar</h1>
      <hr />

      {/* Tabela Padrão Série A */}
      <TeamStatsTable
        title="Série A (Padrão)"
        teamsWithStats={statsData.defaultData?.teamsA}
        monthlyStats={statsData.defaultData?.monthlyA}
        teamTrineStats={teamCoherenceStats} // Passa as novas estatísticas de coerência por time
      />
      
      {/* Tabela Padrão Série B */}
      <TeamStatsTable
        title="Série B (Padrão)"
        teamsWithStats={statsData.defaultData?.teamsB}
        monthlyStats={statsData.defaultData?.monthlyB}
        teamTrineStats={teamCoherenceStats} // Passa as novas estatísticas de coerência por time
      />
       <h1>Estatísticas de Coerência Wuxing (Série A)</h1>
      <hr />

      {/* Tabela de Coerência Fogo */}
      <CoherenceTable 
        title={`🔥 Jogos em Dias de Coerência Fogo ${getBestRate('FIRE')}` } 
        stats={fireCoherenceStats} 
      />
      
      {/* Tabela de Coerência Metal */}
      <CoherenceTable 
        title={`⚙️ Jogos em Dias de Coerência Metal ${getBestRate('METAL')}`} 
        stats={metalCoherenceStats} 
      />
      
      {/* Tabela de Coerência Madeira */}
      <CoherenceTable 
        title={`🌳 Jogos em Dias de Coerência Madeira ${getBestRate('WOOD')}`} 
        stats={woodCoherenceStats} 
      />

      {/* Tabela de Coerência Água */}
      <CoherenceTable 
        title={`💧 Jogos em Dias de Coerência Água ${getBestRate('WATER')}`} 
        stats={waterCoherenceStats} 
      />

      {/* Tabela de Coerência Terra */}
      <CoherenceTable 
        title={`⛰️ Jogos em Dias de Coerência Terra ${getBestRate('EARTH')}`} 
        stats={earthCoherenceStats} 
      />
    </div>
  );
};

export default Statistics;