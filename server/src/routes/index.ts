import { Router } from 'express';

// routes version
import v1Api from './v1';

const api = Router();


api.use("/v1", v1Api);

export default api;