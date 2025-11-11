import axios from "axios";

const API = axios.create({
  baseURL: "https://wheels-back-production.up.railway.app",
});

export default API;
