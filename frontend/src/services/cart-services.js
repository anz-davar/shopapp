import axios from "axios";

const API_URL = 'http://localhost:8000/api/';

class CartService {
    async getCart(token, customerId) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        try {
            const response = await axios.get(API_URL + 'carts/', {params: {customer: customerId}});
            return response.data;
        } catch (error) {
            console.error("Error fetching cart:", error);
            // You can throw a custom error or return a specific value to indicate failure
            throw new Error("Failed to fetch cart");
        }
    }

    async createCart(data, token) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        try {
            const response = await axios.post(API_URL + 'order/', data);
            return response;
        } catch (error) {
            console.error("Error creating cart:", error);
            // You can throw a custom error or return a specific value to indicate failure
            throw new Error("Failed to create cart");
        }
    }

    async getAllCarts(token) { // Renamed for clarity
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        try {
            const response = await axios.get(API_URL + 'carts/'); // Use 'carts' endpoint
            return response;
        } catch (error) {
            console.error("Error fetching carts:", error);
            throw error;
        }
    }

    async getCartDetails(token, cartId) { // Renamed for clarity
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        try {
            const response = await axios.get(API_URL + `carts/${cartId}/`); // Use 'carts' endpoint
            return response;
        } catch (error) {
            console.error("Error fetching cart details:", error);
            throw error;
        }
    }

    async getCartsByCustomer(token, customerId) {  // Get carts by customer ID
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        try {
            const response = await axios.get(API_URL + 'carts/', {params: {customer: customerId}});
            return response.data;
        } catch (error) {
            console.error("Error fetching carts by customer:", error);
            throw error;
        }
    }

    async getCartByOrderId(token, orderId) {  // Get cart by order ID (cart ID)
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        try {
            const response = await axios.get(API_URL + `carts/${orderId}/`);
            return response.data;
        } catch (error) {
            console.error("Error fetching cart by order ID:", error);
            throw error;
        }
    }

      async getOrderByOrderIdAndNationalIdPublic(orderId, nationalId) { // Public method
        try {
            const response = await axios.get(`${API_URL}orders/public-lookup/`, { // Correct URL
                params: { order_id: orderId, national_id: nationalId },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching order:", error);
            throw error;
        }
    }
}

export default new CartService();