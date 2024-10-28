


export interface AccountInfoReturn {
    accountId : string;
    username : string;
    name : string;
    email : string;
    roleId : number;
    roleName : string;
    pageAccessPermissions : number[];
}

export interface ChangePasswordBodyData {
    currentPassword : string;
    newPassword : string;
}

export interface ChangePasswordData {
    oldPassword : string;
    newPassword : string;
}