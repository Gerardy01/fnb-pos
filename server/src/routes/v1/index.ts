import { Router } from 'express';


// routes
import authRoutes from './authRoutes';
import accountRoutes from './accountRoutes';
import organizationRoutes from './organizationRoutes';
import roleRoutes from './roleRoutes';
import permissionRoutes from './permissionRoutes';
import outletRoutes from './outletRoutes';
import tableGroupRoutes from './tableGroupRoutes';
import tableRoutes from './tableRoutes';
import gratuityRoutes from './gratuityRoutes';
import salesTypeRoutes from './salesTypeRoutes';


const v1Api = Router();

v1Api.use("/", authRoutes);
v1Api.use("/account", accountRoutes);
v1Api.use("/organization", organizationRoutes);
v1Api.use("/role", roleRoutes);
v1Api.use("/permission", permissionRoutes);
v1Api.use("/outlet", outletRoutes);
v1Api.use("/table-group", tableGroupRoutes);
v1Api.use("/table", tableRoutes);
v1Api.use("/gratuity", gratuityRoutes);
v1Api.use("/sales-type", salesTypeRoutes);


export default v1Api;