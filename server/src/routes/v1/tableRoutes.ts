import { Router } from "express";

// utils
import { PermissionEnum } from '../../utility/enums';

// middlewares
import { authenticate, validatePermission, validateRequest } from '../../utility/middleware';

// schema
import { ChangeTableStatusSchema, CreateTableSchema, EditTableSchema } from "../../schema/tableSchema";

// controllers
import TableController from "../../controllers/tableController";

const tableRoutes = Router();

tableRoutes.get("/",
    authenticate,
    validatePermission(PermissionEnum.TABLE_MANAGEMENT, 'read'),
    TableController.getAllTable
);
tableRoutes.get("/:id",
    authenticate,
    validatePermission(PermissionEnum.TABLE_MANAGEMENT, 'read'),
    TableController.getOneTable
);
tableRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.TABLE_MANAGEMENT, 'write'),
    validateRequest(CreateTableSchema),
    TableController.createTable
);
tableRoutes.put("/",
    authenticate,
    validatePermission(PermissionEnum.TABLE_MANAGEMENT, 'write'),
    validateRequest(EditTableSchema),
    TableController.editTable
);
tableRoutes.put("/action/change-status",
    authenticate,
    validatePermission(PermissionEnum.TABLE_MANAGEMENT, 'write'),
    validateRequest(ChangeTableStatusSchema),
    TableController.changeTableStatus
);
tableRoutes.delete("/:id",
    authenticate,
    validatePermission(PermissionEnum.TABLE_MANAGEMENT, 'write'),
    TableController.deleteTable
);

export default tableRoutes;