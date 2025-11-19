import React, { useState } from 'react';
import Image from 'next/image';
import { upcomingGames } from './games.data';
import { serieA, serieB } from './teams.data';
import styles from './next-games.module.css';
import BaziPage from './bazi';

const allTeams = [...serieA, ...serieB];

const getTeamLogo = (teamName) => {
  const team = allTeams.find((t) => t.name === teamName);
  return team ? team.logo : '/favicon.ico'; // Fallback logo
};

const NextGames = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  return (
    <div className={styles.container}>
      <div className={styles.gamesList}>
        <h2 className={styles.title}>Próximos Jogos (Próxima Semana)</h2>
        {upcomingGames.map((game, index) => (
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
                  dateStyle: 'short',
                  timeStyle: 'short',
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