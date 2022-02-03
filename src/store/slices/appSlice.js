/* eslint-disable no-use-before-define */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { getGeoData } from "../../api/api";
import { indexedArray } from "../../utils/dataFormatters";

const initialState = {
    geoData: {
        status: "idle",
        points: [],
        chosenPoint: "",
        draggedPoint: "",
        error: null,
        cards: [],
    },
    pointsArray: [],
};

const setError = (state, action) => {
    state.geoData.status = "rejected";
    state.geoData.error = action.error.message;
};

export const fetchChosenPoint = createAsyncThunk("appSlice/fetchChosenPoint", (point, rejectWithValue, dispatch) => {
    try {
        return getGeoData(point);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchDraggedPoint = createAsyncThunk(
    "appSlice/fetchDraggedPoint",
    async (point, rejectWithValue, dispatch) => {
        try {
            const pointName = await getGeoData(point);
            return dispatch(addDraggedPoint(pointName));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const appSlice = createSlice({
    name: "appSlice",
    initialState,
    reducers: {
        changeStateAction(state, action) {
            return { ...state, ...action.payload };
        },

        // addChosenPoint(state, action) {
        //     state.geoData.points = [
        //         ...state.geoData.points,
        //         {
        //             coordinates: action.payload.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
        //                 .split(" ")
        //                 .reverse(),
        //             name: action.payload.response.GeoObjectCollection.featureMember[0].GeoObject.name,
        //             request:
        //                 action.payload.response.GeoObjectCollection.metaDataProperty.GeocoderResponseMetaData.request,
        //             id: uuidv4(),
        //         },
        //     ].map((item, index) => ({ ...item, order: index }));
        //     state.geoData.chosenPoint = action.payload.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
        //         .split(" ")
        //         .reverse();
        // },
        addDraggedPoint(state, action) {
            // state.geoData.draggedPoint.coordinates =
            //     action.payload.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();
            state.geoData.draggedPoint = action.payload.response.GeoObjectCollection.featureMember[0].GeoObject.name;
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

        [fetchChosenPoint.rejected]: setError,
    },
});

export const { changeStateAction, addChosenPoint, addDraggedPoint } = appSlice.actions;
export default appSlice.reducer;
