import axios from "axios";

// redux
import { store } from "../redux/store";
import { setAccessToken } from "../redux/authentication/tokenSlice";



export const axiosPublic = axios.create({
    baseURL : 'http://localhost:8000/api/v1'
});


export const axiosPrivate = axios.create({
    baseURL : process.env.REACT_APP_BASE_URL,
    withCredentials : true
});


axiosPrivate.interceptors.request.use(
    config => {
        const accessToken = store.getState().token;

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

            store.dispatch(setAccessToken(newAccessToken));
        } catch(err) {
            window.location.href = '/login';
            return Promise.reject(err);
        }
    }
)