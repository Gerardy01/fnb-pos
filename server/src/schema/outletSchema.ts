import { z } from 'zod';

export const CreateOutletSchema = z.object({
    outletName : z.string().min(1).max(100),
    address : z.string().max(200).nullable().optional(),
    city : z.string().max(50).nullable().optional(),
    province : z.string().max(50).nullable().optional(),
    postalCode : z.string().max(10).nullable().optional(),
});