import axios from "axios"
import { errorInterceptor, responseInterceptor } from "./interceptors"
import { Environments } from "../../../environments";

const Api = axios.create({
    baseURL: Environments.URL_BASE,
})

Api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error),
);

export {Api}