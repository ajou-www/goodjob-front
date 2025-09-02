import axios from 'axios';
import useAuthStore from '../store/authStore';
import { SERVER_IP } from '../../src/constants/env';

const axiosInstance = axios.create({
    baseURL: `${SERVER_IP}`,
    withCredentials: true,
});

const refreshClient = axios.create({
    baseURL: `${SERVER_IP}`,
    withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null, error?: unknown) => void> = [];

const subscribeTokenRefresh = (cb: (token: string | null, error?: unknown) => void) => {
    refreshSubscribers.push(cb);
};

const notifySubscribers = (token: string | null, error?: unknown) => {
    refreshSubscribers.forEach((cb) => cb(token, error));
    refreshSubscribers = [];
};

axiosInstance.interceptors.request.use(
    (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config || {};

        const status = error.response?.status;
        const url: string = originalRequest.url || '';
        const alreadyRetried = Boolean(originalRequest._retry);

        if (status === 401 && !url.includes('/auth/token/refresh') && !alreadyRetried) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh((token, err) => {
                        if (err || !token) {
                            reject(err || new Error('Token refresh failed'));
                            return;
                        }
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            isRefreshing = true;
            try {
                const res = await refreshClient.post(
                    '/auth/token/refresh',
                    {},
                    { withCredentials: true }
                );
                const { accessToken } = res.data || {};

                if (!accessToken) {
                    throw new Error('No accessToken from refresh');
                }

                useAuthStore.getState().setTokens(accessToken);
                notifySubscribers(accessToken);

                isRefreshing = false;

                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                notifySubscribers(null, refreshError);
                isRefreshing = false;
                useAuthStore.getState().clearTokens();
                window.location.href = '/signIn';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
