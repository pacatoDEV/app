import { GoogleGenAI } from "@google/genai";
import { getFromLocalStorage } from "../lib/storage";
import { AppConfig, Ticket } from "../types";

function getAIClient() {
  const config = getFromLocalStorage<AppConfig | null>('sonda_config', null);
  const apiKey = config?.customApiKey || process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({ apiKey });
}

export async function chatWithAssistant(message: string, history: any[], localTickets: Ticket[]): Promise<string> {
  try {
    const ai = getAIClient();
    const context = `Você é um assistente virtual especialista para técnicos do Service Desk da SONDA.
    Você tem acesso ao histórico local de chamados salvos pelo técnico neste navegador para fornecer contexto.
    
    HISTÓRICO LOCAL (Últimos 10 chamados):
    ${localTickets.slice(0, 10).map(t => `- [${t.chamado}] ${t.tipo}: ${t.nome} - ${t.descricao}`).join('\n')}

    Instruções:
    1. Responda de forma curta e técnica.
    2. Se o usuário perguntar sobre chamados específicos, consulte o histórico acima.
    3. Ajude com procedimentos da DASA e SONDA.
    4. Seja amigável e profissional.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction: context,
        temperature: 0.7,
      }
    });

    return response.text || "Desculpe, não consegui processar sua mensagem agora.";
  } catch (error) {
    console.error("Chatbot Error:", error);
    return "Desculpe, tive um problema técnico ao processar sua mensagem.";
  }
}
