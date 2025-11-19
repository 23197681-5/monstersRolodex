import Image from 'next/image';
import styles from './statistics.module.css';

const generateRandomStats = () => {
  const successRate = Math.floor(Math.random() * 101);
  const errorRate = 100 - successRate;
  const history = Array.from({ length: 10 }, () =>
    Math.random() > 0.5 ? 'C' : 'X'
  );
  return { successRate, errorRate, history };
};

const serieA = [
    { name: 'América-MG', logo: 'https://s.sde.globo.com/media/organizations/2019/02/28/America-MG-VERDE-2019-01.svg' },
    { name: 'Athletico-PR', logo: 'https://s.sde.globo.com/media/organizations/2019/09/09/Athletico-PR.svg' },
    { name: 'Atlético-MG', logo: 'https://s.sde.globo.com/media/organizations/2018/03/10/atletico-mg.svg' },
    { name: 'Bahia', logo: 'https://s.sde.globo.com/media/organizations/2018/03/11/bahia.svg' },
    { name: 'Botafogo', logo: 'https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-svg.svg' },
    { name: 'Corinthians', logo: 'https://s.sde.globo.com/media/organizations/2019/09/30/Corinthians.svg' },
    { name: 'Coritiba', logo: 'https://s.sde.globo.com/media/organizations/2018/03/11/coritiba.svg' },
    { name: 'Cruzeiro', logo: 'https://s.sde.globo.com/media/organizations/2021/02/19/cruzeiro_2021.svg' },
    { name: 'Cuiabá', logo: 'https://s.sde.globo.com/media/organizations/2018/12/26/Cuiaba_EC.svg' },
    { name: 'Flamengo', logo: 'https://s.sde.globo.com/media/organizations/2018/04/10/Flamengo-2018.svg' },
    { name: 'Fluminense', logo: 'https://s.sde.globo.com/media/organizations/2018/03/11/fluminense.svg' },
    { name: 'Fortaleza', logo: 'https://s.sde.globo.com/media/organizations/2021/09/19/Fortaleza_2021_1.svg' },
    { name: 'Goiás', logo: 'https://s.sde.globo.com/media/organizations/2021/04/29/goias-2021-novo.svg' },
    { name: 'Grêmio', logo: 'https://s.sde.globo.com/media/organizations/2018/03/12/gremio.svg' },
    { name: 'Internacional', logo: 'https://s.sde.globo.com/media/organizations/2018/03/11/internacional.svg' },
    { name: 'Palmeiras', logo: 'https://s.sde.globo.com/media/organizations/2019/07/06/Palmeiras.svg' },
    { name: 'Bragantino', logo: 'https://s.sde.globo.com/media/organizations/2020/01/01/red-bull-bragantino-2020.svg' },
    { name: 'Santos', logo: 'https://s.sde.globo.com/media/organizations/2018/03/12/santos.svg' },
    { name: 'São Paulo', logo: 'https://s.sde.globo.com/media/organizations/2018/03/11/sao-paulo.svg' },
    { name: 'Vasco da Gama', logo: 'https://s.sde.globo.com/media/organizations/2021/09/04/vasco_SVG.svg' },
  ];
  
  const serieB = [
    { name: 'ABC', logo: 'https://s.sde.globo.com/media/organizations/2018/03/10/abc.svg' },
    { name: 'Atlético-GO', logo: 'https://s.sde.globo.com/media/organizations/2020/07/02/atletico-go-2020.svg' },
    { name: 'Avaí', logo: 'https://s.sde.globo.com/media/organizations/2022/03/29/avai-2022.svg' },
    { name: 'Botafogo-SP', logo: 'https://s.sde.globo.com/media/organizations/2018/03/11/botafogo-sp.svg' },
    { name: 'Ceará', logo: 'https://s.sde.globo.com/media/organizations/2022/03/29/ceara-2022.svg' },
    { name: 'Chapecoense', logo: 'https://s.sde.globo.com/media/organizations/2020/07/29/chapecoense_nova.svg' },
    { name: 'CRB', logo: 'https://s.sde.globo.com/media/organizations/2018/03/11/crb.svg' },
    { name: 'Criciúma', logo: 'https://s.sde.globo.com/media/organizations/2018/03/11/criciuma.svg' },
    { name: 'Guarani', logo: 'https://s.sde.globo.com/media/organizations/2018/03/11/guarani.svg' },
    { name: 'Ituano', logo: 'https://s.sde.globo.com/media/organizations/2018/03/11/ituano.svg' },
    { name: 'Juventude', logo: 'https://s.sde.globo.com/media/organizations/2022/03/29/juventude-2022.svg' },
    { name: 'Londrina', logo: 'https://s.sde.globo.com/media/organizations/2018/03/11/londrina.svg' },
    { name: 'Mirassol', logo: 'https://s.sde.globo.com/media/organizations/2018/03/11/mirassol.svg' },
    { name: 'Novorizontino', logo: 'https://s.sde.globo.com/media/organizations/2018/03/11/novorizontino.svg' },
    { name: 'Ponte Preta', logo: 'https://s.sde.globo.com/media/organizations/2018/03/11/ponte-preta.svg' },
    { name: 'Sampaio Corrêa', logo: 'https://s.sde.globo.com/media/organizations/2018/03/12/sampaio-correa.svg' },
    { name: 'Sport', logo: 'https://s.sde.globo.com/media/organizations/2018/03/12/sport.svg' },
    { name: 'Tombense', logo: 'https://s.sde.globo.com/media/organizations/2018/03/12/tombense.svg' },
    { name: 'Vila Nova', logo: 'https://s.sde.globo.com/media/organizations/2018/03/12/vila-nova.svg' },
    { name: 'Vitória', logo: 'https://s.sde.globo.com/media/organizations/2018/03/12/vitoria.svg' },
  ];
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