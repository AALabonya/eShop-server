import { z } from 'zod';

const createCategoryValidation = z.object({
  body: z.object({
    category: z.string({
      required_error: 'Category Name is required',
    }),
    label: z.string({
      required_error: 'Category Label is required',
    }),
  }),
});

const updateCategoryValidation = z.object({
  body: z.object({
    category: z
      .string({
        required_error: 'Category Name is required',
      })
      .optional(),
    label: z
      .string({
        required_error: 'Category Label is required',
      })
      .optional(),
  }),
});

export const categoryValidation = {
  createCategoryValidation,
  updateCategoryValidation,
};