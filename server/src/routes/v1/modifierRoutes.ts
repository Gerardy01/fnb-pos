import { Router } from "express";

// utils
import { PermissionEnum } from "../../utility/enums";

// middlewares
import { authenticate, validatePermission, validateRequest } from "../../utility/middleware";

// schema
import { CreateModifierSchema, EditModifierSchema } from "../../schema/modifierSchema";

// controller
import ModifierController from "../../controllers/modifierController";

const modifierRoutes = Router();

modifierRoutes.get("/",
    authenticate,
    validatePermission(PermissionEnum.MODIFIER_MANAGEMENT, 'read'),
    ModifierController.getAllModifier
);
modifierRoutes.get("/:id",
    authenticate,
    validatePermission(PermissionEnum.MODIFIER_MANAGEMENT, 'read'),
    ModifierController.getOneModifier
);
modifierRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.MODIFIER_MANAGEMENT, 'write'),
    validateRequest(CreateModifierSchema),
    ModifierController.createModifier
);
modifierRoutes.put("/",
    authenticate,
    validatePermission(PermissionEnum.MODIFIER_MANAGEMENT, 'write'),
    validateRequest(EditModifierSchema),
    ModifierController.editModifier
);
modifierRoutes.delete("/:id",
    authenticate,
    validatePermission(PermissionEnum.MODIFIER_MANAGEMENT, 'write'),
    ModifierController.deleteModifier
);

export default modifierRoutes;