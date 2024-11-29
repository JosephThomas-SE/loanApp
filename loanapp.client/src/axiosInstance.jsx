import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7140/api', // Base API URL
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    // Add other configurations like timeout if needed:
    // timeout: 5000,
});

export default axiosInstance;
