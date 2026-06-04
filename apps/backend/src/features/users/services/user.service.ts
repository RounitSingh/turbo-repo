// import { db, users, type User } from "@repo/db";
// import { eq } from "drizzle-orm";
// import { ApiError } from "@/utils/ApiError.js";
// import type { CreateUserDto, UpdateUserDto } from "@repo/db";

// export const createUser = async (data: CreateUserDto): Promise<User> => {
//   const [user] = await db
//     .insert(users)
//     .values({
//       email: data.email,
//       firstName: data.firstName,
//       lastName: data.lastName,
//       phone: data.phone,
//       role: data.role,
//       isActive: data.isActive,
//     })
//     .returning();

//   if (!user) {
//     throw new ApiError(500, "Failed to create user");
//   }

//   return user;
// };

// export const getAllUsers = async (): Promise<User[]> => {
//   return db.select().from(users);
// };

// export const getUserById = async (id: number): Promise<User> => {
//   const [user] = await db.select().from(users).where(eq(users.id, id));

//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   return user;
// };

// export const updateUser = async (
//   id: number,
//   data: UpdateUserDto,
// ): Promise<User> => {
//   const [user] = await db
//     .update(users)
//     .set({
//       ...data,
//       updatedAt: new Date(),
//     })
//     .where(eq(users.id, id))
//     .returning();

//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   return user;
// };

// export const deleteUser = async (id: number): Promise<User> => {
//   const [user] = await db.delete(users).where(eq(users.id, id)).returning();

//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   return user;
// };
