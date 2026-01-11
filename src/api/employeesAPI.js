import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getEmployees = async () => {
  const response = await axios.get(`${BASE_URL}/employees`);
  return response.data;
};

export const getEmployeeById = async (id) => {
  const response = await axios.get(`${BASE_URL}/employees/${id}`);
  return response.data;
};

export const addEmployee = async (employee) => {
  const response = await axios.post(`${BASE_URL}/employees`, employee);
  return response.data;
};

export const updateEmployee = async (id, updatedData) => {
  const response = await axios.put(`${BASE_URL}/employees/${id}`, updatedData);
  return response.data;
};

export const deleteEmployee = async (id) => {
  await axios.delete(`${BASE_URL}/employees/${id}`);
};