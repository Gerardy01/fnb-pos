import { Router } from 'express';

// controllers
import AccountController from '../../controllers/accountController';

const accountRoutes = Router();


accountRoutes.get("/", AccountController.getAccounts);

export default accountRoutes;