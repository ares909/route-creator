/* eslint-disable no-use-before-define */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    locationValid: false,
    modelValid: false,
    extraValid: false,
    totalValid: false,
};

export const appSlice = createSlice({
    name: "appSlice",
    initialState,
    reducers: {
        validityAction(state, action) {
            return { ...state, ...action.payload };
        },
    },
});

export const { validityAction } = appSlice.actions;
export default appSlice.reducer;
