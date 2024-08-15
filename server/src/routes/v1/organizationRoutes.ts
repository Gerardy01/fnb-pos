import { Router } from 'express';

// middlewares
import { validateRequest } from '../../utility/middleware';

// Schema
import {
    CreateOrganizationWithAccountSchema,
    CreateOrganizationSchema
} from '../../schema/organizationSchema';

// controllers
import OrganizationController from '../../controllers/organizationController';

const organizationRoutes = Router();

organizationRoutes.post(
    "/",
    validateRequest(CreateOrganizationSchema),
    OrganizationController.createOrganization
);
organizationRoutes.post(
    "/action/create-with-account",
    validateRequest(CreateOrganizationWithAccountSchema),
    OrganizationController.createOrganizationWithAccount
);

export default organizationRoutes;