const ELEMENT_VALUES = {
  wood: 'Madeira', // Ou 'Arvore'
  fire: 'Fogo',
  earth: 'Terra',
  metal: 'Metal',
  water: 'Água',
};

const STEM_ELEMENTS = {
  '甲': { element: ELEMENT_VALUES.wood, value: 100 },
  '乙': { element: ELEMENT_VALUES.wood, value: 100 },
  '丙': { element: ELEMENT_VALUES.fire, value: 100 },
  '丁': { element: ELEMENT_VALUES.fire, value: 100 },
  '戊': { element: ELEMENT_VALUES.earth, value: 100 },
  '己': { element: ELEMENT_VALUES.earth, value: 100 },
  '庚': { element: ELEMENT_VALUES.metal, value: 100 },
  '辛': { element: ELEMENT_VALUES.metal, value: 100 },
  '壬': { element: ELEMENT_VALUES.water, value: 100 },
  '癸': { element: ELEMENT_VALUES.water, value: 100 },
};

const BRANCH_ELEMENTS = {
  '子': { [ELEMENT_VALUES.water]: 100 },
  '丑': { [ELEMENT_VALUES.earth]: 70, [ELEMENT_VALUES.metal]: 30 },
  '寅': { [ELEMENT_VALUES.wood]: 80, [ELEMENT_VALUES.fire]: 20 },
  '卯': { [ELEMENT_VALUES.wood]: 100 },
  '辰': { [ELEMENT_VALUES.earth]: 70, [ELEMENT_VALUES.wood]: 20, [ELEMENT_VALUES.water]: 10 },
  '巳': { [ELEMENT_VALUES.fire]: 70, [ELEMENT_VALUES.earth]: 30 },
  '午': { [ELEMENT_VALUES.fire]: 90, [ELEMENT_VALUES.earth]: 10 },
  '未': { [ELEMENT_VALUES.earth]: 70, [ELEMENT_VALUES.wood]: 20, [ELEMENT_VALUES.fire]: 10 },
  '申': { [ELEMENT_VALUES.metal]: 90, [ELEMENT_VALUES.water]: 10 },
  '酉': { [ELEMENT_VALUES.metal]: 100 },
  '戌': { [ELEMENT_VALUES.earth]: 70, [ELEMENT_VALUES.fire]: 20, [ELEMENT_VALUES.metal]: 10 },
  '亥': { [ELEMENT_VALUES.water]: 90, [ELEMENT_VALUES.wood]: 10 },
};

const SEASON_MULTIPLIERS = {
  '寅': { element: ELEMENT_VALUES.wood, multiplier: 1.3 }, // Primavera
  '卯': { element: ELEMENT_VALUES.wood, multiplier: 1.3 },
  '辰': { element: ELEMENT_VALUES.earth, multiplier: 1.2 }, // Fim da Primavera (Terra)
  '巳': { element: ELEMENT_VALUES.fire, multiplier: 1.3 }, // Verão
  '午': { element: ELEMENT_VALUES.fire, multiplier: 1.3 },
  '未': { element: ELEMENT_VALUES.earth, multiplier: 1.2 }, // Fim do Verão (Terra)
  '申': { element: ELEMENT_VALUES.metal, multiplier: 1.3 }, // Outono
  '酉': { element: ELEMENT_VALUES.metal, multiplier: 1.3 },
  '戌': { element: ELEMENT_VALUES.earth, multiplier: 1.2 }, // Fim do Outono (Terra)
  '亥': { element: ELEMENT_VALUES.water, multiplier: 1.3 }, // Inverno
  '子': { element: ELEMENT_VALUES.water, multiplier: 1.3 },
  '丑': { element: ELEMENT_VALUES.earth, multiplier: 1.2 }, // Fim do Inverno (Terra)
};

const GENERATION_CYCLE = {
  [ELEMENT_VALUES.wood]: ELEMENT_VALUES.fire,
  [ELEMENT_VALUES.fire]: ELEMENT_VALUES.earth,
  [ELEMENT_VALUES.earth]: ELEMENT_VALUES.metal,
  [ELEMENT_VALUES.metal]: ELEMENT_VALUES.water,
  [ELEMENT_VALUES.water]: ELEMENT_VALUES.wood,
};

const CONTROL_CYCLE = {
  [ELEMENT_VALUES.wood]: ELEMENT_VALUES.earth,
  [ELEMENT_VALUES.earth]: ELEMENT_VALUES.water,
  [ELEMENT_VALUES.water]: ELEMENT_VALUES.fire,
  [ELEMENT_VALUES.fire]: ELEMENT_VALUES.metal,
  [ELEMENT_VALUES.metal]: ELEMENT_VALUES.wood,
};

const BRANCH_HARMONY = {
  '子': '丑', '丑': '子',
  '寅': '亥', '亥': '寅',
  '卯': '戌', '戌': '卯',
  '辰': '酉', '酉': '辰',
  '午': '未', '未': '午',
  '申': '巳', '巳': '申',
};

const BRANCH_CONFLICT = {
  '子': '午', '午': '子',
  '丑': '未', '未': '丑',
  '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯',
  '辰': '戌', '戌': '辰',
  '巳': '亥', '亥': '巳',
};

function getGanzhiParts(ganzhi) {
    if (!ganzhi || ganzhi.length !== 2) return { stem: null, branch: null };
    return { stem: ganzhi.charAt(0), branch: ganzhi.charAt(1) };
}

