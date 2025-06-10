import { Router } from 'express';

// utils
import { PermissionEnum } from '../../utility/enums';

// middlewares
import { authenticate, validatePermission, validateRequest } from '../../utility/middleware';

// schema
import { CreateRoleSchema, EditRoleSchema } from '../../schema/roleSchema';

// controllers
import RoleController from '../../controllers/roleController';

const roleRoutes = Router();

roleRoutes.get("/",
    authenticate,
    validatePermission(PermissionEnum.ROLE_MANAGEMENT, 'read'),
    RoleController.getAllRole
);
roleRoutes.get("/:id",
    authenticate,
    validatePermission(PermissionEnum.ROLE_MANAGEMENT, 'read'),
    RoleController.getOneRole
);
roleRoutes.get("/action/default-role",
    authenticate,
    validatePermission(PermissionEnum.ROLE_MANAGEMENT, 'read'),
    RoleController.getDefaultRole
);
roleRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.ROLE_MANAGEMENT, 'write'),
    validateRequest(CreateRoleSchema),
    RoleController.createRole
);
roleRoutes.put("/",
    authenticate,
    validatePermission(PermissionEnum.ROLE_MANAGEMENT, 'read'),
    validateRequest(EditRoleSchema),
    RoleController.editRole
);
roleRoutes.delete("/:id",
    authenticate,
    validatePermission(PermissionEnum.ROLE_MANAGEMENT, 'write'),
    RoleController.removeRole
)

export default roleRoutes;