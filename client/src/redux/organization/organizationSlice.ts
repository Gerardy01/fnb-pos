import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface OrganizationInfoState {
    organizationId : string;
    organizationName : string;
    organizationLogo : string | null;
    organizationNo : string;
}

const initialState : OrganizationInfoState = {
    organizationId : "",
    organizationName : "",
    organizationLogo : "",
    organizationNo : ""
}

export const organizationInfoSlice = createSlice({
    name: "organizationInfo",
    initialState,
    reducers: {
        setOrganizationInfo : (state, action : PayloadAction<OrganizationInfoState>) => {
            state.organizationId = action.payload.organizationId;
            state.organizationName = action.payload.organizationName;
            state.organizationLogo = action.payload.organizationLogo;
            state.organizationNo = action.payload.organizationNo
        }
    }
});

export const { setOrganizationInfo } = organizationInfoSlice.actions;
export default organizationInfoSlice.reducer;