import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface TokenState {
    accessToken : string;
}

const initialState : TokenState = {
    accessToken : ""
}


export const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setAccessToken : (state, action : PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        removeAccessToken : (state) => {
            state.accessToken = "";
        }
    }
});

export const { setAccessToken, removeAccessToken } = tokenSlice.actions;
export default tokenSlice.reducer;