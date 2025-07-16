import { z } from 'zod';


export const CreateTaxSchema = z.object({
    name : z.string().min(1).max(100),
    writtenName : z.string().min(1).max(100),
    amount : z.string().regex(/^\d{1,13}(\.\d{1,2})?$/, {
        message: "Amount must be a decimal string with up to 2 decimal places",
    }),
    outletIds : z.array(z.string()),
});

export const EditTaxSchema = z.object({
    taxId : z.number(),
    name : z.string().min(1).max(100),
    writtenName : z.string().min(1).max(100),
    amount : z.string().regex(/^\d{1,13}(\.\d{1,2})?$/, {
        message: "Amount must be a decimal string with up to 2 decimal places",
    }),
    outletIds : z.array(z.string()),
});