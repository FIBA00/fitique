import api, { apiIsConfigured, mockRequest } from "./api";
import { categories, products } from "../data/mockData";

function filterProducts(items, filters = {}) {
  const term = filters.search?.trim().toLowerCase();
  const preferredSize = typeof window !== "undefined" ? localStorage.getItem("fitique-preferred-size") : "";
  const discount = (product) => product.previousPrice ? (product.previousPrice - product.price) / product.previousPrice : 0;
  return items.filter((product) => !filters.category || product.category.toLowerCase() === filters.category.toLowerCase()).filter((product) => !filters.size || product.sizes.includes(filters.size)).filter((product) => !filters.availability || product.inStock).filter((product) => !term || `${product.name} ${product.category} ${product.type}`.toLowerCase().includes(term)).filter((product) => !filters.maxPrice || product.price <= Number(filters.maxPrice)).sort((a, b) => filters.sort === "price-low" ? a.price - b.price : filters.sort === "price-high" ? b.price - a.price : filters.sort === "name" ? a.name.localeCompare(b.name) : filters.sort === "value" ? discount(b) - discount(a) : filters.sort === "fit-match" ? Number(b.sizes.includes(preferredSize)) - Number(a.sizes.includes(preferredSize)) || Number(b.newArrival) - Number(a.newArrival) : Number(b.newArrival) - Number(a.newArrival));
}

export const productService = {
  async list(filters = {}) { if (apiIsConfigured) { const { data } = await api.get("/products", { params: filters }); return data; } return mockRequest(filterProducts(products, filters)); },
  async getById(id) { if (apiIsConfigured) { const { data } = await api.get(`/products/${id}`); return data; } return mockRequest(products.find((product) => product.id === id)); },
  async listCategories() { if (apiIsConfigured) { const { data } = await api.get("/categories"); return data; } return mockRequest(categories, 180); }
};
