import { User } from '@prisma/client';
import { Request } from 'express';

export interface ActiveUserData {
  sub: string;
  email: string;
  role: string;
  permissions?: string[];
}
