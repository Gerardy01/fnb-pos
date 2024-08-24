import { IAccessTokenBody } from "../interfaces/IAuth";

declare module 'express-serve-static-core' {
    interface Request {
        user?: string | IAccessTokenBody;
    }
}