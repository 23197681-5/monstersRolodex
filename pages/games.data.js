const getNextDate = (day, hour) => {
    const date = new Date();
    date.setDate(date.getDate() + day);
    date.setHours(hour, 0, 0, 0);
    return date.toISOString();
  };
  
  export const upcomingGames = [
    // Série A
    { teamA: 'Flamengo', teamB: 'Palmeiras', datetime: getNextDate(1, 21) },
    { teamA: 'Corinthians', teamB: 'São Paulo', datetime: getNextDate(2, 19) },
    { teamA: 'Vasco da Gama', teamB: 'Fluminense', datetime: getNextDate(3, 16) },
    { teamA: 'Grêmio', teamB: 'Internacional', datetime: getNextDate(4, 20) },
    { teamA: 'Atlético-MG', teamB: 'Cruzeiro', datetime: getNextDate(5, 18) },
  
    // Série B
    { teamA: 'Sport', teamB: 'Vitória', datetime: getNextDate(1, 19) },
    { teamA: 'Ceará', teamB: 'Fortaleza', datetime: getNextDate(2, 21) },
    { teamA: 'Guarani', teamB: 'Ponte Preta', datetime: getNextDate(3, 20) },
    { teamA: 'Avaí', teamB: 'Chapecoense', datetime: getNextDate(4, 17) },
    { teamA: 'CRB', teamB: 'ABC', datetime: getNextDate(5, 16) },
  ];
  