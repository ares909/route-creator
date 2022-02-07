import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "./Card/Card.jsx";
import styles from "./List.module.scss";

import { sortPoints } from "../../../utils/dataFormatters";
import { changeStateAction } from "../../../store/slices/appSlice";
import { geoData } from "../../../store/selectors/selectors";

const List = () => {
    const dispatch = useDispatch();
    const { points: pointsArray, ...rest } = useSelector(geoData);
    const [currentCard, setCurrentCard] = useState(null);
    const [active, setActive] = useState("");

    const dragStartHandler = (e, item) => {
        // console.log(item);
        setCurrentCard(item);
    };

    const dragEndHandler = (e) => {
        e.currentTarget.style.boxShadow = "none";
        // e.currentTarget.style.backgroundColor = "white";
        // setActive("");
    };

    const dragOverHandler = (e, item) => {
        e.preventDefault();
        e.currentTarget.style.boxShadow = "0 4px 4px gray";
        // e.currentTarget.style.backgroundColor = "gray";
    };

    const dropHandler = (e, item) => {
        // console.log(item);
        e.currentTarget.style.boxShadow = "none";
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
                    ...rest,
                },
            }),
        );
    };

    return (
        <div className={styles.list}>
            {pointsArray &&
                pointsArray.map((item) => (
                    <Card
                        active={active}
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
