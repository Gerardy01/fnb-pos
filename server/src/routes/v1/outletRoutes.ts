import { Router } from 'express';

// utils
import { PermissionEnum } from '../../utility/enums';

// middleware
import { authenticate, validatePermission, validateRequest } from '../../utility/middleware';

// schema
import { CreateOutletSchema } from '../../schema/outletSchema';

// controllers
import OutletController from '../../controllers/outletController';

const outletRoutes = Router();

outletRoutes.get("/",
    authenticate,
    validatePermission(PermissionEnum.OUTLET_MANAGEMENT, 'read'),
    OutletController.getAllOutlet
);
outletRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.OUTLET_MANAGEMENT, 'write'),
    validateRequest(CreateOutletSchema),
    OutletController.createOutlet
);

export default outletRoutes;