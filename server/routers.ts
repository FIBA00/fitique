import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getFitCheckHistory, getFitProfile, getLatestFitCheckResult, saveFitCheckResult, saveFitProfile } from "./db";
import { analyzeFitImage } from "./fitCheckAnalysis";
import { storagePut } from "./storage";

const fitProfileInput = z.object({
  preferredSize: z.string().max(16).optional(),
  height: z.string().max(32).optional(),
  bodyShape: z.string().max(48).optional(),
  stylePreferences: z.string().max(500).optional(),
  fitNotes: z.string().max(500).optional(),
});

const photoDataUrl = z.string().max(10_000_000).regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/, "Use a JPG, PNG, or WEBP image.");

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  fitCheck: router({
    profile: protectedProcedure.query(({ ctx }) => getFitProfile(ctx.user.id)),
    latest: protectedProcedure.query(({ ctx }) => getLatestFitCheckResult(ctx.user.id)),
    history: protectedProcedure.query(({ ctx }) => getFitCheckHistory(ctx.user.id)),
    saveProfile: protectedProcedure.input(fitProfileInput).mutation(({ ctx, input }) => saveFitProfile(ctx.user.id, input)),
    analyze: protectedProcedure.input(z.object({
      photoDataUrl,
      productId: z.string().min(1).max(96),
      productName: z.string().min(1).max(160),
      productType: z.string().min(1).max(80),
      availableSizes: z.array(z.string().min(1).max(16)).min(1).max(12),
      extras: z.array(z.string().min(1).max(60)).max(8),
    })).mutation(async ({ ctx, input }) => {
      const profile = await getFitProfile(ctx.user.id);
      const mimeMatch = input.photoDataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
      if (!mimeMatch) throw new Error("Unsupported image format.");
      const [, contentType, base64] = mimeMatch;
      const extension = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
      const uploaded = await storagePut(`fit-check/${ctx.user.id}/${Date.now()}.${extension}`, Buffer.from(base64, "base64"), contentType);
      const analysis = await analyzeFitImage({ photoDataUrl: input.photoDataUrl, productName: input.productName, productType: input.productType, availableSizes: input.availableSizes, extras: input.extras, profile: profile ? { preferredSize: profile.preferredSize, height: profile.height, bodyShape: profile.bodyShape, stylePreferences: profile.stylePreferences, fitNotes: profile.fitNotes } : undefined });
      await saveFitCheckResult({ userId: ctx.user.id, photoKey: uploaded.key, photoUrl: uploaded.url, productId: input.productId, productName: input.productName, ...analysis });
      return { ...analysis, photoUrl: uploaded.url, profileSaved: Boolean(profile) };
    }),
  }),
});

export type AppRouter = typeof appRouter;
