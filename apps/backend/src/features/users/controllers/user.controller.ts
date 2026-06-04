// import type { NextFunction, Request, Response } from "express";
// import {
//   createUserSchema,
//   updateUserSchema,
//   userIdParamSchema,
// } from "@repo/db";
// import * as userService from "@/features/users/services/user.service.js";
// import { ApiResponse } from "@/utils/ApiResonse.js";
// import { handleError } from "@/utils/handleError.js";

// export const createUserController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
//     const body = createUserSchema.parse(req.body);
//     const user = await userService.createUser(body);

//     res
//       .status(201)
//       .json(
//         new ApiResponse(
//           201,
//           "CREATED",
//           user,
//           "User created successfully.",
//         ),
//       );
//   } catch (error) {
//     handleError(error, res, next);
//   }
// };

// export const getAllUsersController = async (
//   _req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
//     const users = await userService.getAllUsers();

//     res
//       .status(200)
//       .json(
//         new ApiResponse(
//           200,
//           "SUCCESS",
//           users,
//           "Users fetched successfully.",
//         ),
//       );
//   } catch (error) {
//     handleError(error, res, next);
//   }
// };

// export const getUserByIdController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
//     const { id } = userIdParamSchema.parse(req.params);
//     const user = await userService.getUserById(id);

//     res
//       .status(200)
//       .json(
//         new ApiResponse(
//           200,
//           "SUCCESS",
//           user,
//           "User fetched successfully.",
//         ),
//       );
//   } catch (error) {
//     handleError(error, res, next);
//   }
// };

// export const updateUserController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
//     const { id } = userIdParamSchema.parse(req.params);
//     const body = updateUserSchema.parse(req.body);
//     const user = await userService.updateUser(id, body);

//     res
//       .status(200)
//       .json(
//         new ApiResponse(
//           200,
//           "SUCCESS",
//           user,
//           "User updated successfully.",
//         ),
//       );
//   } catch (error) {
//     handleError(error, res, next);
//   }
// };

// export const deleteUserController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
//     const { id } = userIdParamSchema.parse(req.params);
//     const user = await userService.deleteUser(id);

//     res
//       .status(200)
//       .json(
//         new ApiResponse(
//           200,
//           "SUCCESS",
//           user,
//           "User deleted successfully.",
//         ),
//       );
//   } catch (error) {
//     handleError(error, res, next);
//   }
// };
