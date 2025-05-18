import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
const api=axios.create({
    baseURL:`${apiUrl}`,
    timeout: 10000,
    headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',

    },
});
export default api;