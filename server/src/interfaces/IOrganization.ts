

export interface ICreateOrganizationData {
    organizationName : string;
    endValidDatetime : number;
}

export interface createOrganizationWithAccountData {
    organizationName : string;
    endValidDatetime : number;
    username : string;
    name : string;
    email : string;
    password : string;
}

export type OrganizationDataReturn = {
    organizationId : string;
    organizationName : string;
    organizationLogo : string | null;
    organizationNo : string;
    archived : boolean;
    endValidDatetime : Date;
}

export type OrganizationInfoDataReturn = {
    organizationId : string;
    organizationName : string;
    organizationLogo : string | null;
    organizationNo : string;
}

export type AdminOrganizationReturnData = {
    id : number;
    accountId : string;
    organizationId : string;
}