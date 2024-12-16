
import AppError from '../../errors/appError';
import prisma from '../../utils/prisma';
import config from '../../config';
import bcrypt from 'bcryptjs';
import { UserRole, UserStatus } from '@prisma/client';
import { createToken } from '../../utils/verifyJWT';
import { IAuthUser } from './user.interface';
import { StatusCodes } from 'http-status-codes';
import { log } from 'node:console';
import { loadavg } from 'node:os';


const createAdmin = async (payload: {
  name: string;
  password: string;
  email: string;
}) => {
  // checking if the user is exist
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is already exist!');
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );

  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
      include: {
        admin: true,
      },
    });

    await tx.admin.create({
      data: {
        name: payload.name,
        email: user.email,
        image:
          'https://th.bing.com/th/id/R.3facbb5eefdada8df4a84ccb4815ed73?rik=IWiNlu9%2flgAnmg&pid=ImgRaw&r=0',
      },
    });

    return user;
  });

  //create token and sent to the  client

  const jwtPayload = {
    id: newUser.id as string,
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  const combinedResult = { accessToken, refreshToken, newUser };

  return combinedResult;
};

const createVendor = async (payload: {
  name: string;
  password: string;
  email: string;
  role?: string;
  shopName?: string;
  logo?: string;
  description?: string;
}) => {
  // checking if the user is exist
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
console.log(user);

  if (user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is already exist!');
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );

  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: UserRole.VENDOR,
      },
      include: {
        vendor: true,
      },
    });

    await tx.vendor.create({
      data: {
        name: payload.name,
        email: user.email,
      },
      include: {
        user: true,
      },
    });

    return user;
  });

  //create token and sent to the  client

  const jwtPayload = {
    id: newUser.id as string,
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  const combinedResult = { accessToken, refreshToken, newUser };

  return combinedResult;
};

const createCustomer = async (payload: {
  name: string;
  password: string;
  email: string;
}) => {
  // checking if the user is exist
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is already exist!');
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );

  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: UserRole.CUSTOMER,
      },
      include: {
        customer: true,
      },
    });

    await tx.customer.create({
      data: {
        name: payload.name,
        email: user.email,
       image:
          'https://i.pinimg.com/originals/d9/4e/34/d94e34a2679cbfcc38c8d8d7a58b5503.jpg',
      },
    });

    return user;
  });

  //create token and sent to the  client

  const jwtPayload = {
    id: newUser.id as string,
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  const combinedResult = { accessToken, refreshToken, newUser };

  return combinedResult;
};

const getMyProfile = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  let profileInfo;

  if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.VENDOR) {
    profileInfo = await prisma.vendor.findUnique({
      where: {
        email: userInfo.email,
      },
      include: {
        products: true,
        orders: true,
        followers: {
          include: {
            customer: true,
          },
        },
      },
    });
  } else if (userInfo.role === UserRole.CUSTOMER) {
    profileInfo = await prisma.customer.findUnique({
      where: {
        email: userInfo.email,
      },
      include: {
        customerCoupons: true,
        orders: true,
        reviews: true,
        following: {
          include: {
            vendor: true,
          },
        },
        recentProductView: true,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};

const getVendorUser = async (id: string) => {
  const vendor = await prisma.vendor.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      products: true,
      followers: true,
      orders: true,
    },
  });

  return vendor;
};

const getCustomerUser = async (email: string) => {
  const vendor = await prisma.customer.findUniqueOrThrow({
    where: {
      email,
      isDeleted: false,
    },
    include: {
      following: true,
      orders: true,
      reviews: true,
      recentProductView: true,
    },
  });

  return vendor;
};

const followVendor = async (payload: { vendorId: string }, user: IAuthUser) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: user?.email,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist!");
  }

  const vendor = await prisma.vendor.findUnique({
    where: {
      id: payload.vendorId,
      isDeleted: false,
    },
  });

  if (!vendor) {
    throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist!");
  }

  const follow = await prisma.follow.create({
    data: {
      customerId: customer.id,
      vendorId: vendor.id,
    },
    include: {
      customer: true,
      vendor: true,
    },
  });

  return follow;
};

