import { createAsyncThunk } from "@reduxjs/toolkit";
import { getGeoData } from "../../api/api";

export const fetchChosenPoint = createAsyncThunk("appSlice/fetchChosenPoint", ({ point }, rejectWithValue) => {
    try {
        return getGeoData(point);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchDraggedPoint = createAsyncThunk("appSlice/fetchDraggedPoint", ({ point }, rejectWithValue) => {
    try {
        return getGeoData(point);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
