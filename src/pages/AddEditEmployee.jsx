import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { addEmployee, updateEmployee } from "../api/employeesAPI";

/* Indian states */
const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

/* Random Id generator */
const generateRandomId = () =>
  Math.floor(111111 + Math.random() * (999999 - 111111 + 1)).toString();

function AddEditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const employees = useSelector((state) => state.employees.list);
  const editingEmployee = employees.find((emp) => emp.id === id);

  /* Employee state (db only) */
  const [employee, setEmployee] = useState({
    id: "",
    image: "/images/maleSampleProfile.png",
    name: "",
    gender: "",
    dob: "",
    state: "",
    active: true,
  });

  /* Image preview (UI only) */
  const [preview, setPreview] = useState(null);

  /* Auto fill data on clicking on edit */
  useEffect(() => {
    if (editingEmployee) {
      setEmployee({
        ...editingEmployee,
        dob: editingEmployee.dob
          ? new Date(editingEmployee.dob).toISOString().slice(0, 10)
          : "",
      });
      setPreview(null);
    }
  }, [editingEmployee]);

  /* Input handlers */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e) => {
    setEmployee((prev) => ({
      ...prev,
      active: e.target.value === "true",
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setEmployee((prev) => ({
      ...prev,
      image: `/images/${file.name}`, // DB-safe value
    }));
  };

  /* Form submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEmployee) {
        await updateEmployee(employee.id, employee);
        alert("Employee updated successfully!");
      } else {
        await addEmployee({
          ...employee,
          id: generateRandomId(), //random 6 digit
        });
        alert("Employee added successfully!");
      }
      navigate("/dashboard");
    } catch {
      alert("Failed to save employee");
    }
  };

  return (
    <section className="min-h-screen flex justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-center text-indigo-500 mb-6">
          {editingEmployee ? "Edit Employee" : "Add Employee"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={employee.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter employee full name"
              required
            />
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={employee.gender}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* DOB */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={employee.dob}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* State */}
          <div className="mb-4">
            <label className="block font-medium mb-1">State</label>
            <select
              name="state"
              value={employee.state}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select State</option>
              {STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Status</label>
            <select
              value={employee.active.toString()}
              onChange={handleStatusChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* image */}
          <div className="mb-6">
            <label className="block font-medium mb-1">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded px-3 py-2"
            />

            {(preview || editingEmployee) && (
              <img
                src={preview || employee.image}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full mt-3 object-cover"
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-700"
          >
            {editingEmployee ? "Update Employee" : "Add Employee"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AddEditEmployee;