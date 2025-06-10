


export interface AuthData {
    identifier : string;
    password : string;
}

export interface AuthReturn {
    accessToken : string
}

export interface LoginData {
    identifier : string;
    password : string;
    rememberMe : boolean;
}

export interface GenerateOtpData {
    address : string;
}

export interface GenerateTokenAuthData {
    email : string;
}