
// utils
import { DataNotFound, ExistData } from "../utility/exceptions";

// types and interfaces
import { ICreateOutletData, OutletReturnData } from "../interfaces/IOutlet";
import { IOutletRepository } from "../repositories/outletRepository";
export interface IOutletService {
    getAllOutlet(organizationId : string) : Promise<OutletReturnData[]>
    createOutlet(data : ICreateOutletData, organizationId : string) : Promise<OutletReturnData>
}


export class OutletService implements IOutletService {
    constructor(
        private outletRepository : IOutletRepository,
    ) {}

    async getAllOutlet(organizationId: string): Promise<OutletReturnData[]> {

        const outlets = await this.outletRepository.findOutletByOrganization(organizationId);

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

    async createOutlet(data: ICreateOutletData, organizationId: string): Promise<OutletReturnData> {

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
        });

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

}