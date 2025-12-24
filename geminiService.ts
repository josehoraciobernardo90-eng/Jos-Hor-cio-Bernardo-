import { GoogleGenAI } from "@google/genai";

export const getGymInsights = async (stats: {
  totalClients: number,
  activeMonthly: number,
  dailyToday: number,
  revenueMonthly: number,
  revenueDaily: number
}) => {
  // Inicialização segura dentro da função para evitar crash no import global
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  
  if (!apiKey) {
    console.warn("API Key não configurada. Insights desativados.");
    return "Configure sua API Key para receber insights estratégicos.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise o desempenho deste ginásio com os seguintes dados de Moçambique:
      - Total de Clientes: ${stats.totalClients}
      - Clientes Mensais Ativos: ${stats.activeMonthly}
      - Check-ins Diários Hoje: ${stats.dailyToday}
      - Receita Mensal: ${stats.revenueMonthly.toFixed(2)} MT
      - Receita Diária Hoje: ${stats.revenueDaily.toFixed(2)} MT
      
      Forneça 3 dicas curtas e práticas para aumentar a receita. Responda em Português de Moçambique com tom profissional.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Dica: Mantenha o foco no atendimento personalizado hoje!";
  }
};