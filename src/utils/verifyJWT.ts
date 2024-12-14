import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../errors/appError';
import { UserRole } from '@prisma/client';

export const createToken = (
  jwtPayload: {
    id: string;
    email: string;
    role: UserRole;
  },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (
  token: string,
  secret: string,
): JwtPayload | Error => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error: any) {
    throw new AppError(401, 'You are not authorized!');
  }
};
