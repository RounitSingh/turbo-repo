// import {
//   boolean,
//   pgTable,
//   serial,
//   timestamp,
//   varchar,
// } from "drizzle-orm/pg-core";

// export const userRoles = ["admin", "invigilator", "student"] as const;
// export type UserRole = (typeof userRoles)[number];

// export const users = pgTable("users", {
//   id: serial().primaryKey(),
//   email: varchar({ length: 255 }).notNull().unique(),
//   firstName: varchar({ length: 100 }).notNull(),
//   lastName: varchar({ length: 100 }).notNull(),
//   phone: varchar({ length: 20 }),
//   role: varchar({ length: 50 }).notNull().default("student"),
//   isActive: boolean().notNull().default(true),
//   createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
//   updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
// });

// export type User = typeof users.$inferSelect;
// export type NewUser = typeof users.$inferInsert;
