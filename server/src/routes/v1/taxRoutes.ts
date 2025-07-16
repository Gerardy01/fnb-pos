import { Router } from "express";

// utils
import { PermissionEnum } from "../../utility/enums";

// middlewares
import { authenticate, validatePermission, validateRequest } from "../../utility/middleware";

// schema
import { CreateTaxSchema, EditTaxSchema } from "../../schema/taxSchema";

// controllers
import TaxController from "../../controllers/taxController";

const taxRoutes = Router();

taxRoutes.get("/",
    authenticate,
    validatePermission(PermissionEnum.TAX_MANAGEMENT, 'read'),
    TaxController.getAllTax
);
taxRoutes.get("/action/complete",
    authenticate,
    validatePermission(PermissionEnum.TAX_MANAGEMENT, 'read'),
    TaxController.getAllTaxComplete
);
taxRoutes.get("/:id",
    authenticate,
    validatePermission(PermissionEnum.TAX_MANAGEMENT, 'read'),
    TaxController.getOneTax
);
taxRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.TAX_MANAGEMENT, 'write'),
    validateRequest(CreateTaxSchema),
    TaxController.createTax
);
taxRoutes.put("/",
    authenticate,
    validatePermission(PermissionEnum.TAX_MANAGEMENT, 'write'),
    validateRequest(EditTaxSchema),
    TaxController.editTax
);
taxRoutes.delete("/:id",
    authenticate,
    validatePermission(PermissionEnum.TAX_MANAGEMENT, 'write'),
    TaxController.deleteTax
);

export default taxRoutes;