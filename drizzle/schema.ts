import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const fitProfiles = mysqlTable("fitProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  preferredSize: varchar("preferredSize", { length: 16 }),
  height: varchar("height", { length: 32 }),
  bodyShape: varchar("bodyShape", { length: 48 }),
  stylePreferences: text("stylePreferences"),
  fitNotes: text("fitNotes"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const fitCheckResults = mysqlTable("fitCheckResults", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  photoKey: varchar("photoKey", { length: 512 }).notNull(),
  photoUrl: varchar("photoUrl", { length: 1024 }).notNull(),
  productId: varchar("productId", { length: 96 }).notNull(),
  productName: varchar("productName", { length: 160 }).notNull(),
  recommendedSize: varchar("recommendedSize", { length: 16 }).notNull(),
  confidence: varchar("confidence", { length: 16 }).notNull(),
  fitSummary: text("fitSummary").notNull(),
  considerations: text("considerations").notNull(),
  styleTip: text("styleTip").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
