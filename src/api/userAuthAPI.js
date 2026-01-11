import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const userLogin = async ({ email, password }) => {
  const res = await API.get(`/users?email=${email}&password=${password}`);

  if (res.data.length === 0) {
    throw new Error("Invalid credentials");
  }

  return res.data[0]; // matched user
};

export const userRegister = async (userData) => {
  const response = await API.post("/register", userData);
  return response.data;
};