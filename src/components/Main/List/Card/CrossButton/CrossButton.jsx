import React from "react";
import crossButton from "../../../../../images/input/inputCrossButton.svg";
import styles from "./CrossButton.module.scss";

const CrossButton = ({ card, deletePoint }) => {
    const handleClick = (point) => {
        deletePoint(point);
    };

    return (
        <button className={styles.inputCrossButton} onClick={() => handleClick(card)}>
            {" "}
            <img src={crossButton} alt="крестик" />
        </button>
    );
};

export default CrossButton;
