import axios from 'axios';

const API_URL = 'http://localhost:8000/api/products/';

const getAll = async (token) => { // Async functions
    try {
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Products:', error);
        throw error;
    }
};

const get = async (id, token) => {
    try {
        const response = await axios.get(`${API_URL}${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Product:', error);
        throw error;
    }
};

const create = async (data, token) => {
    try {
        const response = await axios.post(API_URL, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating Product:', error);
        throw error;
    }
};

const update = async (id, data, token) => {
    try {
        const response = await axios.patch(`${API_URL}${id}/`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating Product:', error);
        throw error;
    }
};

const remove = async (id, token) => {
    try {
        await axios.delete(`${API_URL}${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error('Error deleting Product:', error);
        throw error;
    }
};

const ProductService = {
    getAll,
    get,
    create,
    update,
    remove
};

export default ProductService;