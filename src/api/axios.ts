import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

import { toast } from "react-toastify";
import { quit } from "utils/user";

import { loadItem } from "../utils/localStorage";

const TIMEOUT = 100000;

export const apiService = axios.create();

const onResponseSuccess = (response: AxiosResponse) => response;

const onResponseError = (error: AxiosError<string>) => {
  error.response &&
    toast.error(error.response.data, {
      position: "top-right",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  if (error.response && error.response.status === 403) {
    quit();
  }

  return Promise.reject(error);
};

const onRequestSuccess = async (request: InternalAxiosRequestConfig) => {
  const config = request;

  config.timeout = TIMEOUT;
  config.baseURL = config.baseURL || process.env.API_URL;
  const authToken = loadItem("authToken") || "";
  config.headers.Authorization = `${authToken}`;
  return config;
};

apiService.interceptors.request.use(onRequestSuccess);
apiService.interceptors.response.use(onResponseSuccess, onResponseError);
