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

const getFallbackGames = () => {
  const currentYear = new Date().getFullYear();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const parseDate = (dateStr, timeStr) => {
    const [hour, minute] = timeStr.split(':');
    let date;
    if (dateStr === 'Tomorrow') {
      date = new Date(tomorrow);
      date.setHours(hour, minute, 0, 0);
    } else {
      date = new Date(`${dateStr}, ${currentYear} ${timeStr}`);
    }
    return date.toISOString();
  };

  return [
    { teamA: 'Corinthians', teamB: 'São Paulo', datetime: parseDate('Tomorrow', '18:30') },
    { teamA: 'Ceará', teamB: 'Internacional', datetime: parseDate('Tomorrow', '20:30') },
    { teamA: 'Botafogo', teamB: 'Grêmio', datetime: parseDate('Nov 22', '18:30') },
    { teamA: 'Palmeiras', teamB: 'Fluminense', datetime: parseDate('Nov 22', '20:30') },
    { teamA: 'Flamengo', teamB: 'Bragantino', datetime: parseDate('Nov 22', '20:30') },
    { teamA: 'Bahia', teamB: 'Vasco da Gama', datetime: parseDate('Nov 23', '15:00') },
    { teamA: 'São Paulo', teamB: 'Juventude', datetime: parseDate('Nov 23', '15:00') },
    { teamA: 'Sport', teamB: 'Vitória', datetime: parseDate('Nov 23', '17:30') },
    { teamA: 'Cruzeiro', teamB: 'Corinthians', datetime: parseDate('Nov 23', '19:30') },
    { teamA: 'Mirassol', teamB: 'Ceará', datetime: parseDate('Nov 24', '18:00') },
    { teamA: 'Internacional', teamB: 'Santos', datetime: parseDate('Nov 24', '20:00') },
    { teamA: 'Atlético-MG', teamB: 'Flamengo', datetime: parseDate('Nov 25', '20:30') },
    { teamA: 'Grêmio', teamB: 'Palmeiras', datetime: parseDate('Nov 25', '20:30') },
    { teamA: 'Bragantino', teamB: 'Fortaleza', datetime: parseDate('Nov 26', '18:00') },
    { teamA: 'Fluminense', teamB: 'São Paulo', datetime: parseDate('Nov 27', '19:30') },
    { teamA: 'Juventude', teamB: 'Bahia', datetime: parseDate('Nov 28', '18:00') },
    { teamA: 'Vasco da Gama', teamB: 'Internacional', datetime: parseDate('Nov 28', '18:30') },
    { teamA: 'Santos', teamB: 'Sport', datetime: parseDate('Nov 28', '20:30') },
    { teamA: 'Vitória', teamB: 'Mirassol', datetime: parseDate('Nov 29', '15:00') },
    { teamA: 'Ceará', teamB: 'Cruzeiro', datetime: parseDate('Nov 29', '19:30') },
    { teamA: 'Fortaleza', teamB: 'Atlético-MG', datetime: parseDate('Nov 30', '17:30') },
    { teamA: 'Corinthians', teamB: 'Botafogo', datetime: parseDate('Nov 30', '15:00') },
  ];
};

const NextGames = ({ onCalculateWuXing }) => {
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

          setUpcomingGames(getFallbackGames());
          console.log('Falha ao buscar os jogos.', response);
        }
        const data = await response.json();
        if (data && data.length > 0) {
          setUpcomingGames(data);
        } else {
          setUpcomingGames(getFallbackGames());
        }
      } catch (err) {
        setError(err.message);
        setUpcomingGames(getFallbackGames()); // Usa o fallback em caso de erro na API
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
                  alt={game.teamA+'team'}
                  width={30}
                  height={30}
                />
                <span className={styles.vs}>vs</span>
                <Image
                  src={getTeamLogo(game.teamB)}
                  alt={`Logo do ${game.teamB}`}
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
          <div>
          <BaziPage initialDateTime={selectedGame.datetime} />
          <button
            onClick={() => onCalculateWuXing(selectedGame)}
            style={{
              padding: '12px 18px',
              fontSize: '16px',
              borderRadius: '12px',
              background: '#007aff',
              color: '#fff',
              border: 'none',
              boxShadow: '0 6px 14px rgba(0,122,255,0.2)',
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              marginTop: '20px',
              width: '100%'
            }}
          >
            Calcular Wu Xing
          </button>
          </div>
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