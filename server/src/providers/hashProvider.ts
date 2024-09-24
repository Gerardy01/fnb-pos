import bcrypt from 'bcrypt';

// types and interfaces
export interface IHashProvider {
    hashString(string : string, saltRounds? : number) : Promise<string>;
    compareHash(plainText: string, hashed: string): Promise<boolean>;
}


export class BcryptHashProvider implements IHashProvider {
    async hashString(string: string, saltRounds : number = 10): Promise<string> {
        const hashedString = await bcrypt.hash(string, saltRounds);
        return hashedString;
    }

    async compareHash(plainText: string, hashed: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(plainText, hashed);
        return isMatch;
    }
}

export class TestingHashProvider implements IHashProvider {
    async hashString(string: string, saltRounds?: number): Promise<string> {
        return "aaaaa"; 
    }

    async compareHash(plainText: string, hashed: string): Promise<boolean> {
        return true;
    }
}