export function calculateWuXing(baziData) {
  if (!baziData) return null;

  const { gzYear, gzMonth, gzDay } = baziData;
  if (!gzYear || !gzMonth || !gzDay) return null;

  const pillars = [
      getGanzhiParts(gzYear),
      getGanzhiParts(gzMonth),
      getGanzhiParts(gzDay),
  ];

  const initialSums = {
    [ELEMENT_VALUES.wood]: 0,
    [ELEMENT_VALUES.fire]: 0,
    [ELEMENT_VALUES.earth]: 0,
    [ELEMENT_VALUES.metal]: 0,
    [ELEMENT_VALUES.water]: 0,
  };

  // Passo 1 & 2: Somar valores dos troncos e ramos
  pillars.forEach(({ stem, branch }) => {
    // Soma dos troncos
    if (stem && STEM_ELEMENTS[stem]) {
      const { element, value } = STEM_ELEMENTS[stem];
      initialSums[element] += value;
    }
    // Soma dos ramos
    if (branch && BRANCH_ELEMENTS[branch]) {
      const branchElements = BRANCH_ELEMENTS[branch];
      for (const el in branchElements) {
        initialSums[el] += branchElements[el];
      }
    }
  });

  // Passo 3: Aplicar multiplicador do mês
  const monthBranch = getGanzhiParts(gzMonth).branch;
  if (monthBranch && SEASON_MULTIPLIERS[monthBranch]) {
    const { element, multiplier } = SEASON_MULTIPLIERS[monthBranch];
    if (initialSums[element] !== undefined) {
      initialSums[element] *= multiplier;
    }
  }

  // Passo 4: Recalcular porcentagens
  const totalSum = Object.values(initialSums).reduce((sum, value) => sum + value, 0);

  if (totalSum === 0) {
    return {
      [ELEMENT_VALUES.wood]: 0,
      [ELEMENT_VALUES.fire]: 0,
      [ELEMENT_VALUES.earth]: 0,
      [ELEMENT_VALUES.metal]: 0,
      [ELEMENT_VALUES.water]: 0,
    };
  }

  const finalPercentages = {};
  for (const element in initialSums) {
    finalPercentages[element] = parseFloat(((initialSums[element] / totalSum) * 100).toFixed(1));
  }

  return finalPercentages;
}

export function analyzeTeamFavorability(teamBazi, gameBazi) {
  const teamPercentages = calculateWuXing(teamBazi);
  const gamePercentages = calculateWuXing(gameBazi);

  if (!teamPercentages || !gamePercentages) return { score: 0, reasons: [] };

  let score = 0;
  const reasons = [];

  const teamDominantElement = Object.keys(teamPercentages).reduce((a, b) => teamPercentages[a] > teamPercentages[b] ? a : b);
  const gameDominantElement = Object.keys(gamePercentages).reduce((a, b) => gamePercentages[a] > gamePercentages[b] ? a : b);

  // Regra 1: Encaixe Elementar (Geração e Controle)
  if (GENERATION_CYCLE[gameDominantElement] === teamDominantElement) {
    score += 2;
    reasons.push(`Favorável: O elemento do dia (${gameDominantElement}) gera o elemento dominante do time (${teamDominantElement}).`);
  }
  if (CONTROL_CYCLE[gameDominantElement] === teamDominantElement) {
    score -= 2;
    reasons.push(`Desfavorável: O elemento do dia (${gameDominantElement}) controla o elemento dominante do time (${teamDominantElement}).`);
  }

  // Regra 2: Compatibilidade Animal (Ramos do Ano)
  const teamYearBranch = getGanzhiParts(teamBazi.gzYear).branch;
  const gameDayBranch = getGanzhiParts(gameBazi.gzDay).branch;

  if (teamYearBranch && gameDayBranch) {
    if (BRANCH_HARMONY[teamYearBranch] === gameDayBranch) {
      score += 2;
      reasons.push(`Vantagem: O animal do time (${teamYearBranch}) está em harmonia com o animal do dia (${gameDayBranch}).`);
    }
    if (BRANCH_CONFLICT[teamYearBranch] === gameDayBranch) {
      score -= 3;
      reasons.push(`Forte Desvantagem: O animal do time (${teamYearBranch}) conflita com o animal do dia (${gameDayBranch}).`);
    }
  }

  // Regra 4: Desbalanceamento do time
  for (const element in teamPercentages) {
    // Excesso (>40%)
    if (teamPercentages[element] > 40 && CONTROL_CYCLE[gameDominantElement] === element) {
      score -= 1;
      reasons.push(`Vulnerabilidade: O time tem excesso de ${element}, que é controlado pelo elemento do dia (${gameDominantElement}).`);
    }
    // Deficiência (<15%)
    if (teamPercentages[element] < 15 && GENERATION_CYCLE[gameDominantElement] === element) {
      score -= 1;
      reasons.push(`Instabilidade: O time tem deficiência de ${element}, e o dia o gera (${gameDominantElement}), causando desequilíbrio.`);
    }
  }

  // Regra 5: Força do Mês
  const gameMonthBranch = getGanzhiParts(gameBazi.gzMonth).branch;
  if (gameMonthBranch && SEASON_MULTIPLIERS[gameMonthBranch]) {
    const monthDominantElement = SEASON_MULTIPLIERS[gameMonthBranch].element;
    if (GENERATION_CYCLE[monthDominantElement] === teamDominantElement) {
      score += 1;
      reasons.push(`Vantagem Sazonal: O elemento do mês (${monthDominantElement}) gera o elemento dominante do time (${teamDominantElement}).`);
    }
    if (CONTROL_CYCLE[monthDominantElement] === teamDominantElement) {
      score -= 1;
      reasons.push(`Desvantagem Sazonal: O elemento do mês (${monthDominantElement}) controla o elemento dominante do time (${teamDominantElement}).`);
    }
  }

  if (reasons.length === 0) {
      reasons.push("Análise neutra: Não foram encontrados fatores de favoritismo ou desvantagem significativos.");
  }

  return { score, reasons };
}