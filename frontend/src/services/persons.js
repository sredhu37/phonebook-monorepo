import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/persons';

const getAll = () => {
    return axios.get(baseUrl);
}

const create = (newPerson) => {
    return axios.post(baseUrl, newPerson);
}

const update = (id, updatedPerson) => {
    return axios.put(`${baseUrl}/${id}`, updatedPerson);
}

const deleteOne = (id) => {
    return axios.delete(`${baseUrl}/${id}`);
}

export default {getAll, create, update, deleteOne};
