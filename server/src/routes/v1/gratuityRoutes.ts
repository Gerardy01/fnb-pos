import { Router } from "express";

// utils
import { PermissionEnum } from "../../utility/enums";

// middlewares
import { authenticate, validatePermission, validateRequest } from "../../utility/middleware";

// Schema
import { CreateGratuitySchema, EditGratuitySchema } from "../../schema/gratuitySchema";

// controllers
import GratuityController from "../../controllers/gratuityController";

const gratuityRoutes = Router();

gratuityRoutes.get("/",
    authenticate,
    validatePermission(PermissionEnum.GRATUITY_MANAGEMENT, 'read'),
    GratuityController.getAllGratuity
);
gratuityRoutes.get("/:id",
    authenticate,
    validatePermission(PermissionEnum.GRATUITY_MANAGEMENT, 'read'),
    GratuityController.getOneGratuity
);
gratuityRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.GRATUITY_MANAGEMENT, 'write'),
    validateRequest(CreateGratuitySchema),
    GratuityController.createGratuity
);
gratuityRoutes.put("/",
    authenticate,
    validatePermission(PermissionEnum.GRATUITY_MANAGEMENT, 'write'),
    validateRequest(EditGratuitySchema),
    GratuityController.editGratuity
);
gratuityRoutes.delete("/:id",
    authenticate,
    validatePermission(PermissionEnum.GRATUITY_MANAGEMENT, 'write'),
    GratuityController.deleteGratuity
);

export default gratuityRoutes;