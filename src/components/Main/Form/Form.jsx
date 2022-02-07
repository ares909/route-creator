import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchChosenPoint } from "../../../store/actions/actions";
import { resetError } from "../../../store/slices/appSlice";
import { geoData } from "../../../store/selectors/selectors";
import pointValidationSchema from "../../../validation/pointInput";
import styles from "./Form.module.scss";

const Form = () => {
    const dispatch = useDispatch();
    const { points, error } = useSelector(geoData);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(pointValidationSchema),
        context: { points, error },
        mode: "onSubmit",
    });
    const onSubmit = (data) => {
        dispatch(fetchChosenPoint({ point: data.point }));
        reset();
    };

    const onFocus = (e) => {
        e.preventDefault();
        dispatch(resetError());
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <input
                className={styles.input}
                type="text"
                placeholder="Новая точка маршрута"
                {...register("point")}
                onFocus={(e) => onFocus(e)}
                autoComplete="off"
            />
            {errors.point && <span className={styles.inputErrorMessage}>{errors.point?.message}</span>}
            {!errors.point && error && <span className={styles.inputErrorMessage}>{error}</span>}
        </form>
    );
};

export default Form;
