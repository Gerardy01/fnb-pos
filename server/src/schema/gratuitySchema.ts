import { z } from 'zod';

// utils
import { GratuityCalculationTypeEnum } from '../utility/enums';


export const CreateGratuitySchema = z.object({
    name : z.string().min(1).max(100),
    writtenName : z.string().min(1).max(100),
    amount : z.string().regex(/^\d{1,13}(\.\d{1,2})?$/, {
        message: "Amount must be a decimal string with up to 2 decimal places",
    }),
    calculationType : z.nativeEnum(GratuityCalculationTypeEnum)
});

export const EditGratuitySchema = z.object({
    gratuityId : z.number(),
    name : z.string().min(1).max(100),
    writtenName : z.string().min(1).max(100),
    amount : z.string().regex(/^\d{1,13}(\.\d{1,2})?$/, {
        message: "Amount must be a decimal string with up to 2 decimal places",
    }),
    calculationType : z.nativeEnum(GratuityCalculationTypeEnum)
});