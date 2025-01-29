import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

class FeedbackService {
    async createFeedback(feedbackData) {
        try {
            const response = await axios.post(`${API_URL}feedbacks/`, feedbackData);
            return response.data;
        } catch (error) {
            console.error("Error submitting feedback:", error);
            throw error;
        }
    }

        getFeedbackReport(token, startDate, endDate) {
        console.log('aqande wavida riqvesti')
        const url = `${API_URL}feedback-report/`; // Construct the full URL
        console.log("Request URL:", url); // Log the URL for debugging

        return axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`, // Or however you send your token
            },
            params: {
                start_date: startDate.toISOString().split('T')[0], // Format date to YYYY-MM-DD
                end_date: endDate.toISOString().split('T')[0],   // Format date to YYYY-MM-DD
            },
        })
        .then(response => {
            console.log("API Response (in service):", response.data); // Log response in service
            return response; // Return the response (important!)
        })
        .catch(error => {
            console.error("API Error (in service):", error); // Log errors in service
            throw error; // Re-throw the error to be caught by the component
        });
    }
}

export default new FeedbackService();
