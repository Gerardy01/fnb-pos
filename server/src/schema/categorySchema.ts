import { z } from 'zod';


export const CreateCategorySchema = z.object({
    name : z.string().min(1).max(100),
});

export const EditCategorySchema = z.object({
    categoryId : z.number(),
    name : z.string().min(1).max(100),
});