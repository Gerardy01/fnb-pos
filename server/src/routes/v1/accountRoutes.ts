import { Router } from 'express';

// utils
import { PermissionEnum } from '../../utility/enums';

// middlewares
import { authenticate, validatePermission, validateRequest } from '../../utility/middleware';

// schema
import { CreateAccountSchema, CreateSuperadminSchema } from '../../schema/accountSchema';

// controllers
import AccountController from '../../controllers/accountController';

const accountRoutes = Router();


accountRoutes.get("/action/user-info",
    authenticate,
    AccountController.getUserAccountInfo
);
accountRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.ACCOUNT_MANAGEMENT, 'write'),
    validateRequest(CreateAccountSchema),
    AccountController.createAccounts
);
accountRoutes.post("/action/super-admin", validateRequest(CreateSuperadminSchema), AccountController.createSuperadminAccount);

export default accountRoutes;