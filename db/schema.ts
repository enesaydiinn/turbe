import { sql } from "drizzle-orm";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const applications = sqliteTable(
  "applications",
  {
    id: text("id").primaryKey(),
    applicationType: text("application_type").notNull(),
    status: text("status").notNull().default("received"),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    countryCity: text("country_city").notNull(),
    institution: text("institution").notNull(),
    profession: text("profession").notNull(),
    academicTitle: text("academic_title").notNull(),
    topic: text("topic").notNull(),
    paperTitle: text("paper_title").notNull(),
    panelTitle: text("panel_title"),
    abstractText: text("abstract_text").notNull(),
    publishedBefore: text("published_before").notNull(),
    speakersJson: text("speakers_json"),
    notes: text("notes"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_applications_type").on(table.applicationType),
    index("idx_applications_created_at").on(table.createdAt),
  ],
);
