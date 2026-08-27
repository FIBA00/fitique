import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { fitCheckResults, fitProfiles, InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export type FitProfileInput = {
  preferredSize?: string;
  height?: string;
  bodyShape?: string;
  stylePreferences?: string;
  fitNotes?: string;
};

export async function getFitProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(fitProfiles).where(eq(fitProfiles.userId, userId)).limit(1);
  return result[0];
}

export async function saveFitProfile(userId: number, profile: FitProfileInput) {
  const db = await getDb();
  if (!db) throw new Error("Fit profiles are unavailable while the database is offline.");
  await db.insert(fitProfiles).values({ userId, ...profile }).onDuplicateKeyUpdate({ set: profile });
  return getFitProfile(userId);
}

export async function saveFitCheckResult(input: {
  userId: number;
  photoKey: string;
  photoUrl: string;
  productId: string;
  productName: string;
  recommendedSize: string;
  confidence: string;
  fitSummary: string;
  considerations: string[];
  styleTip: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Fit Check history is unavailable while the database is offline.");
  await db.insert(fitCheckResults).values({ ...input, considerations: JSON.stringify(input.considerations) });
}

export async function getLatestFitCheckResult(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(fitCheckResults).where(eq(fitCheckResults.userId, userId)).orderBy(desc(fitCheckResults.createdAt)).limit(1);
  return result[0];
}

function normalizeFitCheckResult(result: typeof fitCheckResults.$inferSelect) {
  let considerations: string[] = [];
  try { considerations = JSON.parse(result.considerations) as string[]; } catch { considerations = []; }
  return { ...result, considerations };
}

export async function getFitCheckHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(fitCheckResults).where(eq(fitCheckResults.userId, userId)).orderBy(desc(fitCheckResults.createdAt)).limit(24);
  return result.map(normalizeFitCheckResult);
}
