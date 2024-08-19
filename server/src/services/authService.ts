
// types and interfaces
import { ILoginData } from "../interfaces/IAuth"
export interface IAuthService {
    login(data : ILoginData) : Promise<string>;
}



export class AuthService implements IAuthService {
    async login(data: ILoginData): Promise<string> {
        console.log(data)
        return ""
    }
}

