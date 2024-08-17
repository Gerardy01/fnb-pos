

export interface ICreateOrganizationData {
    organizationName : string;
    endValidDatetime : number;
}

export type OrganizationDataReturn = {
    organizationId : string;
    organizationName : string;
    organizationLogo : string | null;
    organizationNo : string;
    archived : boolean;
    endValidDatetime : Date;
}

export interface createOrganizationWithAccountData {
    organizationName : string;
    endValidDatetime : number;
    username : string;
    name : string;
    email : string;
    password : string;
}