import { Router } from 'express';

// utils
import { PermissionEnum } from '../../utility/enums';

// middlewares
import { authenticate, validatePermission, validateRequest } from '../../utility/middleware';

// schema
import { CreateAccountSchema, CreateSuperadminSchema, ChangePasswordSchema } from '../../schema/accountSchema';

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
accountRoutes.put("/action/change-password",
    authenticate,
    validatePermission(PermissionEnum.ACCOUNT_MANAGEMENT, 'write'),
    validateRequest(ChangePasswordSchema),
    AccountController.changePassword
);

export default accountRoutes;