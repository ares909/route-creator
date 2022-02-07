import * as yup from "yup";

const pointValidationSchema = yup.object().shape({
    point: yup
        .string()
        .required("Поле не должно быть пустым")
        .matches(/[a-zA-ZА-Яа-яЁё]/, "Введите адрес в формате 'Город,улица'")
        .when("$points", (points, schema) => {
            return schema.test(
                "pointName",
                "Данный адрес уже существует",
                (value) =>
                    value &&
                    !points.map((item) => item.name).includes(value) &&
                    value &&
                    !points.map((item) => item.request).includes(value),
            );
        }),
});

export default pointValidationSchema;
