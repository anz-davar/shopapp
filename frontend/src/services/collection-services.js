import axios from 'axios';

class CollectionService {
    getAll(token) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        return axios.get('http://localhost:8000/api/collections/');
    }

    getCollection(id, token) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        return axios.get(`http://localhost:8000/api/collections/${id}/`);
    }

    createCollection(token, data) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        return axios.post('http://localhost:8000/api/collections/', data);
    }

    updateCollection(id, token, data) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        return axios.put(`http://localhost:8000/api/collections/${id}/`, data);
    }

    deleteCollection(id, token) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        return axios.delete(`http://localhost:8000/api/collections/${id}/`);
    }

    getCollectionByOrder(token, orderId) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        return axios.get(`http://localhost:8000/api/collections/?order=${orderId}`);
    }
}

export default new CollectionService();