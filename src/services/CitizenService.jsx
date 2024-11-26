// src/services/CitizenService.js
import axios from 'axios';

const API_URL = 'http://localhost/seniorpayment/index.php'; // Update to match your PHP server path

export const getCitizens = () => axios.get(API_URL);

export const getCitizenById = (id) => axios.get(`${API_URL}/${id}`);

export const createCitizen = (citizen) => axios.post(API_URL, citizen);

export const updateCitizen = (id, citizen) => axios.put(`${API_URL}/${id}`, citizen);

export const deleteCitizen = (id) => axios.delete(`${API_URL}/${id}`);

export const loginCitizen = (credentials) => {
    return axios.post(API_URL, { ...credentials, action: 'login' })
        .then(response => response.data)
        .catch(error => ({ status: 0, message: error.message }));
};

export const registerCitizen = (user) => {
    return axios.post(API_URL, user)
        .then(response => response.data)
        .catch(error => ({ status: 0, message: error.message }));
};
