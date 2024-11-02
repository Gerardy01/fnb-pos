import { z } from 'zod';


export const CreateRoleSchema = z.object({
    roleName : z.string().min(1),
    permissions : z.array(
        z.object({
            permissionId: z.number({ message: "permissionId is required" }),
            write: z.boolean({ message: "write is required" }),
            read: z.boolean({ message: "read is required" }),
        })
    ).min(1, { message: "Must contain at least 1 permission" }),
    pageAccessPermissionIds : z.array(z.number()).min(
        1, { message: "Must contain at least 1 page access permission" }
    )
});