import api, { apiIsConfigured, mockRequest } from "./api";
import { fitResult } from "../data/mockData";
export const fitCheckService = {
  async analyze(payload) { if (apiIsConfigured) { const formData = new FormData(); formData.append("photo", payload.photo); formData.append("product", payload.product); payload.extras.forEach((extra) => formData.append("extras[]", extra)); const { data } = await api.post("/fit-check", formData, { headers: { "Content-Type": "multipart/form-data" } }); return data; } return mockRequest({ ...fitResult, requestedProduct: payload.product, requestedExtras: payload.extras }, 1900); }
};
