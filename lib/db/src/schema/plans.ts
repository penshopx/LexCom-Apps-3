import { sql } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

export const plansTable = pgTable("plans", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  nameId: varchar("name_id").notNull(),
  priceMonthly: integer("price_monthly").notNull().default(0),
  priceAnnual: integer("price_annual").notNull().default(0),
  queriesPerDay: integer("queries_per_day").notNull().default(5),
  features: text("features").notNull().default("[]"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const subscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  planId: varchar("plan_id").references(() => plansTable.id).notNull().default("free"),
  status: varchar("status").notNull().default("active"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  paymentMethod: varchar("payment_method"),
  paymentRef: varchar("payment_ref"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const usageLogsTable = pgTable("usage_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  feature: varchar("feature").notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }).notNull().defaultNow(),
  metadata: text("metadata"),
});

export type Plan = typeof plansTable.$inferSelect;
export type InsertPlan = typeof plansTable.$inferInsert;
export type Subscription = typeof subscriptionsTable.$inferSelect;
export type InsertSubscription = typeof subscriptionsTable.$inferInsert;
export type UsageLog = typeof usageLogsTable.$inferSelect;
