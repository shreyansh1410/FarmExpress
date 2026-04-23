const GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
];

const resolveGeminiModels = () => {
  const preferredModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  return [preferredModel, ...FALLBACK_MODELS.filter((model) => model !== preferredModel)];
};

const hasGeminiConfig = () => Boolean(process.env.GEMINI_API_KEY);

const buildGeminiUrl = (model) => {
  return `${GEMINI_BASE_URL}/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
};

const safeJsonParse = (text) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
};

const parseGeminiText = (data) => {
  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim() || "";

  // Gemini may wrap JSON in fenced blocks; strip them before parsing.
  const cleanedText = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return { rawText: text, cleanedText };
};

const requestWithModel = async ({ model, systemPrompt, userPrompt }) => {
  const response = await fetch(buildGeminiUrl(model), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 700,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(
      `Gemini request failed for ${model}: ${response.status} ${errorText}`
    );
    error.statusCode = response.status;
    throw error;
  }

  const data = await response.json();
  return parseGeminiText(data);
};

const generateGeminiResponse = async ({ systemPrompt, userPrompt }) => {
  if (!hasGeminiConfig()) {
    throw new Error("Gemini API key is not configured.");
  }

  const models = resolveGeminiModels();
  let lastError = null;

  for (const model of models) {
    try {
      return await requestWithModel({ model, systemPrompt, userPrompt });
    } catch (error) {
      lastError = error;
      // Retry only if model is not available for this account/API.
      if (error.statusCode !== 404) {
        break;
      }
    }
  }

  throw lastError || new Error("Gemini request failed.");
};

const generateGeminiJson = async ({ systemPrompt, userPrompt }) => {
  const { cleanedText, rawText } = await generateGeminiResponse({
    systemPrompt,
    userPrompt,
  });

  const parsed = safeJsonParse(cleanedText);
  if (!parsed) {
    throw new Error(`Gemini returned non-JSON response: ${rawText}`);
  }

  return parsed;
};

module.exports = {
  hasGeminiConfig,
  generateGeminiResponse,
  generateGeminiJson,
};
