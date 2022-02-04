import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchChosenPoint } from "../../../store/actions/actions";
import { geoData } from "../../../store/selectors/selectors";
import pointValidationSchema from "../../../validation/pointInput";
import styles from "./Form.module.scss";

const Form = () => {
    const dispatch = useDispatch();
    const { points } = useSelector(geoData);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(pointValidationSchema),
        context: { points },
        mode: "onSubmit",
    });
    const onSubmit = (data) => {
        dispatch(fetchChosenPoint({ point: data.point }));
        reset();
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="Новая точка маршрута" {...register("point")} />
            {errors.point && <span className={styles.inputErrorMessage}>{errors.point?.message}</span>}
        </form>
    );
};

export default Form;
