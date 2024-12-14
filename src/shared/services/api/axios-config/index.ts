import axios from "axios"
import { errorInterceptor, responseInterceptor } from "./interceptors"
import { Environments } from "../../../environments";

const Api = axios.create({
    baseURL: Environments.URL_BASE,
})

const ApiAuth = axios.create({
    baseURL: 'http://localhost:3333',
})

Api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error),
);

export {Api, ApiAuth}