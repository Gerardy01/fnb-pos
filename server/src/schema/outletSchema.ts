import { z } from 'zod';

export const CreateOutletSchema = z.object({
    outletName : z.string().min(1).max(100),
    address : z.string().max(200).nullable(),
    city : z.string().max(50).nullable(),
    province : z.string().max(50).nullable(),
    postalCode : z.string().max(10).nullable(),
});