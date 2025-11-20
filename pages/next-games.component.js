import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './next-games.module.css';
import BaziPage from './bazi';
import { serieA, serieB } from '../src/lib/teams';
  
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
          upcomingGames?.map((game, index) => (
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