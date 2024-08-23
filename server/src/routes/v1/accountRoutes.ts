import { Router } from 'express';

// middlewares
import { validateRequest } from '../../utility/middleware';

// schema
import { CreateAccountSchema, CreateSuperadminSchema } from '../../schema/accountSchema';

// controllers
import AccountController from '../../controllers/accountController';

const accountRoutes = Router();


accountRoutes.post("/", validateRequest(CreateAccountSchema), AccountController.createAccounts);
accountRoutes.post("/action/super-admin", validateRequest(CreateSuperadminSchema), AccountController.createSuperadminAccount);

export default accountRoutes;