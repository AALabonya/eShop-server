import prisma from '../../utils/prisma';
import AppError from '../../errors/appError';
import { StatusCodes } from 'http-status-codes';
import { cloudinaryUpload } from '../../config/cloudinary.config';


// const createCategory = async (payload: { category: string; image: string }) => {
//   const isCategoryExists = await prisma.category.findUnique({
//     where: {
//       name: payload.category,
//     },
//   });

//   if (isCategoryExists) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Category already exists!');
//   }

//   const result = await prisma.category.create({
//     data: {
//       name: payload.category,
//       image: payload.image,
//     },
//   });

//   return result;
// };
const createCategory = async (payload:
   { category: string; 
    image: string; 
    label?: string ,
    },
    files: any,) => {
  const isCategoryExists = await prisma.category.findUnique({
    where: {
      name: payload.category,
    },
  });

  if (isCategoryExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Category already exists!');
  }
  const image = files?.image?.[0]?.path || "";
  if(image){
    payload.image = image
  }
  const result = await prisma.category.create({
    data: {
      name: payload.category,
      label: payload.category,
      image: payload.image,
    },
  });

  return result;
};
const getAllCategories = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};

// const updateCategory = async (
//   categoryId: string,
//   payload: { category?: string; image?: string },  files: any,
// ) => {
//   const isCategoryExists = await prisma.category.findUnique({
//     where: { id: categoryId },
//   });

//   if (!isCategoryExists) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'Category not found!');
//   }
//   const image = files?.image?.[0]?.path || "";
//   if(image){
//     payload.image = image
//   }
//   const updatedCategory = await prisma.category.update({
//     where: { id: categoryId },
//     data: {
//       ...(payload.category && { name: payload.category }),
//       ...(payload.image && { image: payload.image }),
//     },
//   });

//   return updatedCategory;
// };


const updateCategory = async (
  categoryId: string,
  payload: { category?: string },
  files: any
) => {
  // Check if the category exists
  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!existingCategory) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found!');
  }

  // Handle the new image if uploaded
  const newImagePath = files?.image?.[0]?.path || null;

  if (newImagePath) {
    // If there is an existing image, delete it from Cloudinary
    if (existingCategory.image) {
      const publicId = extractPublicId(existingCategory.image);
      if (publicId) {
        await cloudinaryUpload.uploader.destroy(publicId); // Delete the old image
      }
    }
  }

  // Update the category
  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: {
      ...(payload.category && { name: payload.category }), // Update category name if provided
      ...(newImagePath && { image: newImagePath }), // Update image if a new one was uploaded
    },
  });

  return updatedCategory;
};

/**
 * Extract the public_id from a Cloudinary URL
 * @param imageUrl The Cloudinary URL of the image
 */
const extractPublicId = (imageUrl: string): string | null => {
  try {
    const segments = imageUrl.split('/');
    const filenameWithExtension = segments[segments.length - 1];
    return filenameWithExtension.split('.')[0]; // Remove the file extension
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
};

export default updateCategory;


const deleteCategory = async (categoryId: string) => {
  // Check if category exists
  const isCategoryExists = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!isCategoryExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found!');
  }

  try {
    // Use transaction to update related products and mark category as deleted
    const result = await prisma.$transaction(async (tx) => {
      // Remove categoryId from products
      await tx.product.updateMany({
        where: { categoryId },
        data: { categoryId: null },
      });

      // Mark the category as deleted
      const deletedCategory = await tx.category.update({
        where: { id: categoryId },
        data: { isDeleted: true },
      });
console.log(deleteCategory);

      return deletedCategory;
    });

    // Return success message or the updated category
    return { success: true, message: 'Category marked as deleted', data: result };
  } catch (error) {
    // Handle errors (e.g., transaction failure)
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete category');
  }
};

export const CategoryServices = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
