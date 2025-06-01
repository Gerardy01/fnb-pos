import { Router } from 'express';

// middlewares
import { authenticate, validateRequest } from '../../utility/middleware';

// schema
import { LoginSchema, SuperAdminLoginSchema, GenerateOtpCodeSchema } from '../../schema/authSchema';

// controller
import AuthController from '../../controllers/authController';

const authRoutes = Router();

authRoutes.get("/token", AuthController.requestAccessToken)
authRoutes.post("/login", validateRequest(LoginSchema), AuthController.login);
authRoutes.post("/login/super-admin", validateRequest(SuperAdminLoginSchema), AuthController.superAdminLogin);
authRoutes.post("/logout", authenticate, AuthController.logout);
authRoutes.post("/logout-all", authenticate, AuthController.logoutAll);
authRoutes.post("/otp-code", validateRequest(GenerateOtpCodeSchema), AuthController.generateOtpCode)

export default authRoutes;
