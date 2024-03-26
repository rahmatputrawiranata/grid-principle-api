import { User } from "@internal/prisma-mysql/client";

export interface UserInterface extends Omit<User, 'password'>{}