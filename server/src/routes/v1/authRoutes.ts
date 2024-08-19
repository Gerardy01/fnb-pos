import { Router } from 'express';

// middlewares
import { validateRequest } from '../../utility/middleware';

// schema
import { LoginSchema } from '../../schema/authSchema';

// controller
import AuthController from '../../controllers/authController';

const authRoutes = Router();

authRoutes.post("/login", validateRequest(LoginSchema), AuthController.login);
authRoutes.post("/logout", AuthController.logout)
authRoutes.get("/token", AuthController.requestAccessToken)

export default authRoutes;
