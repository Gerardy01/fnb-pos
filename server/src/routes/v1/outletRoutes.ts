import { Router } from 'express';

// utils
import { PermissionEnum } from '../../utility/enums';

// middleware
import { authenticate, validatePermission, validateRequest } from '../../utility/middleware';

// schema
import { ChangeOutletStatusSchema, CreateOutletSchema, EditOutletSchema } from '../../schema/outletSchema';

// controllers
import OutletController from '../../controllers/outletController';

const outletRoutes = Router();

outletRoutes.get("/",
    authenticate,
    validatePermission(PermissionEnum.OUTLET_MANAGEMENT, 'read'),
    OutletController.getAllOutlet
);
outletRoutes.get("/:id",
    authenticate,
    validatePermission(PermissionEnum.OUTLET_MANAGEMENT, 'read'),
    OutletController.getOneOutlet
);
outletRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.OUTLET_MANAGEMENT, 'write'),
    validateRequest(CreateOutletSchema),
    OutletController.createOutlet
);
outletRoutes.put("/",
    authenticate,
    validatePermission(PermissionEnum.OUTLET_MANAGEMENT, 'write'),
    validateRequest(EditOutletSchema),
    OutletController.editOutlet
);
outletRoutes.put("/action/change-status",
    authenticate,
    validatePermission(PermissionEnum.OUTLET_MANAGEMENT, 'write'),
    validateRequest(ChangeOutletStatusSchema),
    OutletController.changeOutletStatus
);
outletRoutes.delete("/:id",
    authenticate,
    validatePermission(PermissionEnum.OUTLET_MANAGEMENT, 'write'),
    OutletController.deleteOutlet
);

export default outletRoutes;