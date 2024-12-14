import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { userValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { fileUploader } from '../../utils/fileUploader';

const router = express.Router();

// router.get(
//   '/',
//   auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//   userController.getAllFromDB,
// );

router.get(
  '/me',
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  userController.getMyProfile,
);

router.get(
  '/get-vendor/:vendorId',
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  userController.getVendorUser,
);

router.get(
  '/get-customer/:email',
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  userController.getCustomerUser,
);

router.post(
  '/create-admin',
  validateRequest(userValidation.createUser),
  userController.createAdmin,
);

router.post(
  '/create-vendor',
  validateRequest(userValidation.createUser),
  userController.createVendor,
);

router.post(
  '/create-customer',
  validateRequest(userValidation.createUser),
  userController.createCustomer,
);

router.post('/follow', auth(UserRole.CUSTOMER), userController.followVendor);

router.delete(
  '/unfollow',
  auth(UserRole.CUSTOMER),
  userController.unfollowVendor,
);

router.patch(
  '/update-customer',
  auth(UserRole.CUSTOMER),
  fileUploader.upload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data)
      console.log(req.body.image);
      
      return userController.updateCustomer(req, res, next)
  }
  
);

router.patch(
  '/update-vendor',
  auth(UserRole.VENDOR),
  userController.updateVendor,
);
// router.patch(
//   '/:id/status',
//   auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//   validateRequest(userValidation.updateStatus),
//   userController.changeProfileStatus,
// );

// router.patch(
//   '/update-my-profile',
//   auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
//   fileUploader.upload.single('file'),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = JSON.parse(req.body.data);
//     return userController.updateMyProfie(req, res, next);
//   },
// );

export const UserRoutes = router;
