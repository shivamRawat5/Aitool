import { GoogleGenAI, Type } from "@google/genai";
import { AppState, CompanyAnalysis, AppMode } from "../types";

export async function generateOutreachStrategy(state: AppState): Promise<CompanyAnalysis[]> {
  const { profile, criteria, mode } = state;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const isMarketIntelligence = mode === AppMode.MARKET_INTELLIGENCE;
  
  const systemInstruction = isMarketIntelligence 
    ? `You are a Market Intelligence Analyst. Use Google Search to find REAL, existing companies. Identify their current public trajectory from blogs/news.`
    : `You are a Strategic Growth Consultant. Infer deep business bottlenecks and propose high-ROI interventions.`;

  const prompt = `
    Mode: ${mode}
    Target Industry: ${criteria.industry}
    Scale: ${criteria.companySize}
    Geo: ${criteria.geography}
    Expertise: ${profile.role} (Skills: ${profile.skills})
    
    ${isMarketIntelligence ? `
    TASK: Find 10-12 real companies in the ${criteria.industry} sector. 
    Use Google Search to find their RECENT (last 6 months) technical or business announcements (blogs, press releases, news).
    Identify:
    - What they are building/changing now.
    - Specific tech stack shifts.
    - Hiring trends related to ${profile.role}.
    - Any query context: ${criteria.specificQuery || 'None'}
    ` : `
    TASK: Identify 10 real companies and audit their likely business pain points (revenue leakage, manual bloat, scaling bottlenecks).
    `}

    Return exactly 10-12 company profiles in a JSON array.
    JSON Schema:
    {
      "companyName": "string",
      "industry": "string",
      "approxSize": "string",
      "businessModel": "string",
      "website": "string",
      "contactEmail": "string",
      "phoneNumber": "string",
      "linkedinUrl": "string",
      "instagramHandle": "string",
      "estimatedProblem": "Business-focused problem description",
      "proposedSolution": "How user skills solve this",
      "businessImpact": "Financial/Growth impact",
      "emailSubject": "Compelling subject line",
      "emailBody": "Value-first outreach draft",
      "recentNews": "Summary of news (if Intelligence mode)",
      "planningSignals": "What they are likely doing next"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        tools: isMarketIntelligence ? [{ googleSearch: {} }] : undefined,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || '[]';
    let result = JSON.parse(text);

    // If Market Intelligence, try to attach grounding chunks to companies
    if (isMarketIntelligence && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      const chunks = response.candidates[0].groundingMetadata.groundingChunks;
      const urls = chunks
        .map((c: any) => c.web?.uri)
        .filter((uri: string | undefined) => !!uri) as string[];

      // Attach some unique URLs to each result as a best effort
      if (Array.isArray(result)) {
        result = result.map((item: any, idx: number) => ({
          ...item,
          sourceUrls: urls.slice(idx * 2, (idx * 2) + 2)
        }));
      }
    }

    return result as CompanyAnalysis[];
  } catch (error) {
    console.error("Error generating strategy:", error);
    throw error;
  }
}

export async function fetchLatestCompanyNews(companyName: string): Promise<{ news: string; sources: string[] }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Find the most recent news, press releases, or blog updates for the company "${companyName}". 
  Focus on technical shifts, funding, or product launches within the last 60 days.
  Provide a concise 2-sentence summary.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a real-time news crawler.",
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            news: { type: Type.STRING },
          },
          required: ["news"]
        }
      },
    });

    const news = JSON.parse(response.text || '{"news": ""}').news;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((c: any) => c.web?.uri)
      .filter((u: any) => !!u) || [];

    return { news, sources };
  } catch (error) {
    console.error("Error fetching news:", error);
    return { news: "Could not find recent public signals.", sources: [] };
  }
}