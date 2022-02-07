import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { YMaps } from "react-yandex-maps";
import Map from "./Map/Map.jsx";
import Form from "./Form/Form.jsx";
import List from "./List/List.jsx";
import { yandexApiKey } from "../../constants/constants";
import styles from "./Main.module.scss";

const Main = () => {
    return (
        <main className={styles.main}>
            <div className={styles.formContainer}>
                <Form />
                <List />
            </div>
            <YMaps
                query={{
                    apikey: yandexApiKey,
                    ns: "use-load-option",
                    load: "Map,Placemark,Polyline,control.ZoomControl,control.FullscreenControl,geoObject.addon.balloon",
                }}
            >
                <Map />
            </YMaps>
        </main>
    );
};

export default Main;
