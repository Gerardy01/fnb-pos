
// utils
import { DataNotFound, ExistData } from "../utility/exceptions";

// types and interfaces
import { IChangeOutletStatusData, ICreateOutletData, IEditOutletData, OutletReturnData } from "../interfaces/IOutlet";
import { IOutletRepository } from "../repositories/outletRepository";
import { Transaction } from "sequelize";
import { IAccountRepository } from "../repositories/accountRepository";
import { IAccountOutletRepository } from "../repositories/accountOutletRepository";
export interface IOutletService {
    getAllOutlet(organizationId : string, accountId? : string) : Promise<OutletReturnData[]>
    getOneOutlet(outletId : string, organizationId : string) : Promise<OutletReturnData>
    createOutlet(data : ICreateOutletData, organizationId : string, transaction? : Transaction) : Promise<OutletReturnData>
    editOutlet(data : IEditOutletData, organizationId : string) : Promise<OutletReturnData>
    deleteOutlet(outletId : string, organizationId : string) : Promise<boolean>
    changeOutletStatus(data : IChangeOutletStatusData, organizationId : string) : Promise<boolean>
}


export class OutletService implements IOutletService {
    constructor(
        private outletRepository : IOutletRepository,
        private accountRepository : IAccountRepository,
        private accountOutletRepository : IAccountOutletRepository,
    ) {}

    async getAllOutlet(organizationId: string, accountId? : string): Promise<OutletReturnData[]> {

        let outlets = [];

        if (accountId) {
            outlets = await this.outletRepository.findOutletByAccountId(accountId, organizationId)
        } else {
            outlets = await this.outletRepository.findOutletByOrganization(organizationId);
        }

        const outletList : OutletReturnData[] = [];
        outlets.forEach(item => {
            outletList.push({
                outletId : item.outlet_id,
                outletName : item.outlet_name,
                address : item.address,
                city : item.city,
                province : item.province,
                postalCode : item.postal_code,
                status : item.status,
            });
        });

        return outletList;
    }

    async getOneOutlet(outletId: string, organizationId: string): Promise<OutletReturnData> {
        
        const outlet = await this.outletRepository.findOutletById(outletId);
        if (!outlet || outlet.organization_id !== organizationId) {
            throw new DataNotFound("Data not found");
        }

        return {
            outletId : outlet.outlet_id,
            outletName : outlet.outlet_name,
            address : outlet.address,
            city : outlet.city,
            province : outlet.province,
            postalCode : outlet.postal_code,
            status : outlet.status,
        }

    }

    async createOutlet(data: ICreateOutletData, organizationId: string, transaction? : Transaction): Promise<OutletReturnData> {

        // check outlet name exist
        const outletNameExist = await this.outletRepository.findOutletByNameAndOrganization(data.outletName, organizationId);
        if (outletNameExist) throw new ExistData("OUTLET409-1");

        const newOutlet = await this.outletRepository.createOutlet({
            outlet_name : data.outletName,
            address : data.address ? data.address : "",
            organization_id : organizationId,
            city : data.city ? data.city : "",
            province : data.province ? data.province : "",
            postal_code : data.postalCode ? data.postalCode : ""
        }, transaction);

        const adminAccount = await this.accountRepository.findAdminAccount(organizationId);
        if (!adminAccount) throw new Error("something wrong when getting admin account");

        await this.accountOutletRepository.createAccountOutlet({
            account_id : adminAccount.account_id,
            outlet_id : newOutlet.outlet_id,
        }, transaction);

        return {
            outletId : newOutlet.outlet_id,
            outletName : newOutlet.outlet_name,
            address : newOutlet.address,
            city : newOutlet.city,
            province : newOutlet.province,
            postalCode : newOutlet.postal_code,
            status : newOutlet.status,
        }
    }

    async editOutlet(data: IEditOutletData, organizationId: string): Promise<OutletReturnData> {

        // check outlet exist
        const targetOutlet = await this.outletRepository.findOutletById(data.outletId);
        if (!targetOutlet || targetOutlet.organization_id !== organizationId) {
            throw new DataNotFound("Data not found");
        }

        // check outlet name exist
        const outletNameExist = await this.outletRepository.findOutletByNameAndOrganization(data.outletName, organizationId);
        if (outletNameExist && outletNameExist.outlet_id !== targetOutlet.outlet_id) {
            throw new ExistData("OUTLET409-1");
        }

        targetOutlet.outlet_name = data.outletName;
        targetOutlet.address = data.address ? data.address : "";
        targetOutlet.city = data.city ? data.city : "";
        targetOutlet.province = data.province ? data.province : "";
        targetOutlet.postal_code = data.postalCode ? data.postalCode : ""

        targetOutlet.save();

        return {
            outletId : targetOutlet.outlet_id,
            outletName : targetOutlet.outlet_name,
            address : targetOutlet.address,
            city : targetOutlet.city,
            province : targetOutlet.province,
            postalCode : targetOutlet.postal_code,
            status : targetOutlet.status,
        }
    }

    async deleteOutlet(outletId: string, organizationId: string): Promise<boolean> {

        // check outlet exist
        const targetOutlet = await this.outletRepository.findOutletById(outletId);
        if (!targetOutlet || targetOutlet.organization_id !== organizationId) {
            throw new DataNotFound("Data not found");
        }

        // TODO : Probably going to need to add another validation in the future

        targetOutlet.status = false;
        targetOutlet.archived = true;

        targetOutlet.save();

        return true;
    }

    async changeOutletStatus(data: IChangeOutletStatusData, organizationId: string): Promise<boolean> {
        
        // check outlet exist
        const targetOutlet = await this.outletRepository.findOutletById(data.outletId);
        if (!targetOutlet || targetOutlet.organization_id !== organizationId) {
            throw new DataNotFound("Data not found");
        }

        // TODO : Probably going to need to add another validation in the future

        targetOutlet.status = data.newStatus;

        targetOutlet.save();

        return targetOutlet.status;
    }

}