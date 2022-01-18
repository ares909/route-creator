import axios from "axios";
import { yandexApiKey, yandexUrl } from "../constants/constants";

export const getGeoData = async (address) => {
    const response = await axios.get(`${yandexUrl}/?format=json&apikey=${yandexApiKey}&geocode=${address}`);
    return response.data;
};
