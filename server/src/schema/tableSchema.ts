import { z } from 'zod';


export const CreateTableGroupSchema = z.object({
    groupName : z.string().min(1).max(100),
    outletId : z.string().min(1),
});

export const EditTableGroupSchema = z.object({
    id : z.number(),
    groupName : z.string().min(1).max(100),
});

export const ChangeTableGroupStatusSchema = z.object({
    id : z.number(),
    newStatus : z.boolean(),
});