import React from 'react';

const AnalysisDisplay = ({ analysisResult, wuXingResult }) => {
  if (!analysisResult || !wuXingResult) {
    return null;
  }

  return (
    <>
      {/* Bloco de Análise de Favoritismo */}
      <div style={{ marginTop: '20px', padding: '15px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Análise de Favoritismo</h3>
        <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
          {analysisResult.teamA.score > analysisResult.teamB.score && `${wuXingResult.teamA.name} está mais favorecido!`}
          {analysisResult.teamB.score > analysisResult.teamA.score && `${wuXingResult.teamB.name} está mais favorecido!`}
          {analysisResult.teamA.score === analysisResult.teamB.score && 'O cenário está equilibrado para ambos os times.'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4 style={{ borderBottom: '2px solid #007aff', paddingBottom: '5px' }}>{wuXingResult.teamA.name} (Pontos: {analysisResult.teamA.score})</h4>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {analysisResult.teamA.reasons.map((reason, index) => (
                <li key={index} style={{ marginBottom: '8px', fontSize: '14px' }}>{reason}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ borderBottom: '2px solid #007aff', paddingBottom: '5px' }}>{wuXingResult.teamB.name} (Pontos: {analysisResult.teamB.score})</h4>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {analysisResult.teamB.reasons.map((reason, index) => (
                <li key={index} style={{ marginBottom: '8px', fontSize: '14px' }}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bloco de Resultado Wu Xing */}
      <div style={{ marginTop: '20px', padding: '15px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Resultado Wu Xing</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center' }}>
          {/* Cabeçalhos */}
          <div><strong>Componente</strong></div>
          <div><strong>{wuXingResult.teamA.name}</strong></div>
          <div><strong>{wuXingResult.teamB.name}</strong></div>
          {/* Jogo */}
          <div><strong>Jogo</strong></div>
          <div>-</div>
          <div>-</div>

          {Object.keys(wuXingResult.game.percentages).map(element => (
            <React.Fragment key={element}>
              <div>{element}</div>
              <div>{wuXingResult.teamA.percentages[element]}%</div>
              <div>{wuXingResult.teamB.percentages[element]}%</div>
              <div>{wuXingResult.game.percentages[element]}%</div>
              <div>-</div>
              <div>-</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default AnalysisDisplay;