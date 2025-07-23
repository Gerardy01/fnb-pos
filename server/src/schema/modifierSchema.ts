import { z } from 'zod';


const ModifierOptionSchema = z.object({
    optionName : z.string().min(1).max(100),
    price : z.string().regex(/^\d{1,13}(\.\d{1,2})?$/, {
        message: "Amount must be a decimal string with up to 2 decimal places",
    }),
});

export const CreateModifierSchema = z.object({
    name : z.string().min(1).max(100),
    modifierOptions : z.array(ModifierOptionSchema).min(1),
    required : z.boolean(),
    min : z.number().min(0),
    max : z.number().min(1),
});

export const EditModifierSchema = z.object({
    modifierId : z.number(),
    name : z.string().min(1).max(100),
    modifierOptions : z.array(ModifierOptionSchema).min(1),
    required : z.boolean(),
    min : z.number().min(0),
    max : z.number().min(1),
});