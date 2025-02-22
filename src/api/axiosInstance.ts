import axios from 'axios';
import useAuthStore from '../store/authStore';
import useDashboardStore from '../store/dashboardStore';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000', // Replace with your base URL
});

let isRefreshing = false;
type FailedRequest = {
    resolve: (value?: unknown) => void;
    reject: (reason?: Error) => void;
};

let failedQueue: FailedRequest[] = [];

const setLoading = useAuthStore.getState().setLoading;

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

axiosInstance.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        setLoading(true);
        return config;
    },
    (error) => {
        setLoading(false);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        setLoading(false);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error?.code !== "ERR_NETWORK" && error?.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = useAuthStore.getState().refreshToken;
            if (refreshToken === '' || refreshToken === null) {
                processQueue(new Error('No refresh token available'), null);
                useAuthStore.getState().signOut();
                useDashboardStore.getState().clear();
                setLoading(false);
                isRefreshing = false;
                return Promise.reject(error);
            }
            return new Promise(function (resolve, reject) {
                axios
                    .post('http://127.0.0.1:8000/refresh', { refresh_token: refreshToken })
                    .then(({ data }) => {
                        const accessToken = data.access_token;
                        const refreshToken = data.refresh_token;
                        useAuthStore.getState().setToken(accessToken);
                        useAuthStore.getState().setRefreshToken(refreshToken);
                        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
                        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
                        processQueue(null, data.accessToken);
                        resolve(axiosInstance(originalRequest));
                    })
                    .catch((err) => {
                        processQueue(err, null);
                        useAuthStore.getState().signOut();
                        useDashboardStore.getState().clear();
                        reject(err);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }
        if (error?.code == "ERR_NETWORK") {
            useAuthStore.getState().signOut();
            useDashboardStore.getState().clear();
        }
        setLoading(false);
        return Promise.reject(error);
    }
);

export default axiosInstance;