import axios from "axios";

export const axiostInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});
