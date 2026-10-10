import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "editor", "recruiter"]);
export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "published",
  "archived",
]);
export const vacancyStatusEnum = pgEnum("vacancy_status", [
  "open",
  "closed",
  "paused",
]);
export const campaignStatusEnum = pgEnum("campaign_status", [
  "active",
  "completed",
  "paused",
]);
export const applicationStatusEnum = pgEnum("application_status", [
  "new",
  "in_review",
  "contacted",
  "closed",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  role: userRoleEnum("role").notNull().default("editor"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const newsCategories = pgTable("news_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 80 }).notNull().unique(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
});

export const newsArticles = pgTable("news_articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 220 }).notNull(),
  slug: varchar("slug", { length: 240 }).notNull().unique(),
  excerpt: text("excerpt"),
  body: text("body").notNull(),
  coverImage: text("cover_image"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  youtubeId: varchar("youtube_id", { length: 32 }),
  categoryId: uuid("category_id").references(() => newsCategories.id),
  status: contentStatusEnum("status").notNull().default("draft"),
  seoTitle: varchar("seo_title", { length: 220 }),
  seoDescription: varchar("seo_description", { length: 320 }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const vacancies = pgTable("vacancies", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  shortDescription: text("short_description"),
  description: text("description"),
  requirements: text("requirements"),
  direction: varchar("direction", { length: 120 }),
  status: vacancyStatusEnum("status").notNull().default("open"),
  sortOrder: integer("sort_order").notNull().default(0),
  seoTitle: varchar("seo_title", { length: 220 }),
  seoDescription: varchar("seo_description", { length: 320 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const supportCampaigns = pgTable("support_campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  description: text("description"),
  coverImage: text("cover_image"),
  goalAmount: integer("goal_amount"),
  raisedAmount: integer("raised_amount"),
  currency: varchar("currency", { length: 8 }).default("UAH"),
  monobankUrl: text("monobank_url"),
  cardNumber: varchar("card_number", { length: 32 }),
  status: campaignStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const applications = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  contact: varchar("contact", { length: 180 }).notNull(),
  hasMilitaryExperience: boolean("has_military_experience"),
  direction: varchar("direction", { length: 120 }),
  vacancyId: uuid("vacancy_id").references(() => vacancies.id),
  message: text("message"),
  privacyAccepted: boolean("privacy_accepted").notNull().default(false),
  status: applicationStatusEnum("status").notNull().default("new"),
  ipHash: varchar("ip_hash", { length: 64 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sitePages = pgTable("site_pages", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 80 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body").notNull(),
  seoTitle: varchar("seo_title", { length: 220 }),
  seoDescription: varchar("seo_description", { length: 320 }),
  status: contentStatusEnum("status").notNull().default("published"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 80 }).notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
