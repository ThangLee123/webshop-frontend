import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://webshop-api.onrender.com/',
});
