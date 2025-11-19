import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './next-games.module.css';
import BaziPage from './bazi';
  
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
    { name: 'Novorizontino', logo: 'https://s.sde.globo.com/media/organizations/2019/01/08/Novohorizontino.svg' },
    { name: 'Ponte Preta', logo: 'https://s.sde.globo.com/media/organizations/2018/03/11/ponte-preta.svg' },
    { name: 'Sampaio Corrêa', logo: 'https://s.sde.globo.com/media/organizations/2018/03/12/sampaio-correa.svg' },
    { name: 'Sport', logo: 'https://s.sde.globo.com/media/organizations/2018/03/12/sport.svg' },
    { name: 'Tombense', logo: 'https://s.sde.globo.com/media/organizations/2018/03/12/tombense.svg' },
    { name: 'Vila Nova', logo: 'https://s.sde.globo.com/media/organizations/2018/03/12/vila-nova.svg' },
    { name: 'Vitória', logo: 'https://s.sde.globo.com/media/organizations/2018/03/12/vitoria.svg' },
  ];
  
const allTeams = [...serieA, ...serieB];
const getTeamLogo = (teamName) => {
  const team = allTeams.find((t) => t.name === teamName);
  return team ? team.logo : '/favicon.ico'; // Fallback logo
};

const NextGames = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/get-upcoming-games');
        if (!response.ok) {
          throw new Error('Falha ao buscar os jogos.', response);
        }
        const data = await response.json();
        setUpcomingGames(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  return (
    <div className={styles.container}>
      <div className={styles.gamesList}>
        <h2 className={styles.title}>Próximos Jogos (Próxima Semana)</h2>
        {isLoading && <p>Buscando jogos...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!isLoading && !error && upcomingGames.length === 0 && <p>Nenhum jogo encontrado para a próxima semana.</p>}
        {!isLoading && !error &&
          upcomingGames.map((game, index) => (
            <div
              key={index}
              className={`${styles.gameItem} ${
                selectedGame && selectedGame.datetime === game.datetime
                  ? styles.selected
                  : ''
              }`}
              onClick={() => handleGameSelect(game)}
            >
              <div className={styles.teams}>
                <Image
                  src={getTeamLogo(game.teamA)}
                  alt={game.teamA}
                  width={30}
                  height={30}
                />
                <span className={styles.vs}>vs</span>
                <Image
                  src={getTeamLogo(game.teamB)}
                  alt={game.teamB}
                  width={30}
                  height={30}
                />
              </div>
              <div className={styles.gameInfo}>
                <span
                  className={styles.teamNames}
                >{`${game.teamA} x ${game.teamB}`}</span>
                <span className={styles.datetime}>
                  {new Date(game.datetime).toLocaleString('pt-BR', {
                    weekday: 'short',
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
      </div>
      <div className={styles.baziContainer}>
        {selectedGame ? (
          <BaziPage initialDateTime={selectedGame.datetime} />
        ) : (
          <div className={styles.placeholder}>
            Selecione um jogo para ver o Bazi
          </div>
        )}
      </div>
    </div>
  );
};

export default NextGames;