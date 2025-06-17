import { z } from 'zod';


export const CreateTableGroupSchema = z.object({
    groupName : z.string().min(1),
    outletId : z.string().min(1),
});