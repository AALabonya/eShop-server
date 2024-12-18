
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userService } from './user.service';
import config from '../../config';
import { IAuthUser } from './user.interface';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import pick from '../../utils/pick';
import { userFilterableFields } from './user.constant';

const createAdmin = catchAsync(async (req, res) => {
  const result = await userService.createAdmin(req.body);
  const { refreshToken, accessToken, newUser } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin created successfully!',
    token: accessToken,
    data: newUser,
  });
});

const createVendor = catchAsync(async (req, res) => {
  const result = await userService.createVendor(req.body);

  const { refreshToken, accessToken, newUser } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Vendor created successfully!',
    token: accessToken,
    data: newUser,
  });
});

const createCustomer = catchAsync(async (req, res) => {
  const result = await userService.createCustomer(req.body);
  console.log(result,"customer");
  const { refreshToken, accessToken, newUser } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Customer created successfully!',
    token: accessToken,
    data: newUser,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.query)
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await userService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users data fetched!',
    meta: result.meta,
    data: result.data,
  });
});

const changeupdateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(req.body,"body");
  
  const result = await userService.updateUserStatus(id, req.body);


  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users profile status changed!',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const result = await userService.getMyProfile(req.user as IAuthUser);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'My profile data fetched!',
    data: result,
  });
});

const getVendorUser = catchAsync(async (req, res) => {
  const { vendorId } = req.params;

  const result = await userService.getVendorUser(vendorId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Vendor retrieved successfully!',
    data: result,
  });
});



const getCustomerUser = catchAsync(async (req, res) => {
  const { email } = req.params;

  const result = await userService.getCustomerUser(email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Customer retrieved successfully!',
    data: result,
  });
});

const followVendor = catchAsync(async (req, res) => {
  const result = await userService.followVendor(
    req.body,
    req.user as IAuthUser,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Customer followed vendor shop successfully!',
    data: result,
  });
});

const unfollowVendor = catchAsync(async (req, res) => {
  const result = await userService.unfollowVendor(
    req.body,
    req.user as IAuthUser,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Customer unfollowed vendor shop successfully!',
    data: result,
  });
});
const updateVendor = catchAsync(async (req, res) => {
  const result = await userService.updateVendor(
    req.body,
    req.files, 
    req.user as IAuthUser,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Vendor profile updated successfully!',
    data: result,
  });
});

const updateCustomer = catchAsync(async (req: Request , res:Response,) => {
  // console.log( req.user);

  const result = await userService.updateCustomer(
    req.body,
    req.files,    
    req.user as IAuthUser,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Customer profile updated successfully!',
    data: result,
  });
});
const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
// console.log(userId);

  const result = await userService.deleteUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product successfully deleted!',
    data: result,
  });
});

const updateVendorStatus = catchAsync(async (req, res) => {
  const { vendorId } = req.params; // Extract vendorId from URL
  const { isDeleted } = req.body; // Extract isDeleted from body
  
  // Call the service to update vendor status
  const result = await userService.updateVendorStatus(vendorId, isDeleted);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Vendor ${isDeleted ? 'added to' : 'removed from'} blacklist successfully!`,
    data: result,
  });
});






export const userController = {

  createAdmin,
  createVendor,
  createCustomer,
  //   getAllFromDB,
  changeupdateUserStatus,
  getMyProfile,
  getVendorUser,
  getCustomerUser,
  followVendor,
  unfollowVendor,
  updateCustomer,
  updateVendor,
  getAllFromDB,
  deleteUser,
  updateVendorStatus

};

