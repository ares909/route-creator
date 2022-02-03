import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeStateAction } from "../../../../store/slices/appSlice";
import CrossButton from "./CrossButton/CrossButton.jsx";
import styles from "./Card.module.scss";

const Card = ({ card, dragEndHandler, dragLeaveHandler, dragOverHandler, dropHandler, dragStartHandler }) => {
    const geoData = useSelector((state) => state.app.geoData);
    const pointsArray = useSelector((state) => state.app.pointsArray);
    const dispatch = useDispatch();

    const deletePoint = (point) => {
        const array = geoData.points.filter((item) => item.id !== point.id);
        dispatch(
            changeStateAction({
                geoData: {
                    points: array,
                },
            }),
        );
    };

    return (
        <div
            className={styles.card}
            draggable={true}
            onDragStart={(e) => dragStartHandler(e, card)}
            onDragLeave={(e) => dragEndHandler(e)}
            onDragEnd={(e) => dragEndHandler(e)}
            onDragOver={(e) => dragOverHandler(e)}
            onDrop={(e) => dropHandler(e, card)}
        >
            {card.name}
            <CrossButton card={card} deletePoint={deletePoint} />
        </div>
    );
};

export default Card;
