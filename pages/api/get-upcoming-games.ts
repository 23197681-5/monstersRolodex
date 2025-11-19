import { GoogleGenAI } from '@google/genai';

// Inicializa o cliente Gemini com a chave da variável de ambiente.
// Use GoogleGenerativeAI se estiver usando a SDK mais recente (como no seu import).
const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY || ''});

/**
 * Transforma a data e hora do formato Gemini para um objeto Date ISO string.
 * Exemplo: data "2024-08-26", horario "21:00" -> "2024-08-26T21:00:00.000Z" (considerando BRT como UTC-3)
 */
function parseGameDateTime(gameDate: string, gameTime: string): string {
  const [year, month, day] = gameDate.split('-').map(Number);
  const [hour, minute] = gameTime.split(':').map(Number);

  // Cria a data em UTC e ajusta para o fuso horário de Brasília (UTC-3).
  // Se a hora BRT é 21:00, a hora UTC correspondente é 24:00 (ou 00:00 do dia seguinte).
  // A lógica correta é criar o objeto Date com os dados BRT e, em seguida, obter a string ISO.
  // Novo cálculo (Recomendação): Crie o objeto Date como BRT (sem o 'Z' no final)
  const dateStringBRT = `${gameDate}T${gameTime}:00`;
  
  // Isso cria a data local do servidor (que deve ser BRT ou similar)
  // Como a Vercel pode estar em UTC, é mais seguro criar a data e assumir que a hora é BRT.
  // A forma mais segura é ajustar o fuso horário:
  
  // Opção 1: Adicionar o fuso horário explicitamente (ex: -03:00)
  const date = new Date(`${gameDate}T${gameTime}:00-03:00`); 
  
  return date.toISOString();
}

function cleanJsonString(jsonString: string | undefined | null): string {
  // Remove ```json no início e ``` no final, e também remove espaços extras
  const cleanedString = jsonString
    .replace(/^```json\s*/, '')
    .replace(/\s*```$/, '')
    .trim();

  return cleanedString;
}

export default async function handler(req: any, res: any) { // Tipagem simplificada para VercelRequest, VercelResponse
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {

    // Obter a data da próxima segunda-feira.
    let now = new Date();    
    now.setDate(now.getDate() - 1); // Ajusta 'now' para ser o dia anterior

    const dayOfWeek = now.getDay(); // 0 (Dom) a 6 (Sáb)
    // Se hoje for domingo (0), avança 1 dia. Se for qualquer outro dia, avança até a próxima segunda (8 - dia atual).
    const daysUntilNextMonday = (dayOfWeek === 0) ? 1 : (8 - dayOfWeek); 
    const prompt = "Quais os jogos a partir de hoje " + now + " do Campeonato Brasileiro Série A e Série B, para a semana completa? Inclua o local do jogo. Retorne apenas jogos reais.";

    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + daysUntilNextMonday);
    const formattedDate = nextMonday.toISOString().split('T')[0];

    // --- CONFIGURAÇÃO DO MODELO ---
    const schema = {
      type: 'OBJECT',
      properties: {
        campeonato: { type: 'STRING' },
        proximas_rodadas: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              data: { type: 'STRING', description: "Data no formato AAAA-MM-DD." },
              dia_semana: { type: 'STRING' },
              jogos: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    partida: { type: 'STRING', description: "Exemplo: 'Time A x Time B'" },
                    horario_brt: { type: 'STRING', description: "Horário no fuso de Brasília (HH:MM)." },
                    local: { type: 'STRING' }
                  },
                  required: ['partida', 'horario_brt', 'local']
                }
              }
            },
            required: ['data', 'dia_semana', 'jogos']
          }
        }
      },
      required: ['campeonato', 'proximas_rodadas']
    };

    // --- FIM DA CONFIGURAÇÃO DO MODELO ---
    
    // 💡 CHAMADA À API GEMINI (Onde 'result' é definido)
    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { // Mudança de 'generationConfig' para 'config' na nova SDK
        responseMimeType: 'application/json',
        // responseSchema: schema, // Adicione o schema aqui para forçar a estrutura
      },
        });


    // --- PROCESSAMENTO DA RESPOSTA ---
    const responseText = result.text; // Use .text na nova SDK
    
    // PASSO CRÍTICO: Limpar o markdown antes de analisar
    const cleanedJsonText = cleanJsonString(responseText);
    
    // Tenta analisar o JSON limpo
    const data = JSON.parse(cleanedJsonText); 

    // Transforma os dados para o formato que o frontend espera
    const upcomingGames = data.proximas_rodadas?.flatMap((rodada: any) =>
      rodada.jogos.map((jogo: any) => {
        const [teamA, teamB] = jogo.partida.split(' x ').map((t: string) => t.trim());
        
        return {
          teamA,
          teamB,
          datetime: parseGameDateTime(rodada.data, jogo.horario_brt),
          local: jogo.local
        };
      })
    );

    // Ordena os jogos por data
    upcomingGames?.sort((a: any, b: any) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

    res.status(200).json(upcomingGames|| data);

  } catch (error) {
    console.error('Erro na chamada da API Gemini:', error);
    // Para debug, se você capturou o responseText fora do bloco try, logue-o aqui
    res.status(500).json({ error: 'Falha ao buscar os dados dos jogos.' });
  }
}