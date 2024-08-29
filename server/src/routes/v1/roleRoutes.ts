import { Router } from 'express';

// utils
import { PermissionEnum } from '../../utility/enums';

// middlewares
import { authenticate, validatePermission, validateRequest } from '../../utility/middleware';

// schema
import { CreateRoleSchema } from '../../schema/roleSchema';

// controllers
import RoleController from '../../controllers/roleController';

const roleRoutes = Router();

roleRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.ROLE_MANAGEMENT, 'write'),
    validateRequest(CreateRoleSchema),
    RoleController.createRole
);

export default roleRoutes;