import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
// Import data and functions
import { hardcodedTeams } from '../src/lib/hardcoded-teams.js';
import {
    DEFAULT_ANALYZE_SCORES,
    calculateWuXing,
    getDayMasterStrength, // Presume-se que esta função foi atualizada para incluir followPower/followOutput
    getUsefulElements,
    STEM_ELEMENTS,
} from '../src/lib/wuxing.js';

// Setup for file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista completa de todas as determinações de força possíveis para teste exaustivo
const ALL_STRENGTHS_TO_TEST = [
    'extremelyStrong',
    'strong',
    'balanced',
    'weak',
    'extremelyWeak',
    'followPower',
    'followOutput',
];

/**
 * Função utilitária para calcular discrepâncias entre elementos úteis.
 * @param {Array<string>} hardcodedBeneficos - Elementos benéficos esperados.
 * @param {Array<string>} hardcodedMaleficos - Elementos maléficos esperados.
 * @param {object} calculatedUseful - Resultado de getUsefulElements.
 * @returns {object} Contagem e lista de elementos úteis que faltaram.
 */
function checkDiscrepancies(hardcodedBeneficos, hardcodedMaleficos, calculatedUseful) {
    const missingBeneficos = hardcodedBeneficos.filter(el => !calculatedUseful.favorable.includes(el));
    const missingMaleficos = hardcodedMaleficos.filter(el => !calculatedUseful.unfavorable.includes(el));
    const missingCount = missingBeneficos.length + missingMaleficos.length;

    return { missingBeneficos, missingMaleficos, missingCount };
}

