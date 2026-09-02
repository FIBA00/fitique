import { z } from "zod";

export const profileSchema = z.object({
  preferredSize: z.string().max(16),
  height: z.string().max(32),
  bodyShape: z.string().max(48),
  stylePreferences: z.string().max(500),
  fitNotes: z.string().max(500),
});
