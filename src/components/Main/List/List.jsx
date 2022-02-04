import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "./Card/Card.jsx";
import styles from "./List.module.scss";

import { sortPoints } from "../../../utils/dataFormatters";
import { changeStateAction } from "../../../store/slices/appSlice";
import { geoData } from "../../../store/selectors/selectors";

const List = () => {
    const dispatch = useDispatch();
    const { points: pointsArray } = useSelector(geoData);
    const [currentCard, setCurrentCard] = useState(null);

    const dragStartHandler = (e, item) => {
        setCurrentCard(item);
    };

    const dragEndHandler = (e) => {
        e.target.style.background = "white";
    };

    const dragOverHandler = (e) => {
        e.preventDefault();
        e.target.style.background = "lightgray";
    };

    const dropHandler = (e, item) => {
        e.preventDefault();
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
                        dragEndHandler={dragEndHandler}
                        dragOverHandler={dragOverHandler}
                        dropHandler={dropHandler}
                    />
                ))}
        </div>
    );
};

export default List;
