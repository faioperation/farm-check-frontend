import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import Cookies from "js-cookie";
import { BASE_URL } from "../config/api";

// Module-level singleton
const axiosSecureInstance = axios.create({
    baseURL: BASE_URL,
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logOutUser } = useAuth();

    // Track interceptor IDs to prevent stacking on every render
    const ids = useRef({ req: null, res: null });

    if (ids.current.req !== null) {
        axiosSecureInstance.interceptors.request.eject(ids.current.req);
    }
    if (ids.current.res !== null) {
        axiosSecureInstance.interceptors.response.eject(ids.current.res);
    }

    ids.current.req = axiosSecureInstance.interceptors.request.use(
        (config) => {
            const token = Cookies.get("token");
            if (token) {
                config.headers.authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // ONLY logout on 401 (token missing/expired)
    // 403 = no subscription/permission — keep user logged in, let guard handle it
    ids.current.res = axiosSecureInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error.response?.status;
            if (status === 401) {
                logOutUser();
                navigate("/auth/login");
            }
            return Promise.reject(error);
        }
    );

    return axiosSecureInstance;
};

export default useAxiosSecure;