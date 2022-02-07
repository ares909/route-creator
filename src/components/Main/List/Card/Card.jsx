import React from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { changeStateAction } from "../../../../store/slices/appSlice";
import CrossButton from "./CrossButton/CrossButton.jsx";
import { geoData } from "../../../../store/selectors/selectors";
import styles from "./Card.module.scss";

const Card = ({ card, dragEndHandler, dragOverHandler, dropHandler, dragStartHandler, active }) => {
    const cardStyle = classNames({
        [`${styles.card}`]: true,
        [`${styles.cardActive}`]: card.id === active.id,
    });
    const { points, ...rest } = useSelector(geoData);
    const dispatch = useDispatch();

    const deletePoint = (point) => {
        const array = points?.filter((item) => item.id !== point.id);
        dispatch(
            changeStateAction({
                geoData: {
                    ...rest,
                    points: array,
                    chosenPoint: array.length > 0 ? array[array.length - 1].coordinates : "",
                },
            }),
        );
    };

    return (
        <div
            className={cardStyle}
            draggable={true}
            onDragStart={(e) => dragStartHandler(e, card)}
            onDragLeave={(e) => dragEndHandler(e)}
            onDragEnd={(e) => dragEndHandler(e)}
            onDragOver={(e) => dragOverHandler(e, card)}
            onDrop={(e) => dropHandler(e, card)}
        >
            <p className={styles.text}>{card.name}</p>
            <CrossButton card={card} deletePoint={deletePoint} />
        </div>
    );
};

export default Card;
