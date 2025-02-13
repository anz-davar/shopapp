// services/email-service.js
import axios from 'axios'; // Or fetch, if you prefer


const API_URL = 'http://localhost:8000/api/send-email/'; // Replace with your actual API endpoint

const sendEmail = async (token, emailData) => {
    try {

        const response = await axios.post(API_URL, emailData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include token if protected
            },
        });
        return response; // Return the full response object
    } catch (error) {
        console.error("Error in email service:", error);
        throw error;
    }
};


export default { sendEmail }; // Export as an object