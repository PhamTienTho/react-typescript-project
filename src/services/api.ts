import axios from 'services/axios.customize.ts';

const loginAPI = (username: string, password: string) => {
    const urlBackend = '/api/v1/auth/login';
    return axios.post<IBackendRes<ILogin>>(urlBackend, {username, password});
}

const registerAPI = (fullName: string, email: string, password: string, phone: string) => {
    const urlBackend = '/api/v1/user/register';
    return axios.post<IBackendRes<IRegister>>(urlBackend, {fullName, email, password, phone});
}

const fetchAccountAPI = () => {
    const urlBackend = '/api/v1/auth/account';
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
        headers: {
            delay: 1500
        }
    });
}

export {loginAPI, registerAPI, fetchAccountAPI}