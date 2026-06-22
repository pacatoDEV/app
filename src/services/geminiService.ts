import { GoogleGenAI } from "@google/genai";

import { getFromLocalStorage } from "../lib/storage";
import { AppConfig } from "../types";

function getAIClient() {
  const config = getFromLocalStorage<AppConfig | null>('sonda_config', null);
  const apiKey = config?.customApiKey || process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({ apiKey });
}

export async function searchSolutions(query: string): Promise<string> {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `Você é um assistente técnico especialista em Service Desk da SONDA e DASA. 
          O usuário está procurando uma solução para o seguinte problema: "${query}".
          
          Forneça um guia passo a passo claro, conciso e profissional em Markdown. 
          Se houver soluções conhecidas para sistemas DASA (como NAV, Freshservice, Sisqual, Coupa, Neovero), mencione-as.
          Use emojis para tornar o guia amigável.` }]
        }
      ],
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "Não foi possível encontrar uma solução específica para este problema. Mantenha os termos simples ou verifique os manuais internos no Freshservice.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Falha na conexão com a inteligência artificial. Verifique sua conexão com a internet ou tente novamente em alguns instantes. Se o problema persistir, a quota diária pode ter sido atingida.";
  }
}
