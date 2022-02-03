import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "./Card/Card.jsx";
import styles from "./List.module.scss";

import { sortPoints } from "../../../utils/dataFormatters";
import { changeStateAction } from "../../../store/slices/appSlice";

const List = () => {
    const dispatch = useDispatch();
    const geoData = useSelector((state) => state.app.geoData);
    const pointsArray = useSelector((state) => state.app.geoData.points);

    const [currentCard, setCurrentCard] = useState(null);
    // useEffect(() => {
    //     const array = geoData.points && geoData.points.map((item, index) => ({ ...item, order: index }));
    //     dispatch(
    //         changeStateAction({
    //             pointsArray: array,
    //         }),
    //     );
    // }, [geoData.points]);

    const dragStartHandler = (e, item) => {
        console.log("drag", item);
        setCurrentCard(item);
    };

    const dragLeaveHandler = (e) => {};

    const dragEndHandler = (e) => {
        e.target.style.background = "white";
    };

    const dragOverHandler = (e) => {
        e.preventDefault();
        e.target.style.background = "lightgray";
    };

    const dropHandler = (e, item) => {
        e.preventDefault();
        console.log("drop", item);
        const array = pointsArray
            .map((card) => {
                if (card.id === item.id) {
                    return { ...card, order: currentCard.order };
                }
                if (card.id === currentCard.id) {
                    return { ...card, order: item.order };
                }
                return card;
            })
            .sort(sortPoints);
        dispatch(
            changeStateAction({
                geoData: {
                    points: array,
                },
            }),
        );

        e.target.style.background = "white";
    };

    return (
        <div className={styles.list}>
            {pointsArray &&
                pointsArray.map((item) => (
                    <Card
                        key={item.id}
                        card={item}
                        dragStartHandler={dragStartHandler}
                        dragLeaveHandler={dragLeaveHandler}
                        dragEndHandler={dragEndHandler}
                        dragOverHandler={dragOverHandler}
                        dropHandler={dropHandler}
                    />
                ))}
        </div>
    );
};

export default List;
