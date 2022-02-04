import axios from "axios";
import { yandexApiKey, yandexUrl } from "../constants/constants";

// eslint-disable-next-line import/prefer-default-export
export const getGeoData = async (address) => {
    const response = await axios.get(`${yandexUrl}/?format=json&apikey=${yandexApiKey}&geocode=${address}`);
    return response.data;
};
