    import axios from 'axios';

    class ProductDataService {
        getAll(token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            return axios.get('http://localhost:8000/api/products/');
        }

        getCart(token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            return axios.get('http://localhost:8000/api/cart/');
        }

         createCartItem(data, token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            data.product_id = data.product.id
            // console.log(data)
            // console.log('aqnaea create before request')
            console.log('update is running')
            return axios.post("http://localhost:8000/api/cartitems/", data);
        }

         getCartItem(id, token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            return axios.get(`http://localhost:8000/api/cartitems/${id}/`);
        }


         async updateCartItem(id, data, token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            console.log('aqnaea update before reqeust')
            console.log(data)
            return axios.put(`http://localhost:8000/api/cartitems/${id}/`, data);
        }

         deleteCartItem(id, token) {
            console.log('aqnaea update deleteamde')
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            return axios.delete(`http://localhost:8000/api/cartitems/${id}/`);
        }

        async payCart(data, token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            return axios.patch(`http://localhost:8000/api/cart/`, data);
            // return axios.patch(`http://localhost:8000/api/cart/${id}/`, data);
        }

        login(data) {
            return axios.post("http://localhost:8000/api/token/", data);
        }

        signup(data) {
            return axios.post("http://localhost:8000/api/register", data);
        }

        createCartItems(data, token) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        return axios.post("http://localhost:8000/api/cartitems/", data);
    }
    }

    export default new ProductDataService();