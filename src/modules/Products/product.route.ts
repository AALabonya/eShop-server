import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';
import { upload } from '../../config/multer.config';

const router = express.Router();

router.post(
  '/', upload.fields([
    { name: "image", maxCount: 10 },
]),
(req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    // console.log(req.body);
    
    next();
},
  auth(UserRole.VENDOR),
  validateRequest(ProductValidation.createProductValidation),
  ProductController.createProduct,
);

router.get(
  '/:productId',
  auth(
    UserRole.VENDOR,
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CUSTOMER,
  ),
  ProductController.getSingleProduct,
);

router.patch(
  '/:productId',upload.fields([
    { name: "image", maxCount: 10 },
]),(req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    // console.log(req.body);
    
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
  auth(UserRole.VENDOR),
  validateRequest(ProductValidation.updateProductValidation),
  ProductController.duplicateProduct
);
export const ProductRoutes = router;
