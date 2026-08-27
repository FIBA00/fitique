import { beforeEach, describe, expect, it, vi } from "vitest";

const llmMocks = vi.hoisted(() => ({ listLLMModels: vi.fn(), invokeLLM: vi.fn() }));

vi.mock("./_core/llm", () => llmMocks);

import { analyzeFitImage } from "./fitCheckAnalysis";

describe("analyzeFitImage", () => {
  beforeEach(() => {
    llmMocks.listLLMModels.mockResolvedValue({ data: [{ id: "gemini-3-flash-preview" }] });
    llmMocks.invokeLLM.mockResolvedValue({ choices: [{ message: { content: JSON.stringify({ recommendedSize: "M", confidence: "Medium", fitSummary: "This is an estimate; please consult the garment guide before deciding.", considerations: ["The garment guide is the final reference.", "Compare the shoulder and waist measurements."], styleTip: "Pair the dress with a soft scarf for a considered finish." }) } }] });
  });

  it("uses the live vision model and returns a size constrained to available sizes", async () => {
    const result = await analyzeFitImage({
      photoDataUrl: "data:image/jpeg;base64,aGVsbG8=",
      productName: "Eloise Ribbed Midi",
      productType: "Dress",
      availableSizes: ["S", "M", "L"],
      extras: ["Scarf"],
      profile: { preferredSize: "M", height: "165 cm", bodyShape: "Relaxed fit", stylePreferences: "Soft tailoring", fitNotes: "Prefer ease at the waist" },
    });

    expect(result.recommendedSize).toBe("M");
    expect(result.confidence).toBe("Medium");
    expect(llmMocks.listLLMModels).toHaveBeenCalledOnce();
    expect(llmMocks.invokeLLM).toHaveBeenCalledWith(expect.objectContaining({
      model: "gemini-3-flash-preview",
      response_format: expect.objectContaining({ type: "json_schema" }),
      messages: expect.arrayContaining([expect.objectContaining({ role: "system" })]),
    }));
  });

  it("rejects a model result that suggests a size unavailable for the selected piece", async () => {
    llmMocks.invokeLLM.mockResolvedValueOnce({ choices: [{ message: { content: JSON.stringify({ recommendedSize: "XL", confidence: "Low", fitSummary: "This is an estimate.", considerations: ["Review the size guide.", "Try the closest available size."], styleTip: "Keep the styling simple." }) } }] });

    await expect(analyzeFitImage({ photoDataUrl: "data:image/jpeg;base64,aGVsbG8=", productName: "Eloise Ribbed Midi", productType: "Dress", availableSizes: ["S", "M", "L"], extras: [] })).rejects.toThrow("unavailable size");
  });
});
