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
import { useMapper } from "../../../hooks/useMapper";

const YaMap = () => {
    const mapRef = useRef(null);
    const polyLineRef = useRef(null);
    const { points: pointsArray, draggedPoint: draggedName, chosenPoint, ...rest } = useSelector(geoData);
    const dispatch = useDispatch();
    const mapObj = useMapper();
    const [mapState, setMapState] = useState(defaultMapState);
    const [coordinates, setCoordinates] = useState({ index: "", point: "", order: "" });

    useEffect(() => {
        if (chosenPoint && mapRef.current) {
            mapRef.current.setCenter(chosenPoint, window.innerWidth >= 768 ? 16 : 18);
        } else if (!chosenPoint && mapRef.current) {
            mapRef.current.setCenter(defaultMapState.center, defaultMapState.zoom);
        } else {
            setMapState({ ...mapState, center: defaultMapState.center, zoom: defaultMapState.zoom });
        }
    }, [mapRef.current, chosenPoint]);

    useEffect(() => {
        const value = mapObj({ coordinates, draggedName }, "pushPoint");
        if (draggedName) {
            const array = [
                ...pointsArray.filter((item) => item.id !== coordinates.id),
                {
                    ...value,
                },
            ];

            dispatch(
                changeStateAction({
                    geoData: {
                        points: array.sort(sortPoints),
                        ...rest,
                        chosenPoint,
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

    // обернул эту функцию в try catch так как из-за callbackRef в карте - она срабатывает дважды

    const logHandler = (data, card, index) => {
        try {
            const point = data.reverse().join(",");
            const value = mapObj({ data, card, index }, "drag");
            dispatch(fetchDraggedPoint({ point }));
            setCoordinates(() => ({
                ...coordinates,
                ...value,
            }));
        } catch (e) {
            console.log(e);
        }
    };
    // debounce после задержки перемещения точки на карте ищет по координатам адрес, добавляет его в стейт отдельный, заменяет имя и координаты точки в стейте
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
                            iconImageSize: [25, 25],
                            iconImageOffset: [-10, -20],
                            draggable: true,
                            // hasBalloon: true,
                            // openBalloonOnClick: true,
                        }}
                        onClick={handleClick}
                        modules={["objectManager.addon.objectsHint", "geoObject.addon.balloon"]}
                        properties={{
                            hintContent: `${item.coordinates}`,
                            balloonContent: `<p>${item.name}<p/>`,
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
