import axios from "axios";
import setupMockBackend from "./mockBackend";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Remove this line when the real backend is ready
setupMockBackend(API);

export default API;