function main() {
    
    const teamAnalysisResults = [];

    // 1. Filtrar equipes com elementos hardcoded
    const teamsToTest = hardcodedTeams.filter(team =>
        (team.elementos_beneficos && Object.keys(team.elementos_beneficos).length > 0) ||
        (team.elementos_maleficos && Object.keys(team.elementos_maleficos).length > 0)
    );

    console.log(`Found ${teamsToTest.length} teams with hardcoded elements to test.`);

    teamsToTest.forEach(team => {
        if (!team.elemento_dia || !team.animal_dia) {
            console.log(`Skipping ${team.nome}: Missing Day Pillar data.`);
            return;
        }

        // 2. Preparar dados Bazi
        const teamBazi = {
            gzYear: `${team.elemento_ano}${team.animal_ano}`,
            gzMonth: team.elemento_mes && team.animal_mes ? `${team.elemento_mes}${team.animal_mes}` : null,
            gzDay: `${team.elemento_dia}${team.animal_dia}`,
            gzHour: team.elemento_hora && team.animal_hora ? `${team.elemento_hora}${team.animal_hora}` : null,
        };

        // 3. Análise Inicial e Hardcoded
        const teamPercentages = calculateWuXing(teamBazi, null, DEFAULT_ANALYZE_SCORES);
        const dayStem = teamBazi.gzDay.charAt(0);
        const dayMasterElement = STEM_ELEMENTS[dayStem].element;
        
        const hardcodedBeneficos = Object.keys(team.elementos_beneficos || {});
        const hardcodedMaleficos = Object.keys(team.elementos_maleficos || {});
        
        // **Força Original Calculada**
        const originalStrength = getDayMasterStrength(dayMasterElement, teamPercentages, teamBazi.gzMonth, teamBazi.gzDay, DEFAULT_ANALYZE_SCORES);
        const originalUseful = getUsefulElements(dayMasterElement, originalStrength);
        const originalDiscrepancy = checkDiscrepancies(hardcodedBeneficos, hardcodedMaleficos, originalUseful);
        
        let bestTestResult = { 
            strength: originalStrength, 
            missingCount: originalDiscrepancy.missingCount,
            missingBeneficos: originalDiscrepancy.missingBeneficos,
            missingMaleficos: originalDiscrepancy.missingMaleficos,
            usefulElements: originalUseful,
            isOriginal: true 
        };

        const forcedTestResults = [];

        // 4. Loop de Teste Exaustivo: Testar todas as 7 forças
        ALL_STRENGTHS_TO_TEST.forEach(testedStrength => {
            
            // Ignorar se a força testada for a mesma que a original, pois já foi calculada.
            // if (testedStrength === originalStrength) return; 
            // Calcular elementos úteis com a força testada (forçada)
            const testedUseful = getUsefulElements(dayMasterElement, testedStrength);
            const testedDiscrepancy = checkDiscrepancies(hardcodedBeneficos, hardcodedMaleficos, testedUseful);
            
            forcedTestResults.push({
                strength: testedStrength,
                missingCount: testedDiscrepancy.missingCount,
                missingBeneficos: testedDiscrepancy.missingBeneficos,
                missingMaleficos: testedDiscrepancy.missingMaleficos,
                usefulElements: testedUseful,
            });
            // Se este teste tiver menos elementos faltando, ele se torna o melhor resultado
            // Priorizamos a força original se a contagem de erros for a mesma (missingCount == 0)
            if (testedDiscrepancy.missingCount < bestTestResult.missingCount) {
                console.log(`New best strength found: ${testedStrength} with ${testedDiscrepancy.missingCount} missing elements.`);
                bestTestResult = {
                    strength: testedStrength,
                    missingCount: testedDiscrepancy.missingCount,
                    missingBeneficos: testedDiscrepancy.missingBeneficos,
                    missingMaleficos: testedDiscrepancy.missingMaleficos,
                    usefulElements: testedUseful,
                    isOriginal: testedStrength === originalStrength,
                };
            }
        });
        
        // 5. Testar o Animal Corretivo (mantendo a lógica original)
        let correctiveAnimalAnalysis = null;
        if (bestTestResult.missingCount > 0) {
            
            let bestCorrectiveAnimal = null;
            let minMissingCount = bestTestResult.missingCount;
            let bestStrengthWithAnimal = bestTestResult.strength;

            for (const animal of branches) {
                const hypotheticalTeamBazi = { ...teamBazi, gzHour: `${dayStem}${animal}` };
                const newTeamPercentages = calculateWuXing(hypotheticalTeamBazi, null, DEFAULT_ANALYZE_SCORES);
                
                // Testar a força original calculada com o novo animal de hora
                const newStrength = getDayMasterStrength(dayMasterElement, newTeamPercentages, hypotheticalTeamBazi.gzMonth, hypotheticalTeamBazi.gzDay, DEFAULT_ANALYZE_SCORES);
                const newCalculatedUseful = getUsefulElements(dayMasterElement, newStrength);
                const newDiscrepancy = checkDiscrepancies(hardcodedBeneficos, hardcodedMaleficos, newCalculatedUseful);
                
                if (newDiscrepancy.missingCount < minMissingCount) {
                    minMissingCount = newDiscrepancy.missingCount;
                    bestCorrectiveAnimal = animal;
                    bestStrengthWithAnimal = newStrength;
                }
            }

            if (bestCorrectiveAnimal) {
                 correctiveAnimalAnalysis = {
                    animal: bestCorrectiveAnimal,
                    strength: bestStrengthWithAnimal,
                    missing_count: minMissingCount
                };
            }
        }
        
        // 6. Registrar o resultado final (incluindo todos os testes)
        const teamData = {
            team: team.nome,
            hardcoded: {
                beneficos: team.elementos_beneficos,
                maleficos: team.elementos_maleficos,
            },
            calculated_data: {
                dayMasterElement: dayMasterElement,
                percentages: teamPercentages,
            },
            original_analysis: {
                strength: originalStrength,
                missing_count: originalDiscrepancy.missingCount,
                missing_beneficos: originalDiscrepancy.missingBeneficos,
            },
            best_strength_match: {
                strength_used: bestTestResult.strength,
                missing_count: bestTestResult.missingCount,
                is_original: bestTestResult.isOriginal,
                favorable: bestTestResult.usefulElements.favorable,
                unfavorable: bestTestResult.usefulElements.unfavorable,
            },
            all_strength_tests: forcedTestResults,
            ...(correctiveAnimalAnalysis && { corrective_animal_test: correctiveAnimalAnalysis }),
        };
        
        teamAnalysisResults.push(teamData);

        if (bestTestResult.missingCount > 0) {
            console.log(`[❌ Erro] ${team.nome}: Falhas (${bestTestResult.missingCount}). Melhor força encontrada: ${bestTestResult.strength_used}`);
        } else {
             console.log(`[✅ Sucesso] ${team.nome}: A força ${bestTestResult.strength} acertou todos os elementos.`);
        }
    });

    // 7. Geração do arquivo de saída
    const outputData = {
        analysis_date: new Date().toISOString(),
        total_teams_tested: teamsToTest.length,
        analysis_results: teamAnalysisResults,
    };
    const outputPath = path.join(__dirname, '..', 'full-strength-analysis.json');
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

    console.log(`\nAnálise completa. Resultados detalhados salvos em: ${outputPath}`);
}

main();