const unfollowVendor = async (
  payload: { vendorId: string },
  user: IAuthUser,
) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: user?.email,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist!");
  }

  const vendor = await prisma.vendor.findUnique({
    where: {
      id: payload.vendorId,
      isDeleted: false,
    },
  });

  if (!vendor) {
    throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist!");
  }

  const unfollow = await prisma.follow.delete({
    where: {
      customerId_vendorId: {
        customerId: customer.id,
        vendorId: vendor.id,
      },
    },
  });

  return unfollow;
};


const updateCustomer = async (
  payload: {
    name?: string;
    image?: string;
    address?: string;
    phone?: string;
  },files: any, 
  userData: IAuthUser,
) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: userData?.email,
      isDeleted: false,
    },
  });

  // Use `any` to avoid TypeScript error
  const image = files?.image?.[0]?.path || "";

  if (!customer) {
    throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist!");
  }

  if(image){
    payload.image = image
  }
  const result = await prisma.customer.update({
    where: {
      email: customer.email,
    },
    data: payload,
    include: {
      following: true,
      orders: true,
      reviews: true,
      recentProductView: true,
    },
  });

  return result;
};

const updateVendor = async (
  payload: {
    name?: string;
    shopName?: string;
    logo?: string;
    description?: string;
  },files: any, 
  userData: IAuthUser,
) => {
  const vendor = await prisma.vendor.findUnique({
    where: {
      email: userData?.email,
      isDeleted: false,
    },
  });
 
  if (!vendor) {
    throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist!");
  }
  const image = files?.image?.[0]?.path || "";
  if(image){
    payload.logo = image
  }
  // console.log(payload,"jjj");
  
  const result = await prisma.vendor.update({
    where: {
      email: vendor.email,
    },
    data: payload,
    include: {
      orders: true,
      products: true,
      followers: true,
    },
  });
// console.log(result);

  return result;
};
const getAllFromDB = async (filters: any, options: any) => {
  const { limit = 10, page = 1, sortBy = 'createdAt', sortOrder = 'desc' } = options;

  const where = {
    ...filters, // Add the dynamic filters to the query
  };

  const users = await prisma.user.findMany({
    where,
    skip: (page - 1) * limit,  // Pagination: skip records for current page
    take: limit,                // Limit the number of records returned
    orderBy: {
      [sortBy]: sortOrder,       // Sorting based on the provided field and order
    },
    include: {
      admin: true,
      vendor: true,
      customer: true,
    },
  });

  const totalUsers = await prisma.user.count({ where }); // Get the total count of users matching the filters

  return {
    data: users,
    meta: {
      total: totalUsers,
      page,
      limit,
    },
  };
};
export const updateUserStatus = async (userId: string, status: UserStatus) => {
  // Check if the user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
// console.log(status,"status");

  // If user does not exist, throw an error
  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: 'BLOCKED' },
  });
  
  if (updatedUser.status !== 'BLOCKED') {
    console.error("User status update failed");
  }
  

  return updatedUser;  // Return the updated user object
};


export const deleteUser = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  // First, find the user and their related admin, customer, or vendor based on the userId
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      admin: true,
      customer: true,
      vendor: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let updatedUser;

  // If the user has an associated admin, update isDeleted to true
  if (user.admin) {
    updatedUser = await prisma.admin.update({
      where: { id: user.admin.id },
      data: {
        isDeleted: true,
      },
    });
  } else if (user.customer) {
    // If the user has an associated customer, update isDeleted to true
    updatedUser = await prisma.customer.update({
      where: { id: user.customer.id },
      data: {
        isDeleted: true,
      },
    });
  } else if (user.vendor) {
    // If the user has an associated vendor, update isDeleted to true
    updatedUser = await prisma.vendor.update({
      where: { id: user.vendor.id },
      data: {
        isDeleted: true,
      },
    });
  }

  // Update the status to 'DELETED' in the User table instead of deleting the user
  await prisma.user.update({
    where: { id: userId },
    data: { status: 'DELETED' },
  });

  return { message: 'User and their associated data marked as deleted successfully', user: updatedUser };
};

export const userService = {
  createAdmin,
  createVendor,
  createCustomer,
  getMyProfile,
  getVendorUser,
  getCustomerUser,
  followVendor,
  unfollowVendor,
  updateCustomer,
  updateVendor,
  getAllFromDB, 
  updateUserStatus,
  deleteUser
};