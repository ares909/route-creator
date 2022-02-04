import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeStateAction } from "../../../../store/slices/appSlice";
import CrossButton from "./CrossButton/CrossButton.jsx";
import { geoData } from "../../../../store/selectors/selectors";
import styles from "./Card.module.scss";

const Card = ({ card, dragEndHandler, dragOverHandler, dropHandler, dragStartHandler }) => {
    const { points } = useSelector(geoData);
    const dispatch = useDispatch();

    const deletePoint = (point) => {
        const array = points?.filter((item) => item.id !== point.id);
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
