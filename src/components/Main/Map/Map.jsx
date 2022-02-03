/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Map, Placemark, Clusterer, Polyline } from "react-yandex-maps";
import { useSelector, useDispatch } from "react-redux";
import { changeStateAction, fetchChosenPoint, fetchDraggedPoint } from "../../../store/slices/appSlice";
import { defaultMapState } from "../../../constants/constants";
import placeMark from "../../../images/map/placemark.svg";
import styles from "./Map.module.scss";
import useDebounce from "../../../hooks/pointDebounce";
import { sortPoints } from "../../../utils/dataFormatters";
import { getGeoData } from "../../../api/api";

const YaMap = () => {
    const mapRef = useRef(null);
    const polyLineRef = useRef(null);
    const dispatch = useDispatch();
    const geoData = useSelector((state) => state.app.geoData);
    const pointsArray = useSelector((state) => state.app.geoData.points);
    const draggedName = useSelector((state) => state.app.geoData.draggedPoint);
    const cards = useSelector((state) => state.app.cards);
    const [mapState, setMapState] = useState(defaultMapState);
    const [coordinates, setCoordinates] = useState({ index: "", point: "", order: "" });

    useEffect(() => {
        if (geoData.chosenPoint && geoData.points && mapRef.current) {
            mapRef.current.setCenter(geoData.chosenPoint, window.innerWidth >= 768 ? 16 : 18);
        } else {
            setMapState({ ...mapState, center: defaultMapState.center, zoom: defaultMapState.zoom });
        }
    }, [geoData.points, mapRef.current]);

    useEffect(() => {
        if (draggedName) {
            const array = [
                ...pointsArray.filter((item) => item.id !== coordinates.id),
                {
                    id: coordinates.id,
                    order: coordinates.order,
                    coordinates: coordinates.point,
                    name: draggedName,
                    request: "",
                },
            ];

            // pointsArray.map((item) =>
            //     item.id === coordinates.id
            //         ? { ...item, coordinates: coordinates.point, name: draggedName, request: "" }
            //         : item,
            // );
            dispatch(
                changeStateAction({
                    geoData: {
                        points: array,
                    },
                }),
            );
        }
    }, [draggedName]);

    //

    const handleClick = (e) => {
        console.log(e.originalEvent.target.properties._data.hintContent);
    };

    const polyLineGeometry = useMemo(() => {
        const geometry = pointsArray && pointsArray.map((item) => item.coordinates);
        return geometry;
    }, [pointsArray]);

    // const changePoints = (point, array, coordinates) => {
    //     console.log(array.filter((item, index) => array.indexOf(item) !== point.index));
    //     console.log(coordinates.join(", "));
    // };

    const logHandler = (data, card, index) => {
        try {
            const point = data.reverse().join(",");
            dispatch(fetchDraggedPoint(point));
            setCoordinates(() => ({
                ...coordinates,
                index,
                point: data.reverse(),
                order: card.order,
                id: card.id,
            }));
        } catch (e) {
            console.log(e);
        }
    };

    // setDraggedPoint(card);
    // console.log(point, card);

    // //
    // // // console.log(data.join(", "));
    // // console.log(data);
    // setCoordinates(data.reverse().join(","));

    // // polyLineRef.current = null;
    // };

    const debouncedValue = useDebounce(logHandler, 500);

    return (
        <Map
            className={styles.map}
            state={{ center: mapState.center, zoom: mapState.zoom, controls: ["zoomControl"] }}
            options={{ autoFitToViewport: "always" }}
            instanceRef={(ref) => {
                mapRef.current = ref;
            }}
        >
            {" "}
            <Polyline
                geometry={polyLineGeometry}
                instanceRef={polyLineRef}
                options={{
                    balloonCloseButton: false,
                    strokeColor: "#000",
                    strokeWidth: 4,
                    strokeOpacity: 0.5,
                }}
            />
            {pointsArray &&
                pointsArray.map((item, index) => (
                    <Placemark
                        key={item.id}
                        geometry={item.coordinates}
                        options={{
                            // preset: "islands#darkGreenCircleIcon",
                            iconLayout: "default#image",
                            iconImageHref: placeMark,
                            iconImageSize: [18, 18],
                            iconImageOffset: [-18, -18],
                            draggable: true,
                        }}
                        onClick={handleClick}
                        // onDrag={handleClick}
                        modules={["objectManager.addon.objectsHint"]}
                        properties={{
                            hintContent: `${item.coordinates}`,
                        }}
                        instanceRef={(ref) => {
                            // тут сделать throttle, искать по координатам адрес, добавлять его в стейт отдельный, заменять имя и координаты точки в стейте
                            if (ref) {
                                ref.geometry.events.add("change", (e) => {
                                    const newCoords = e.get("newCoordinates");
                                    // polyLineRef.current.geometry.set(index, newCoords);
                                    debouncedValue(newCoords, item, index);
                                });
                            }
                        }}
                    />
                ))}
        </Map>
    );
};

export default YaMap;

/*
* <Clusterer
                options={{
                    preset: "islands#invertedDarkGreenClusterIcons",
                    groupByCoordinates: false,
                }}
            >
                {geoData.points
                    ? geoData.points.map((item, index) => (
                          <Placemark
                              key={item.coordinates}
                              geometry={item.coordinates}
                              options={{
                                  // preset: "islands#darkGreenCircleIcon",
                                  iconLayout: "default#image",
                                  iconImageHref: placeMark,
                                  iconImageSize: [18, 18],
                                  iconImageOffset: [-18, -18],
                                  draggable: true,
                              }}
                              onClick={handleClick}
                              modules={["objectManager.addon.objectsHint"]}
                              properties={{
                                  hintContent: `${item.coordinates}`,
                              }}
                          />
                      ))
                    : ""}
            </Clusterer> */
