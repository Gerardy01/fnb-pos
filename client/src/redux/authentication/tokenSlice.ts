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
        }
    }
});

export const { setAccessToken } = tokenSlice.actions;
export default tokenSlice.reducer;