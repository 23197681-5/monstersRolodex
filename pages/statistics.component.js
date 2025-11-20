import Image from 'next/image';
import styles from './statistics.module.css';
import { serieA, serieB } from '../src/lib/teams';

const getTeamStats = (teamName) => {
  // 1. Define o histórico com base no nome do time
  let history = Array(38).fill('');

  if (teamName === 'Bragantino') {
    history = ['C', ...Array(37).fill('')]; // Only one 'X'
  } else if (teamName === 'Santos' || teamName === 'Mirassol') {
    history = ['X', ...Array(37).fill('')]; // Only one 'X'
  }

  // 2. Calcula as estatísticas a partir do histórico
  const successCount = history.filter(result => result === 'C').length;
  const errorCount = history.filter(result => result === 'X').length;
  const totalGames = successCount + errorCount;

  let successRate = 0;
  let errorRate = 0;

  if (totalGames > 0) {
    successRate = Math.round((successCount / totalGames) * 100);
    errorRate = 100 - successRate; // Garante que a soma seja sempre 100%
  }

  // 3. Retorna os dados calculados
  return { successRate, errorRate, history };
};

const TeamStatsTable = ({ title, teams }) => (
  <div className={styles.tableContainer}>
    <h2 className={styles.title}>{title}</h2>
    <table className={styles.statsTable}>
      <thead>
        <tr>
          <th>Time</th>
          <th>% Acerto</th>
          <th>% Erro</th>
          <th colSpan="38">Histórico Recente</th>
        </tr>
      </thead>
      <tbody>
        {teams.map((team) => {
          const { successRate, errorRate, history } = getTeamStats(team.name);
          return (
            <tr key={team.name}>
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
              <td>{successRate}%</td>
              <td>{errorRate}%</td>
              {history.map((result, index) => (
                <td
                  key={index}
                  className={
                    result === 'C' ? styles.successCell : styles.errorCell
                  }
                >
                  {result}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const Statistics = () => {
  return (
    <div>
      <TeamStatsTable title="Série A" teams={serieA} />
      <TeamStatsTable title="Série B" teams={serieB} />
    </div>
  );
};

export default Statistics;