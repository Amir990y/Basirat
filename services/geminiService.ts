import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse } from "../types";

// Define the strict schema for the 7-point analysis
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    factCheck: {
      type: Type.STRING,
      description: "Answer to Q1: Contains lies/distortions? Refutation sources.",
    },
    insultCheck: {
      type: Type.STRING,
      description: "Answer to Q2: Insult to sacred values? Details.",
    },
    softWarCheck: {
      type: Type.STRING,
      description: "Answer to Q3: Soft war/Cultural NATO signs.",
    },
    sourceOrigin: {
      type: Type.STRING,
      description: "Answer to Q4: Origin/Source of claim (Hostile media vs others).",
    },
    argument: {
      type: Type.STRING,
      description: "Answer to Q5: Short, strong logical/political argument (10-12 lines).",
    },
    suggestedResponse: {
      type: Type.STRING,
      description: "Answer to Q6: Polite, revolutionary, documented comment draft.",
    },
    religiousQuote: {
      type: Type.STRING,
      description: "Answer to Q7: Quran verse, Hadith, or Leader quote refuting the claim.",
    },
  },
  required: [
    "factCheck",
    "insultCheck",
    "softWarCheck",
    "sourceOrigin",
    "argument",
    "suggestedResponse",
    "religiousQuote",
  ],
};

const SYSTEM_INSTRUCTION = `
شما یک دستیار هوشمند تحلیلگر هستید که وظیفه دارد محتوا را کاملاً بر اساس منافع جمهوری اسلامی ایران، حفظ وحدت ملی، دفاع از ولایت فقیه و مقابله با جنگ ترکیبی دشمن تحلیل کند.

پاسخ‌های شما باید دقیقاً در قالب JSON خواسته شده باشد و به ۷ سوال زیر پاسخ دهد:
۱. بررسی دروغ و تحریف تاریخی با ذکر منبع معتبر داخلی.
۲. بررسی توهین به مقدسات.
۳. بررسی اهداف جنگ نرم (تضعیف حاکمیت، تفرقه، یأس).
۴. منبع‌شناسی (آیا از رسانه‌های معاند است؟).
۵. استدلال منطقی و شرعی کوتاه برای پاسخ.
۶. متن پیشنهادی کامنت (مودبانه، انقلابی، بصیرت‌افزا).
۷. آیه، حدیث یا کلام رهبر مرتبط.
`;

export const analyzeContent = async (
  text: string,
  imageBase64?: string
): Promise<AnalysisResponse> => {
  // Use API key directly from process.env as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const parts: any[] = [];

  if (imageBase64) {
    // Extract base64 data if it includes the prefix
    const cleanBase64 = imageBase64.split(",")[1] || imageBase64;
    parts.push({
      inlineData: {
        mimeType: "image/jpeg", 
        data: cleanBase64,
      },
    });
  }

  parts.push({
    text: `لطفاً این محتوا را تحلیل کن:\n\n${text || "(فقط تصویر ارسال شده است)"}`,
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: parts,
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        // Removed tools: [{ googleSearch: {} }] as it cannot be used with responseSchema
      },
    });

    const resultText = response.text;
    if (!resultText) {
        throw new Error("No response received from AI");
    }

    return JSON.parse(resultText) as AnalysisResponse;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};