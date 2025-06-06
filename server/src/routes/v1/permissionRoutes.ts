import { Router } from 'express';

// service
import PermissionController from '../../controllers/permissionController';

// utils
import { PermissionEnum } from '../../utility/enums';

// middleware
import { authenticate, validatePermission } from '../../utility/middleware';

const permissionRoutes = Router();

permissionRoutes.get("/",
    authenticate,
    validatePermission(PermissionEnum.ROLE_MANAGEMENT, 'read'),
    PermissionController.getAllPermission
);

permissionRoutes.get("/page-access-permission-list",
    authenticate,
    validatePermission(PermissionEnum.ROLE_MANAGEMENT, 'read'),
    PermissionController.getAllPageAccessPermission
);

export default permissionRoutes;