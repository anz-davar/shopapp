import axios from 'axios';

const API_URL = 'http://localhost:8000/api/'; // Your API URL

class SalesService {
    async getSalesReport(token, startDate, endDate) {
        try {
            const response = await axios.get(`${API_URL}sales-report/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    start_date: startDate.toISOString().split('T')[0], // Format dates for the API
                    end_date: endDate.toISOString().split('T')[0],
                },
            });

            console.log('response')
            console.log(response.data)
            console.log('response')
            return response.data;
        } catch (error) {
            console.error("Error fetching sales report:", error);
            throw error;
        }
    }
}

export default new SalesService();