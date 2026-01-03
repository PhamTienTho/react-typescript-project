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
            delay: 1000
        }
    });
}

const getUserAPI = (query: string) => {
    const urlBackend = `/api/v1/user?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
}

const logoutAPI = () => {
    const urlBackend = '/api/v1/auth/logout';
    return axios.post<IBackendRes<IRegister>>(urlBackend);
}

const createUserAPI = (fullName: string, password: string, email: string, phone: string) => {
    const urlBackend = '/api/v1/user';
    return axios.post<IBackendRes<IUserTable>>(urlBackend, {fullName, password, email, phone});
} 

const bulkCreateUserAPI = (data: {
    fullName: string;
    password: string;
    email: string;
    phone: string;
}[]) => {
    const urlBackend = '/api/v1/user/bulk-create';
    return axios.post<IBackendRes<IResponseImport>>(urlBackend, data);
}

const updateUserAPI = (_id: string, fullName: string, phone: string) => {
    const urlBackend = '/api/v1/user';
    return axios.put<IBackendRes<IRegister>>(urlBackend, {_id, fullName, phone});
}

const deleteUser = (_id: string) => {
    const urlBackend = `/api/v1/user/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend);
}

const getBookAPI = (query: string) => {
    const urlBackend = `/api/v1/book${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend);
}

export {loginAPI, registerAPI, fetchAccountAPI, logoutAPI,
     getUserAPI, createUserAPI, bulkCreateUserAPI, updateUserAPI,
    deleteUser, getBookAPI}