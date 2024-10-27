import { z } from 'zod';

export const CreateAccountSchema = z.object({
    username : z.string().min(1).max(20),
    name : z.string().min(1),
    email : z.string().max(50).nullable(),
    password : z.string().min(1),
    roleId : z.number().min(1),
});

export const CreateSuperadminSchema = z.object({
    username : z.string().min(1).max(20),
    name : z.string().min(1),
    email : z.string().max(50).nullable(),
    password : z.string().min(1),
});

export const EditAccountSchema = z.object({
    accountId : z.string().min(1),
    process : z.string().min(1),
    value : z.string().min(1),
});

export const ResetPasswordSchema = z.object({
    accountId : z.string().min(1),
    newPassword : z.string().min(1)
});

export const ChangePasswordSchema = z.object({
    currentPassword : z.string().min(1),
    newPassword : z.string().min(1),
});