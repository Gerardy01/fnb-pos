import { Router } from 'express';


// routes
import accountRoutes from './accountRoutes';


const v1Api = Router();

v1Api.use("/account", accountRoutes);


export default v1Api;