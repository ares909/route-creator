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
        resetError(state) {
            return {
                geoData: {
                    ...state.geoData,
                    error: null,
                },
            };
        },
    },
    extraReducers: {
        [fetchChosenPoint.pending]: (state) => {
            state.geoData.status = "loading";
        },
        [fetchChosenPoint.fulfilled]: (state, action) => {
            if (action.payload.response.GeoObjectCollection.featureMember.length > 0) {
                state.geoData.status = "succeeded";
                state.geoData.error = initialState.geoData.error;
                state.geoData.points = [
                    ...state.geoData.points,
                    {
                        coordinates: action.payload.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
                            .split(" ")
                            .reverse(),
                        name: action.payload.response.GeoObjectCollection.featureMember[0].GeoObject.name,
                        request:
                            action.payload.response.GeoObjectCollection.metaDataProperty.GeocoderResponseMetaData
                                .request,
                        id: uuidv4(),
                    },
                ].map((item, index) => ({ ...item, order: index }));
                state.geoData.chosenPoint =
                    action.payload.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
                        .split(" ")
                        .reverse();
            } else {
                state.geoData.error = "Пожалуйста, введите корректное название";
                state.geoData.status = "rejected";
            }
        },

        [fetchDraggedPoint.fulfilled]: (state, action) => {
            state.geoData.draggedPoint = action.payload.response.GeoObjectCollection.featureMember[0].GeoObject.name;
            state.geoData.chosenPoint = action.payload.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
                .split(" ")
                .reverse();
        },

        [fetchChosenPoint.rejected]: setError,
    },
});

export const { changeStateAction, resetError } = appSlice.actions;
export default appSlice.reducer;
