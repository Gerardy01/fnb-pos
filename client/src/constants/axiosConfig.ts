import axios from "axios";

// utils
import { getAccessToken, storeAccessToken } from "../utils/intermediaryService";



export const axiosPublic = axios.create({
    baseURL : import.meta.env.VITE_API_BASE_URL
});


export const axiosPrivate = axios.create({
    baseURL : import.meta.env.VITE_API_BASE_URL,
    withCredentials : true
});


axiosPrivate.interceptors.request.use(
    config => {
        const accessToken = getAccessToken();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const res = await axiosPrivate.get('/token');
            const newAccessToken = res.data.data.accessToken ? res.data.data.accessToken : "";

            storeAccessToken(newAccessToken);
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            
            return axiosPrivate(originalRequest);
        } catch(err) {
            window.location.href = '/login';
            return Promise.reject(err);
        }
    }
)