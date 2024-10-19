import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface UserInfoState {
    accountId : string;
    username : string;
    name : string;
    email : string;
    roleId : number | null;
    roleName : string;
    pageAccessPermissions : number[];
}

const initialState : UserInfoState = {
    accountId : "",
    username : "",
    name : "",
    email : "",
    roleId : null,
    roleName : "",
    pageAccessPermissions : []
}

export const userInfoSlice = createSlice({
    name: "userInfo",
    initialState,
    reducers: {
        setUserInfo : (state, action : PayloadAction<UserInfoState>) => {
            state.accountId = action.payload.accountId;
            state.username = action.payload.username;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.roleId = action.payload.roleId;
            state.roleName = action.payload.roleName;
            state.pageAccessPermissions = action.payload.pageAccessPermissions;
        }
    }
});

export const { setUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;