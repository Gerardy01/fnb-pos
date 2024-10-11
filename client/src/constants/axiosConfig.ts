import axios from "axios";



export const axiosPublic = axios.create({
    baseURL : 'http://localhost:8000/api/v1'
});


export const axiosPrivate = axios.create({
    baseURL : process.env.REACT_APP_BASE_URL,
    headers : { 'Content-Type' : 'application/json' },
    withCredentials : true
});