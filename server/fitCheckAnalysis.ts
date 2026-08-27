import { invokeLLM, listLLMModels } from "./_core/llm";

export type FitAnalysis = {
  recommendedSize: string;
  confidence: "Low" | "Medium" | "High";
  fitSummary: string;
  considerations: string[];
  styleTip: string;
};

type FitAnalysisInput = {
  photoDataUrl: string;
  productName: string;
  productType: string;
  availableSizes: string[];
  extras: string[];
  profile?: {
    preferredSize: string | null;
    height: string | null;
    bodyShape: string | null;
    stylePreferences: string | null;
    fitNotes: string | null;
  };
};

async function chooseVisionModel() {
  const { data } = await listLLMModels();
  return data.find((model) => model.id === "gemini-3-flash-preview")?.id
    || data.find((model) => model.id.startsWith("gemini-"))?.id
    || data.find((model) => model.id.startsWith("gpt-5"))?.id;
}

export async function analyzeFitImage(input: FitAnalysisInput): Promise<FitAnalysis> {
  const model = await chooseVisionModel();
  if (!model) throw new Error("No vision-capable analysis model is currently available.");

  const profileContext = input.profile
    ? `Saved profile: preferred size ${input.profile.preferredSize || "not set"}; height ${input.profile.height || "not set"}; body shape ${input.profile.bodyShape || "not set"}; style preferences ${input.profile.stylePreferences || "not set"}; fit notes ${input.profile.fitNotes || "not set"}.`
    : "No saved fit profile is available.";

  const response = await invokeLLM({
    model,
    max_tokens: 700,
    messages: [
      {
        role: "system",
        content: "You are Fitique’s visual shopping assistant. Give practical, conservative apparel-fit guidance from an uploaded outfit photo and supplied wardrobe preferences. Never identify the person or infer age, race, ethnicity, health, disability, weight, medical information, exact body measurements, or other sensitive traits. Do not claim certainty or guarantees. If visual information is unclear, choose low confidence and recommend consulting the garment size guide. Keep every sentence respectful, brief, and fashion-focused.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: `Assess the likely styling and fit suitability for the ${input.productName} (${input.productType}). Available sizes: ${input.availableSizes.join(", ")}. Select exactly one recommendedSize from that list. Optional outfit extras: ${input.extras.length ? input.extras.join(", ") : "none"}. ${profileContext} Return a helpful fashion estimate only. The fitSummary must mention that the result is an estimate and the shopper should consult the garment guide.` },
          { type: "image_url", image_url: { url: input.photoDataUrl, detail: "high" } },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "fitique_fit_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            recommendedSize: { type: "string", enum: input.availableSizes },
            confidence: { type: "string", enum: ["Low", "Medium", "High"] },
            fitSummary: { type: "string" },
            considerations: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 3 },
            styleTip: { type: "string" },
          },
          required: ["recommendedSize", "confidence", "fitSummary", "considerations", "styleTip"],
          additionalProperties: false,
        },
      },
    },
  });

  const raw = response.choices[0]?.message.content;
  if (typeof raw !== "string") throw new Error("The image analysis did not return a readable result.");
  const parsed = JSON.parse(raw) as FitAnalysis;
  if (!input.availableSizes.includes(parsed.recommendedSize)) throw new Error("The returned recommendation used an unavailable size.");
  return parsed;
}
