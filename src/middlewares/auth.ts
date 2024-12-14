/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import AppError from '../errors/appError';
import { verifyToken } from '../utils/verifyJWT';
import config from '../config';
import prisma from '../utils/prisma';
import { UserStatus } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
      }

      const decoded = verifyToken(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;

      const { role, email } = decoded;

      await prisma.user.findUniqueOrThrow({
        where: {
          email,
          status: UserStatus.ACTIVE,
        },
      });

      if (roles.length && !roles.includes(role)) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Forbidden!');
      }

      req.user = decoded as JwtPayload;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
