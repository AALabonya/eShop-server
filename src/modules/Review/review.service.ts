
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import prisma from '../../utils/prisma';
import { IAuthUser } from '../Users/user.interface';
import { TReview } from './review.interface';

const createReview = async (payload: TReview, user: IAuthUser) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: user?.email,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new AppError(StatusCodes.NOT_FOUND, "Customer doesn't exist!");
  }

  const product = await prisma.product.findUnique({
    where: {
      id: payload.productId,
    },
  });

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product doesn't exist!");
  }

  const reviewInfo = { ...payload, customerId: customer.id };

  const result = await prisma.review.create({
    data: reviewInfo,
  });

  return result;
};

const getReviewsByProductId = async (query: Record<string, string>) => {
  const product = await prisma.product.findUnique({
    where: {
      id: query.productId,
    },
  });

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product doesn't exist!");
  }

  const result = await prisma.review.findMany({
    where: {
      productId: query.productId,
    },
    include: {
      product: true,
      customer: true,
    },
  });

  return result;
};

export const ReviewServices = {
  createReview,
  getReviewsByProductId,
};