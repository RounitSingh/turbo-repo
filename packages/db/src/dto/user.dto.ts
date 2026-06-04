// import { z } from "zod";
// import { userRoles } from "../schema";

// export const createUserSchema = z.object({
//   email: z.string().trim().email("Invalid email address"),
//   firstName: z
//     .string()
//     .trim()
//     .min(1, "First name is required")
//     .max(100, "First name must be at most 100 characters"),
//   lastName: z
//     .string()
//     .trim()
//     .min(1, "Last name is required")
//     .max(100, "Last name must be at most 100 characters"),
//   phone: z
//     .string()
//     .trim()
//     .max(20, "Phone must be at most 20 characters")
//     .optional()
//     .nullable(),
//   role: z.enum(userRoles).default("student"),
//   isActive: z.boolean().default(true),
// });

// export const updateUserSchema = createUserSchema.partial();

// export const userIdParamSchema = z.object({
//   id: z.coerce.number().int().positive("Invalid user id"),
// });

// export type CreateUserDto = z.infer<typeof createUserSchema>;
// export type UpdateUserDto = z.infer<typeof updateUserSchema>;
// export type UserIdParamDto = z.infer<typeof userIdParamSchema>;
