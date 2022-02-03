import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import pointValidationSchema from "../../../validation/pointInput";
import styles from "./Form.module.scss";
import { fetchChosenPoint } from "../../../store/slices/appSlice";

const Form = () => {
    const dispatch = useDispatch();
    const points = useSelector((state) => state.app.geoData.points);
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm({
        resolver: yupResolver(pointValidationSchema),
        context: { points },
        mode: "onSubmit",
    });
    const onSubmit = (data) => {
        console.log(data);
        dispatch(fetchChosenPoint(data.point));
        reset();
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="Новая точка маршрута" {...register("point")} />
            {errors.point && <span className={styles.inputErrorMessage}>{errors.point.message}</span>}
        </form>
    );
};

export default Form;
