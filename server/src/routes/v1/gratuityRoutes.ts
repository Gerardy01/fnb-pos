import { Router } from "express";

// utils
import { PermissionEnum } from "../../utility/enums";

// middlewares
import { authenticate, validatePermission, validateRequest } from "../../utility/middleware";

// Schema
import { CreateGratuitySchema } from "../../schema/gratuitySchema";

// controllers
import GratuityController from "../../controllers/gratuityController";

const gratuityRoutes = Router();

gratuityRoutes.get("/",
    authenticate,
    validatePermission(PermissionEnum.GRATUITY_MANAGEMENT, 'read'),
    GratuityController.getAllGratuity
);
gratuityRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.GRATUITY_MANAGEMENT, 'write'),
    validateRequest(CreateGratuitySchema),
    GratuityController.createGratuity
);

export default gratuityRoutes;