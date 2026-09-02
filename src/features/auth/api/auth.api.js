import api, { apiIsConfigured, mockRequest } from "../../../api/api";
import { mockUser } from "../../../data/data.user.js";

export const authService = {
  async login(credentials) {
    if (apiIsConfigured) {
      const { data } = await api.post("/auth/login", credentials);
      return data;
    }
    return mockRequest(
      { user: { ...mockUser, email: credentials.email }, token: null },
      650
    );
  },
  async register(details) {
    if (apiIsConfigured) {
      const { data } = await api.post("/auth/register", details);
      return data;
    }
    return mockRequest(
      {
        user: {
          ...mockUser,
          name: details.name,
          firstName: details.name.split(" ")[0],
          email: details.email,
        },
        token: null,
      },
      650
    );
  },
  async getProfile() {
    if (apiIsConfigured) {
      const { data } = await api.get("/profile");
      return data;
    }
    return mockRequest(mockUser, 120);
  },
  async updateProfile(details) {
    if (apiIsConfigured) {
      const { data } = await api.patch("/profile", details);
      return data;
    }
    return mockRequest({ ...mockUser, ...details }, 500);
  },
};
