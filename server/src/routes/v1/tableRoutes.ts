import { Router } from "express";

// utils
import { PermissionEnum } from '../../utility/enums';

// middlewares
import { authenticate, validatePermission, validateRequest } from '../../utility/middleware';

// schema
import { CreateTableSchema } from "../../schema/tableSchema";

// controllers
import TableController from "../../controllers/tableController";

const tableRoutes = Router();

tableRoutes.get("/",
    authenticate,
    validatePermission(PermissionEnum.TABLE_MANAGEMENT, 'read'),
    TableController.getAllTable
);
tableRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.TABLE_MANAGEMENT, 'write'),
    validateRequest(CreateTableSchema),
    TableController.createTable
);

export default tableRoutes;