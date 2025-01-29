import axios from 'axios';

const API_URL = 'http://localhost:8000/api/customers/'; // Replace with your actual API endpoint

const getAll = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error; // Re-throw for handling in components
  }
};

const get = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error; // Re-throw for handling in components
  }
};

const create = async (data, token) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error; // Re-throw for handling in components
  }
};

const update = async (id, data, token) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error; // Re-throw for handling in components
  }
};

const remove = async (id, token) => {
  try {
    await axios.delete(`${API_URL}${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error; // Re-throw for handling in components
  }
};

const CustomerService = {
  getAll,
  get,
  create,
  update,
  remove,
};

export default CustomerService;