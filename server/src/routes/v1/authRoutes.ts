import { Router } from 'express';

// middlewares
import { authenticate, validateRequest, publicApiRateLimiter } from '../../utility/middleware';

// schema
import { LoginSchema, SuperAdminLoginSchema, GenerateOtpCodeSchema, GenerateTokenSchema } from '../../schema/authSchema';

// controller
import AuthController from '../../controllers/authController';

const authRoutes = Router();

authRoutes.get("/token", AuthController.requestAccessToken)
authRoutes.post("/login", publicApiRateLimiter, validateRequest(LoginSchema), AuthController.login);
authRoutes.post("/login/super-admin", publicApiRateLimiter, validateRequest(SuperAdminLoginSchema), AuthController.superAdminLogin);
authRoutes.post("/logout", authenticate, AuthController.logout);
authRoutes.post("/logout-all", authenticate, AuthController.logoutAll);
authRoutes.post("/otp-code", publicApiRateLimiter, validateRequest(GenerateOtpCodeSchema), AuthController.generateOtpCode);
authRoutes.post("/generate-token", publicApiRateLimiter, validateRequest(GenerateTokenSchema), AuthController.generateTokenAuth)

export default authRoutes;
