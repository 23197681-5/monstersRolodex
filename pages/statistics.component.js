import Image from 'next/image';
import styles from './statistics.module.css';
import { serieA, serieB } from '../src/lib/teams';

const generateRandomStats = () => {
  const successRate = Math.floor(Math.random() * 101);
  const errorRate = 100 - successRate;
  const history = Array.from({ length: 10 }, () =>
    Math.random() > 0.5 ? 'C' : 'X'
  );
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
          <th colSpan="10">Histórico Recente</th>
        </tr>
      </thead>
      <tbody>
        {teams.map((team) => {
          const { successRate, errorRate, history } = generateRandomStats();
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