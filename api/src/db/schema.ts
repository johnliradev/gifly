import { numeric, text } from "drizzle-orm/pg-core";
import { boolean } from "drizzle-orm/pg-core";
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const listsTable = pgTable(
  "lists",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    share_token: varchar("share_token", { length: 32 }).notNull().unique(),
    is_public: boolean("is_public").default(false).notNull(),
    user_id: integer("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    is_default: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("idx_lists_user_id").on(table.user_id),
    index("idx_lists_is_public").on(table.is_public),
    index("idx_lists_share_token").on(table.share_token),
  ]
);

export const priorityEnum = pgEnum("priority", ["LOW", "MEDIUM", "HIGH"]);
export const statusEnum = pgEnum("status", [
  "PURCHASED",
  "DESIRED",
  "GIFTED",
  "RESERVED",
  "ARCHIVED",
]);

export const itemsTable = pgTable(
  "items",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    list_id: integer("list_id")
      .references(() => listsTable.id, { onDelete: "cascade" })
      .notNull(),
    url: text("url").$type<string | null>(),
    description: text("description").default(""),
    estimated_price: numeric("estimated_price", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    image_url: text("image_url").$type<string | null>(),
    priority: priorityEnum("priority").notNull().default("MEDIUM"),
    status: statusEnum("status").notNull().default("DESIRED"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("idx_items_list_id").on(table.list_id),
    index("idx_items_status").on(table.status),
    index("idx_items_priority").on(table.priority),
  ]
);
