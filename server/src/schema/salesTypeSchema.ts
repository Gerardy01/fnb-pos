import { z } from 'zod';


const AssignedGratuitySchema = z.object({
    gratuityId: z.number(),
    outletId: z.string().optional().nullable(),
});

export const CreateSalesTypeSchema = z.object({
    name : z.string().min(1).max(100),
    outletIds : z.array(z.string()),
    assignedGratuities: z.array(AssignedGratuitySchema),
});

export const EditSalesTypeSchema = z.object({
    salesTypeId : z.number(),
    name : z.string().min(1).max(100),
    outletIds : z.array(z.string()),
    assignedGratuities: z.array(AssignedGratuitySchema),
});