import { UserRole } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import { upload } from '../../config/multer.config';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = express.Router();

router.post(
  '/', upload.fields([
    { name: "image", maxCount: 10 },
]),
(req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    console.log(req.body,"body");
    
    next();
},
  auth(UserRole.VENDOR),
  validateRequest(ProductValidation.createProductValidation),
  ProductController.createProduct,
);

router.get(
  '/:productId',
  // auth(
  //   UserRole.VENDOR,
  //   UserRole.SUPER_ADMIN,
  //   UserRole.ADMIN,
  //   UserRole.CUSTOMER,
  // ),
  ProductController.getSingleProduct,
);

router.patch(
  '/:productId',upload.fields([
    { name: "image", maxCount: 10 },
]),(req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
 
    
    next();
},
  auth(UserRole.VENDOR),
  validateRequest(ProductValidation.updateProductValidation),
  ProductController.updateProduct,
);

router.delete(
  '/:productId',
  auth(UserRole.VENDOR),
  ProductController.deleteProduct,
);

router.get('/', ProductController.getAllProducts);

router.post(
  "/duplicate/:productId",
  ProductController.duplicateProduct
);
export const ProductRoutes = router;
