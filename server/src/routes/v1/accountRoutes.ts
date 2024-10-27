import { Router } from 'express';

// utils
import { PermissionEnum } from '../../utility/enums';

// middlewares
import { authenticate, validatePermission, validateRequest } from '../../utility/middleware';

// schema
import {
    CreateAccountSchema,
    CreateSuperadminSchema,
    ChangePasswordSchema,
    EditAccountSchema,
    ResetPasswordSchema,
} from '../../schema/accountSchema';

// controllers
import AccountController from '../../controllers/accountController';

const accountRoutes = Router();


accountRoutes.get("/action/user-info",
    authenticate,
    AccountController.getUserAccountInfo
);
accountRoutes.get("/action/check-availability",
    authenticate,
    validatePermission(PermissionEnum.ACCOUNT_MANAGEMENT, 'read'),
    AccountController.checkAvailability
)
accountRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.ACCOUNT_MANAGEMENT, 'write'),
    validateRequest(CreateAccountSchema),
    AccountController.createAccounts
);
accountRoutes.post("/action/super-admin", validateRequest(CreateSuperadminSchema), AccountController.createSuperadminAccount);
accountRoutes.put("/",
    authenticate,
    validatePermission(PermissionEnum.ACCOUNT_MANAGEMENT, 'write'),
    validateRequest(EditAccountSchema),
    AccountController.editAccount
);
accountRoutes.put("/action/reset-password",
    authenticate,
    validateRequest(ResetPasswordSchema),
    AccountController.resetPassword
);
accountRoutes.put("/action/change-password",
    authenticate,
    validateRequest(ChangePasswordSchema),
    AccountController.changePassword
);

export default accountRoutes;