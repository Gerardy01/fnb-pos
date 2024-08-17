import bcrypt from 'bcrypt';

// types and interfaces
export interface IHashProvider {
    hashString(string : string, saltRounds? : number) : Promise<string>;
}


export class BcryptHashProvider implements IHashProvider {
    async hashString(string: string, saltRounds : number = 10): Promise<string> {
        const hashedPassword = await bcrypt.hash(string, saltRounds);
        return hashedPassword;
    }
}