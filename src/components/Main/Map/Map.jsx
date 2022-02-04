/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Map, Placemark, Polyline } from "react-yandex-maps";
import { useSelector, useDispatch } from "react-redux";
import { changeStateAction } from "../../../store/slices/appSlice";
import { fetchDraggedPoint } from "../../../store/actions/actions";
import { geoData } from "../../../store/selectors/selectors";
import useDebounce from "../../../hooks/useDebounce";
import { sortPoints } from "../../../utils/dataFormatters";
import { defaultMapState } from "../../../constants/constants";
import placeMark from "../../../images/map/placemark.svg";
import styles from "./Map.module.scss";

const YaMap = () => {
    const mapRef = useRef(null);
    const polyLineRef = useRef(null);
    const { points: pointsArray, draggedPoint: draggedName, chosenPoint } = useSelector(geoData);
    const dispatch = useDispatch();
    const [mapState, setMapState] = useState(defaultMapState);
    const [coordinates, setCoordinates] = useState({ index: "", point: "", order: "" });

    useEffect(() => {
        if (chosenPoint && pointsArray && mapRef.current) {
            mapRef.current.setCenter(chosenPoint, window.innerWidth >= 768 ? 16 : 18);
        } else {
            setMapState({ ...mapState, center: defaultMapState.center, zoom: defaultMapState.zoom });
        }
    }, [pointsArray, mapRef.current]);

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

            dispatch(
                changeStateAction({
                    geoData: {
                        points: array.sort(sortPoints),
                    },
                }),
            );
        }
    }, [draggedName]);

    const handleClick = (e) => {
        console.log(e.originalEvent.target.properties._data.hintContent);
    };

    const polyLineGeometry = useMemo(() => {
        const geometry = pointsArray && pointsArray.map((item) => item.coordinates);
        return geometry;
    }, [pointsArray]);

    const logHandler = (data, card, index) => {
        try {
            const point = data.reverse().join(",");
            dispatch(fetchDraggedPoint({ point }));
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
    // throttle, ищет по координатам адрес, добавляет его в стейт отдельный, заменяет имя и координаты точки в стейте
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
                        modules={["objectManager.addon.objectsHint"]}
                        properties={{
                            hintContent: `${item.coordinates}`,
                        }}
                        instanceRef={(ref) => {
                            if (ref) {
                                ref.geometry.events.add("change", (e) => {
                                    const newCoords = e.get("newCoordinates");
                                    // polyLineRef.current.geometry.set(index, newCoords); // изменение линии сразу при перетаскивании (работает криво, тк обновляется реф)
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
