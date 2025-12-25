import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

instance.interceptors.request.use(function (config) {
    // Do something before the request is sent
    return config;
  }, function (error) {
    // Do something with the request error
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    if(response && response.data) {
        return response.data;
    }
    return response;
  }, function (error) {
    if(error && error.response && error.response.data) {
        return error.response.data;
    }
    return Promise.reject(error);
  });

export default instance;