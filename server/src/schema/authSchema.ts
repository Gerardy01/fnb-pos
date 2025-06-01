import { z } from 'zod';

export const LoginSchema = z.object({
    identifier : z.string().min(1),
    password : z.string().min(1)
});

export const SuperAdminLoginSchema = z.object({
    identifier : z.string().min(1),
    password : z.string().min(1),
    organizationNo : z.string().min(1)
});

export const GenerateOtpCodeSchema = z.object({
    address : z.string().min(1),
    expired_second : z.number().min(10).optional(),
});

