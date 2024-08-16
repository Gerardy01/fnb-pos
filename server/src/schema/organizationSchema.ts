import { z } from 'zod';

export const CreateOrganizationSchema = z.object({
    organizationName : z.string().min(1),
    endValidDatetime : z.number().min(0),
});

export const CreateOrganizationWithAccountSchema = z.object({
    organizationName : z.string().min(1),   
    endValidDatetime : z.number().min(1),
    username : z.string().min(1).max(20),
    name : z.string().min(1),
    email : z.string().max(50).nullable(),
    password : z.string().min(1),
});