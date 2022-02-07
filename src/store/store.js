import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";

const store = configureStore({
    reducer: {
        app: appReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
