/* eslint-disable no-use-before-define */
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { fetchDraggedPoint, fetchChosenPoint } from "../actions/actions";

const initialState = {
    geoData: {
        status: "idle",
        points: [],
        chosenPoint: "",
        draggedPoint: "",
        error: null,
    },
};

const setError = (state, action) => {
    state.geoData.status = "rejected";
    state.geoData.error = action.error.message;
};

export const appSlice = createSlice({
    name: "appSlice",
    initialState,
    reducers: {
        changeStateAction(state, action) {
            return { ...state, ...action.payload };
        },
    },
    extraReducers: {
        [fetchChosenPoint.pending]: (state) => {
            state.geoData.status = "loading";
        },
        [fetchChosenPoint.fulfilled]: (state, action) => {
            state.geoData.status = "succeeded";
            state.geoData.points = [
                ...state.geoData.points,
                {
                    coordinates: action.payload.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
                        .split(" ")
                        .reverse(),
                    name: action.payload.response.GeoObjectCollection.featureMember[0].GeoObject.name,
                    request:
                        action.payload.response.GeoObjectCollection.metaDataProperty.GeocoderResponseMetaData.request,
                    id: uuidv4(),
                },
            ].map((item, index) => ({ ...item, order: index }));
            state.geoData.chosenPoint = action.payload.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
                .split(" ")
                .reverse();
        },

        [fetchDraggedPoint.fulfilled]: (state, action) => {
            state.geoData.draggedPoint = action.payload.response.GeoObjectCollection.featureMember[0].GeoObject.name;
        },

        [fetchChosenPoint.rejected]: setError,
    },
});

export const { changeStateAction } = appSlice.actions;
export default appSlice.reducer;
