import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./auth";

export const documentsTable = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => usersTable.id),
  title: text("title").notNull(),
  documentType: varchar("document_type", { length: 100 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documentsTable).omit({ id: true, createdAt: true });
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type LegalDocument = typeof documentsTable.$inferSelect;
