import React, { useState } from 'react';
import Image from 'next/image';
import styles from './statistics.module.css';
import { serieA, serieB } from '../src/lib/teams';
import { allGames } from '../src/lib/hadcoded-games';
import { hardcodedTeams } from '../src/lib/hardcoded-teams';
import { analyzeTeamFavorability } from '../src/lib/wuxing';
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


// Calcula a taxa de acerto para cada mês lunar
const monthlyStats = allLunarMonths.reduce((acc, monthName) => {
  acc[monthName] = { successes: 0, total: 0 };
  return acc;
}, {});

allGames.forEach(game => {
  const monthName = getMonthAnimalName(game.data);
  if (!monthName) return;

  const teamA_Bazi = hardcodedTeams.find(t => t.nome === game.timeA);
  const teamB_Bazi = hardcodedTeams.find(t => t.nome === game.timeB);
  const gameDate = parseGameDate(game.data);
  const game_Bazi = getBaziForDate(gameDate);

  if (!teamA_Bazi || !teamB_Bazi || !game_Bazi) return;

  const analysisA = analyzeTeamFavorability(teamA_Bazi, game_Bazi);
  const analysisB = analyzeTeamFavorability(teamB_Bazi, game_Bazi);

  let predictedWinner = 'empate';
  if (analysisA.score > analysisB.score) predictedWinner = 'a';
  if (analysisB.score > analysisA.score) predictedWinner = 'b';

  if (predictedWinner === game.resultado) {
    monthlyStats[monthName].successes++;
  }
  monthlyStats[monthName].total++;
});


const getTeamStats = (teamName) => {
  const history = Array(MAX_COLUMNS).fill({ result: '', date: null });
  let successCount = 0;
  let errorCount = 0;

  allGames.forEach(game => {
    if (game.timeA === teamName || game.timeB === teamName) {

      // Obter dados Bazi dos times
      const teamA_Bazi = hardcodedTeams.find(t => t.nome === game.timeA);
      const teamB_Bazi = hardcodedTeams.find(t => t.nome === game.timeB);

      // Obter Bazi da data do jogo
      const gameDate = parseGameDate(game.data);
      const game_Bazi = getBaziForDate(gameDate);

      const monthName = getMonthAnimalName(game.data);
      const columnIndex = monthToIndexMap[monthName];

      if (!teamA_Bazi || !teamB_Bazi || !game_Bazi || columnIndex === undefined) {
        // Se não encontrar dados ou o mês, não preenche
        return;
      }

      // Analisar favoritismo
      const analysisA = analyzeTeamFavorability(teamA_Bazi, game_Bazi);
      const analysisB = analyzeTeamFavorability(teamB_Bazi, game_Bazi);

      let predictedWinner = 'empate';
      if (analysisA.score > analysisB.score) predictedWinner = 'a';
      if (analysisB.score > analysisA.score) predictedWinner = 'b';

      // Comparar com resultado real
      if (predictedWinner === game.resultado) {
        history[columnIndex] = { result: 'C', date: game.data };
        successCount++;
      } else {
        history[columnIndex] = { result: 'X', date: game.data };
        errorCount++;
      }
    }
  });

  const totalGames = successCount + errorCount;
  const successRate = totalGames > 0 ? Math.round((successCount / totalGames) * 100) : 0;
  const errorRate = totalGames > 0 ? 100 - successRate : 0;

  return { successRate, errorRate, history };
};

const getTrineStatsForTeam = (teamName) => {
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

      if (!teamA_Bazi || !teamB_Bazi) return;

      const analysisA = analyzeTeamFavorability(teamA_Bazi, gameBazi);
      const analysisB = analyzeTeamFavorability(teamB_Bazi, gameBazi);

      let predictedWinner = 'empate';
      if (analysisA.score > analysisB.score) predictedWinner = 'a';
      if (analysisB.score > analysisA.score) predictedWinner = 'b';

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

const TeamStatsTable = ({ title, teams }) => {
  const teamsWithStats = teams.map(team => {
    const stats = getTeamStats(team.name);
    return { ...team, ...stats };
  }).sort((a, b) => b.successRate - a.successRate);

  const [selectedTeam, setSelectedTeam] = useState(null);

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.title}>
        {title} - Taxa de Acerto Geral: {
          (() => {
            const totalSuccess = teamsWithStats.reduce((acc, team) => acc + team.history.filter(h => h.result === 'C').length, 0);
            const totalError = teamsWithStats.reduce((acc, team) => acc + team.history.filter(h => h.result === 'X').length, 0);
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
          {teamsWithStats.map((team) => {
              const teamTrineStats = getTrineStatsForTeam(team.name);
              let rowStyle = { cursor: 'pointer' };

              // Verifica se o time tem 60% ou mais de acerto na Tríade do mês atual
              if (currentMonthTrine && teamTrineStats[currentMonthTrine] && teamTrineStats[currentMonthTrine].successRate >= 50) {
                rowStyle.backgroundColor = '#e6ffed'; // Verde claro para destaque
              }

              return (
              <tr key={team.name} onClick={() => setSelectedTeam(team)} style={rowStyle}>
                <td className={styles.teamCell}>
                  <Image
                    src={team.logo}
                    alt={`Brasão do ${team.name}`}
                    width={25}
                    height={25}
                    className={styles.teamLogo}
                  />
                  {team.name}
                </td>
                <td>{team.successRate}%</td>
                <td>{team.errorRate}%</td>
                {team.history.map((gameResult, index) => (
                  <td
                    key={index}
                    className={gameResult.result === 'C' ? styles.successCell : (gameResult.result === 'X' ? styles.errorCell : '')}
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
                  </td>
                ))}
              </tr>
              );
            })}
        </tbody>
      </table>
      {selectedTeam && (
        <TrineStatsModal
          teamName={selectedTeam.name}
          stats={getTrineStatsForTeam(selectedTeam.name)}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>
  );
};

const Statistics = () => {
  return (
    <div>
      <TeamStatsTable title="Série A" teams={serieA} />
      <TeamStatsTable title="Série B" teams={serieB} />
    </div>
  );
};

export default Statistics;