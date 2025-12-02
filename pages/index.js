import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import SearchBox from '../src/components/search-box/search-box.component';
import MapaBazi from '../src/components/mapa-compoonent/mapa-bazi.component';
import Statistics from './statistics.module';
import BaziPage from './bazi-chart';
import NextGames from '../src/components/next-games/next-games.component';
import CadastrarTime from '../src/lib/cadastrar-time';
import { calculateWuXing, analyzeTeamFavorability } from '../src/lib/wuxing';
import { supabase } from '../src/lib/supabaseClient';
import AnalysisDisplay from '../src/components/analysis-display/AnalysisDisplay';
import { hardcodedTeams } from '../src/lib/hardcoded-teams'
import { DEFAULT_ANALYZE_SCORES } from '../src/lib/wuxing.js';
export default function Home() {
  const [monsters, setMonsters] = useState([]);
  const [filteredMonsters, setFilteredMonsters] = useState(monsters);
  const [searchField, setSearchField] = useState('');
  const [searchFieldA, setSearchFieldA] = useState('');
  const [searchFieldB, setSearchFieldB] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [filteredTeamsACount, setFilteredTeamsACount] = useState(0);
  const [filteredTeamsBCount, setFilteredTeamsBCount] = useState(0);
  const [selectedGameForBazi, setSelectedGameForBazi] = useState(null);
  const [wuXingResult, setWuXingResult] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [gameBaziData, setGameBaziData] = useState(null);
  const [allTeamsData, setAllTeamsData] = useState([]);
  const [selectedTeamA, setSelectedTeamA] = useState(null);
  const [selectedTeamB, setSelectedTeamB] = useState(null);
  const [triggerCalculation, setTriggerCalculation] = useState(false);
  const [activeTab, setActiveTab] = useState('wuXing');

  console.log('render');
  useEffect(() => {
    // setLoading(true);
    // fetch('https://jsonplaceholder.typicode.com/users')
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setMonsters(data);
    //     setLoading(false);
    //   });
  }, []);

  useEffect(() => {
    const newfilteredMonsters = monsters.filter((monster) => {
      return monster.name.toLocaleLowerCase().includes(searchField);
    });
    setFilteredMonsters(newfilteredMonsters);
  }, [monsters, searchField]);

  if (isLoading) return <p>Looking for bazis...</p>;
  if (!monsters) return <p>No bazis around here</p>;

  var onSearchChangeA = (event) => {
    var value = event.target.value.toLocaleLowerCase();
    setSearchFieldA(value);
  };

  var onSearchChangeB = (event) => {
    var value = event.target.value.toLocaleLowerCase();
    setSearchFieldB(value);
  };

  const handleDataLoaded = (teams) => {
    setAllTeamsData(prevTeams => {
      const existingIds = new Set(prevTeams.map(t => t.id));
      const newTeams = teams.filter(t => !existingIds.has(t.id));
      if (newTeams.length > 0) {
        return [...prevTeams, ...newTeams];
      }
      return prevTeams;
    });
  };

  // Efeito para limpar os resultados ao sair da aba "Wu Xing"
  useEffect(() => {
    if (activeTab !== 'wuXing') {
      setWuXingResult(null);
      setAnalysisResult(null);
    }
  }, [activeTab]);

  // Efeito para disparar o cálculo automático quando vindo da tela "Next Games"
  useEffect(() => {
    if (triggerCalculation && selectedTeamA && selectedTeamB && gameBaziData) {
      console.log("Disparando cálculo automático: Times e Bazi do jogo estão prontos.");
      // Desativa o gatilho para não recalcular em cada render
      setTriggerCalculation(false);
      // Chama a função de cálculo com os nomes dos times já selecionados
      handleCalculateWuXing({ teamAName: selectedTeamA.nome, teamBName: selectedTeamB.nome });
    }
  }, [triggerCalculation, selectedTeamA, selectedTeamB, gameBaziData]);

  const handleCalculateWuXing = async (gameOrTeamNames) => {
    setAnalysisResult(null);
    setWuXingResult(null);

    let teamAName, teamBName;

    // Verifica se o argumento é um objeto de jogo (vindo de NextGames)
    // e não um evento de clique.
    const isGameClick = gameOrTeamNames && typeof gameOrTeamNames === 'object' && gameOrTeamNames.teamA;
    if (isGameClick) {
      console.log('Dados do jogo recebidos para cálculo:', gameOrTeamNames);
      teamAName = gameOrTeamNames.teamA;
      teamBName = gameOrTeamNames.teamB;
      setSearchFieldA(teamAName);
      setSearchFieldB(teamBName);
      setSelectedGameForBazi(gameOrTeamNames); // Passa a data do jogo para o BaziPage central
      setActiveTab('wuXing');
      // Ativa o gatilho para que o useEffect realize o cálculo quando os dados estiverem prontos
      setTriggerCalculation(true);
      return;
    } else if (gameOrTeamNames && gameOrTeamNames.teamAName) {
      // Chamada interna pelo useEffect
      teamAName = gameOrTeamNames.teamAName;
      teamBName = gameOrTeamNames.teamBName;
    } else {
      teamAName = selectedTeamA?.nome; // Usa o nome do time selecionado no card
      teamBName = selectedTeamB?.nome; // Usa o nome do time selecionado no card
      console.log(`Calculando para os times: ${teamAName} vs ${teamBName}`);
    }

    if (!teamAName || !teamBName || !gameBaziData) {
      console.log(teamAName, teamBName, gameBaziData)
      alert("Por favor, selecione um time em cada lado e certifique-se de que o Bazi do dia foi calculado.");
      return;
    }

    try {
      let { data: teamsData, error } = await supabase
        .from('times')
        .select('nome, elemento_ano, animal_ano, elemento_mes, animal_mes, elemento_dia, animal_dia')
        .in('nome', [teamAName, teamBName]);

      if (error) throw error;

      // Fallback: Se não encontrar um ou ambos os times, procure nos dados já carregados
      if (teamsData.length < 2) {
        console.warn(`Busca inicial no DB incompleta. Encontrados ${teamsData.length} de 2 times. Tentando fallback...`);
        const foundNames = new Set(teamsData.map(t => t.nome));
        const missingNames = [teamAName, teamBName].filter(name => !foundNames.has(name));

        missingNames.forEach(name => {
          const fallbackTeam = hardcodedTeams.find(t => t.nome === name);
          if (fallbackTeam) {
            console.log(`Time "${name}" encontrado nos dados de fallback.`);
            teamsData.push(fallbackTeam);
          }
        });

        if (teamsData.length < 2) {
          console.error('Falha ao buscar dados Bazi completos, mesmo com fallback.');
          alert("Não foi possível encontrar os dados Bazi para um ou ambos os times.");
          return;
        }
      }

      const getTeamData = (name) => {
        const team = teamsData.find(t => t.nome === name);
        if (!team) return null;
        return {
          gzYear: `${team.elemento_ano}${team.animal_ano}`,
          gzMonth: `${team.elemento_mes}${team.animal_mes}`,
          gzDay: `${team.elemento_dia}${team.animal_dia}`,
        };
      };

      const teamAData = getTeamData(teamAName);
      const teamBData = getTeamData(teamBName);

      if (!teamAData || !teamBData) {
        console.error('Dados Bazi incompletos para um dos times.');
        console.log('Dados Time A:', teamAData);
        console.log('Dados Time B:', teamBData);
        console.log('Informações esperadas: um objeto para cada time com os campos "gzYear", "gzMonth", "gzDay".');
        alert("Dados Bazi incompletos para um dos times.");
        return;
      }

    // Calcula as porcentagens de Wu Xing
    const gameCalculation =  calculateWuXing(gameBaziData, null, DEFAULT_ANALYZE_SCORES);

    // Analisa o favoritismo e obtém os scores e razões para ambos
    const [analysisA, analysisB] = [
      analyzeTeamFavorability(teamAData, gameBaziData, DEFAULT_ANALYZE_SCORES),
      analyzeTeamFavorability(teamBData, gameBaziData, DEFAULT_ANALYZE_SCORES)
    ];
    if (!analysisA || !analysisB) {
      alert("Falha ao analisar o jogo.");
      return;
    }

    // Armazena os resultados do cálculo
    setWuXingResult({
      teamA: { name: teamAName, percentages: calculateWuXing(teamAData, gameBaziData, DEFAULT_ANALYZE_SCORES) },
      teamB: { name: teamBName, percentages: calculateWuXing(teamBData, gameBaziData, DEFAULT_ANALYZE_SCORES) },
      game: { name: 'Jogo', percentages: gameCalculation },
    });    setAnalysisResult({ teamA: analysisA, teamB: analysisB });
    
    console.log('Dados do Time A e B selecionados:', { teamA: selectedTeamA, teamB: selectedTeamB });

    } catch (err) {
      console.error("Erro ao buscar ou calcular o Wu Xing:", err);
      alert(`Ocorreu um erro: ${err.message}`);
    }
  };

  const tabButtonStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '16px',
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #d1d1d1',
    background: 'linear-gradient(to bottom, #ffffff, #f0f0f0)',
    color: '#333',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    margin: '0 5px',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
  };

  const activeTabButtonStyle = {
    ...tabButtonStyle,
    background: 'linear-gradient(to bottom, #e8e8e8, #d1d1d1)',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
    color: '#000',
    fontWeight: '600',
  };

  const getButtonStyle = (tabName) => {
    return activeTab === tabName ? activeTabButtonStyle : tabButtonStyle;
  };


  return (
    <>
      <div
        className={styles.monsterly}
        style={{
          backgroundColor: '#f5f5f7',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          color: '#111',
          minHeight: '100vh'
        }}
      >
        <Head>
          <title>Calculadora de Wu Xing (五行)</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Bigelow+Rules&family=EB+Garamond&display=swap"
            rel="stylesheet"
          />
        </Head>
        <main className={styles.main}>
          <div
            className={styles.tabs}
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              justifyContent: 'flex-start',
            }}
          >
            <button
              style={getButtonStyle('wuXing')}
              onClick={() => setActiveTab('wuXing')}
            >
              Wu Xing
            </button>
            <button
              style={getButtonStyle('statistics')}
              onClick={() => setActiveTab('statistics')}
            >
              Estatísticas
            </button>
            <button
              style={getButtonStyle('nextGames')}
              onClick={() => setActiveTab('nextGames')}
            >
              Next Games
            </button>
            <button
              style={getButtonStyle('cadastrarTime')}
              onClick={() => setActiveTab('cadastrarTime')}
            >
              Cadastrar Time
            </button>
          </div>

          {activeTab === 'wuXing' && (
            <div className={styles.threeCol}>
              <div>
                <SearchBox
                  placeholder={'Search for a team (A)'}
                  onChangeHandler={onSearchChangeA}
                ></SearchBox>
                <MapaBazi filter={searchFieldA} onFilterCountChange={setFilteredTeamsACount} onDataLoaded={handleDataLoaded} onTeamSelected={setSelectedTeamA} />
              </div>
              <div>
                <BaziPage initialDateTime={selectedGameForBazi?.datetime} onBaziCalculated={setGameBaziData} />
                {filteredTeamsACount === 1 && filteredTeamsBCount === 1 && (
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
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
                        width: '100%'
                      }}
                      onClick={handleCalculateWuXing}
                    >
                      Calcular Wu Xing
                    </button>
                  </div>
                )}
                <AnalysisDisplay analysisResult={analysisResult} wuXingResult={wuXingResult} />
              </div>
              <div>
                <SearchBox
                  placeholder={'Search for a team (B)'}
                  onChangeHandler={onSearchChangeB}
                ></SearchBox>
                <MapaBazi filter={searchFieldB} onFilterCountChange={setFilteredTeamsBCount} onDataLoaded={handleDataLoaded} onTeamSelected={setSelectedTeamB} />
              </div>
            </div>
          )}

          {activeTab === 'statistics' && <Statistics />}
          {activeTab === 'nextGames' && <NextGames onCalculateWuXing={handleCalculateWuXing} />}
          {activeTab === 'cadastrarTime' && <CadastrarTime />}

          <hr style={{ width: '90%', margin: '2rem auto' }} />
          <h1 className={styles.monstersTitle}>86</h1>
          {/* */}
        </main>

        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </span>
          </a>
        </footer>
      </div>
    </>
  );
}
