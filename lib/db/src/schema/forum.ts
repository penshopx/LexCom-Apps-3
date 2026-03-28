import { pgTable, serial, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

export const forumThreadsTable = pgTable("forum_threads", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => usersTable.id),
  authorName: varchar("author_name", { length: 100 }).notNull().default("Anonim"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 50 }).notNull().default("Umum"),
  replyCount: integer("reply_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const forumRepliesTable = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id").notNull().references(() => forumThreadsTable.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => usersTable.id),
  authorName: varchar("author_name", { length: 100 }).notNull().default("Anonim"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ForumThread = typeof forumThreadsTable.$inferSelect;
export type ForumReply = typeof forumRepliesTable.$inferSelect;
