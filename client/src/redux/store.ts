import { configureStore } from "@reduxjs/toolkit";

// Slice
import tokenReducer from "./authentication/tokenSlice";
import userInfoReducer from "./account/userInfoSlice";

export const store = configureStore({
    reducer: {
        token: tokenReducer,
        userInfo: userInfoReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
