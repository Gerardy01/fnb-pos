import { Router } from 'express';

// utils
import { PermissionEnum } from '../../utility/enums';

// middlewares
import { validateRequest, authenticate, validatePermission } from '../../utility/middleware';

// Schema
import {
    CreateOrganizationWithAccountSchema,
    CreateOrganizationSchema
} from '../../schema/organizationSchema';

// controllers
import OrganizationController from '../../controllers/organizationController';

const organizationRoutes = Router();

organizationRoutes.get("/action/organization-info",
    authenticate,
    OrganizationController.getUserOrganization
)
organizationRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.SUPER_PERMISSION, 'write'),
    validateRequest(CreateOrganizationSchema),
    OrganizationController.createOrganization
);
organizationRoutes.post("/action/create-with-account",
    // TODO: Must authenticate with dashboard (management) account, and permission
    validateRequest(CreateOrganizationWithAccountSchema),
    OrganizationController.createOrganizationWithAccount
);

export default organizationRoutes;