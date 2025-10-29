import axios from "axios";

const api = axios.create({
  baseURL: "http://10.105.2.254:3000/",
});

export default api;
