import axios from 'axios';

console.log(`Host: ${process.env.REACT_APP_BACKEND_HOST}`);
console.log(`Port: ${process.env.REACT_APP_BACKEND_PORT}`);

const port = process.env.REACT_APP_BACKEND_PORT || 3001;
const hostUrl = process.env.REACT_APP_BACKEND_HOST || `http://localhost:${port}`;
const baseUrl = `${hostUrl}/api/persons`;

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
