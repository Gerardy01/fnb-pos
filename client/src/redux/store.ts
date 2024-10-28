import { configureStore } from "@reduxjs/toolkit";

// Slice
import tokenReducer from "./authentication/tokenSlice";
import userInfoReducer from "./account/userInfoSlice";
import organizationInfoReducer from "./organization/organizationSlice";

export const store = configureStore({
    reducer: {
        token: tokenReducer,
        userInfo: userInfoReducer,
        organizationInfo : organizationInfoReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
