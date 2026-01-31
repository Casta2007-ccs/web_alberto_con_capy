import axios from 'axios';

// URL base de tu backend (local o producción)
const API_URL = 'http://localhost:8080/api';

export const fetchTalents = async (filters) => {
    // filters es un objeto: { island: 'Tenerife', role: 'Model', search: '...' }
    try {
        // axios convierte automáticamente los parámetros a ?key=value
        const response = await axios.get(`${API_URL}/talents`, { params: filters });
        return response.data;
    } catch (error) {
        console.error("Error al buscar talentos:", error);
        return [];
    }
};

export const toggleFavoriteApi = async (id) => {
    try {
        const response = await axios.put(`${API_URL}/talents/${id}/favorite`);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar favorito:", error);
    }
};
