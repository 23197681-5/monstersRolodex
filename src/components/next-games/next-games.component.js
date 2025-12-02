import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './next-games.module.css';
import BaziPage from '../../../pages/bazi-chart';
import { serieA, serieB } from '../../lib/brasileirao-a-b-table';
  
const allTeams = [...serieA, ...serieB];
const getTeamLogo = (teamName) => {
  const team = allTeams.find((t) => t.name === teamName);
  return team ? team.logo : '/favicon.ico'; // Fallback logo
};

const getFallbackGames = () => {
  const currentYear = new Date().getFullYear();
  function addOneMonth(date) {
    // 1. Cria uma cópia da data para não modificar a original
    const newDate = new Date(date.getTime());
    
    // 2. Obtém o mês atual (0 = Jan, 11 = Dez)
    const currentMonth = newDate.getMonth();
    
    // 3. Define o mês para o próximo mês (currentMonth + 1)
    newDate.setMonth(currentMonth);
    
    // 4. Retorna a nova data
    return newDate;
}
  function parseDate(dateStr, timeStr) {
    // Exemplo: dateStr = 'Dez 02', timeStr = '19:00'
    const currentYear = new Date().getFullYear(); 
    
    // Mapeamento de abreviações em Português (e capitalização)
    const monthMap = {
    'Jan': 'Jan',
    'Fev': 'Feb', // Ou 'Feb' (Fevereiro)
    'Mar': 'Mar',
    'Abr': 'Apr', // Ou 'Apr' (Abril)
    'Mai': 'May', // Ou 'May' (Maio)
    'Jun': 'Jun',
    'Jul': 'Jul',
    'Ago': 'Aug', // Ou 'Aug' (Agosto)
    'Set': 'Sep', // Ou 'Sep' (Setembro)
    'Out': 'Oct',
    'Nov': 'Nov',
    'Dez': 'Dec'
};
    
    const [monthAbbrPt, day] = dateStr.split(' ');
    
    // Converte 'Dez' para 'Dec'
    const monthAbbrEn = monthMap[monthAbbrPt];
    
    // Monta a string no formato seguro americano: "Dec 02, 2025 19:00"
    const safeDateString = `${monthAbbrEn} ${day}, ${currentYear} ${timeStr}`;
    
    const date = addOneMonth(new Date(safeDateString));
    
    // console.log(`safeDateString: ${safeDateString}`); // Para depuração
    
    // Verifica se a data é válida antes de chamar toISOString()
    if (isNaN(date.getTime())) {
        return 'Invalid Date'; // Ou joga um erro
    }
    
    return date.toISOString();
}

  return [  
    { teamA: 'Vasco', teamB: 'Mirassol', datetime: parseDate('Dez 02', '19:00') },
    { teamA: 'Grêmio', teamB: 'Fluminense', datetime: parseDate('Dez 02', '21:30') },
    { teamA: 'Fortaleza', teamB: 'Corinthians', datetime: parseDate('Dez 03', '19:00') },
    { teamA: 'Juventude', teamB: 'Santos', datetime: parseDate('Dez 03', '19:30') },
    { teamA: 'São Paulo', teamB: 'Internacional', datetime: parseDate('Dez 03', '20:00') },
    { teamA: 'Bahia', teamB: 'Sport', datetime: parseDate('Dez 03', '20:00') },
    { teamA: 'Flamengo', teamB: 'Ceará', datetime: parseDate('Dez 03', '21:30') },
    { teamA: 'Cruzeiro', teamB: 'Botafogo', datetime: parseDate('Dez 04', '19:30') },
    { teamA: 'Fluminense', teamB: 'Bahia', datetime: parseDate('Dez 07', '16:00') },
    { teamA: 'Botafogo', teamB: 'Fortaleza', datetime: parseDate('Dez 07', '16:00') },
    { teamA: 'Corinthians', teamB: 'Juventude', datetime: parseDate('Dez 07', '16:00') },
    { teamA: 'Santos', teamB: 'Cruzeiro', datetime: parseDate('Dez 07', '16:00') },
    { teamA: 'Mirassol', teamB: 'Flamengo', datetime: parseDate('Dez 07', '16:00') },
    { teamA: 'Atlético-MG', teamB: 'Vasco', datetime: parseDate('Dez 07', '16:00') },
    { teamA: 'Internacional', teamB: 'Bragantino', datetime: parseDate('Dez 07', '16:00') },
    { teamA: 'Vitória', teamB: 'São Paulo', datetime: parseDate('Dez 07', '16:00') },
    { teamA: 'Ceará', teamB: 'Palmeiras', datetime: parseDate('Dez 07', '16:00') },
    { teamA: 'Sport', teamB: 'Grêmio', datetime: parseDate('Dez 07', '16:00') }
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
        // setIsLoading(true);
        // const response = await fetch('/api/get-upcoming-games');
        // if (!response.ok) {

          setUpcomingGames(getFallbackGames());
          // console.log('Falha ao buscar os jogos.', response);
        // }
        // const data = await response.json();
        // if (data && data.length > 0) {
        //   setUpcomingGames(data);
        // } else {
        //   setUpcomingGames(getFallbackGames());
        // }
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