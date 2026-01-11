import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const Register = () => {
  const navigate = useNavigate();

  const fields = [
    {
      id: "firstName",
      label: "First Name:",
      type: "text",
      placeholder: "Enter your first name",
    },
    {
      id: "lastName",
      label: "Last Name:",
      type: "text",
      placeholder: "Enter your last name",
    },
    {
      id: "email",
      label: "Email:",
      type: "email",
      placeholder: "Enter your email",
    },
    {
      id: "mobile",
      label: "Mobile:",
      type: "number",
      placeholder: "Enter your mobile number",
    },
    {
      id: "password",
      label: "Password:",
      type: "password",
      placeholder: "Enter your password",
    },
    {
      id: "confirmPassword",
      label: "Confirm Password:",
      type: "password",
      placeholder: "Re-enter your password",
    },
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (Object.values(formData).some((v) => v === "")) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Check existing users
      const res = await axios.get("http://localhost:3000/users");
      const users = res.data;

      const emailExists = users.some(
        (u) => u.email.toLowerCase() === formData.email.toLowerCase()
      );
      const mobileExists = users.some((u) => u.mobile === formData.mobile);

      if (emailExists) {
        setError("Email already registered");
        setLoading(false);
        return;
      }

      if (mobileExists) {
        setError("Mobile number already registered");
        setLoading(false);
        return;
      }

      // User payload
      const newUser = {
        id: uuidv4(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      // POST to api
      await axios.post("http://localhost:3000/users", newUser);

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-md p-8 rounded-xl shadow-[0_0_25px_rgba(0,0,0,0.15)]">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-500">
          Register
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.id}>
              <label className="block mb-1 font-medium">{field.label}</label>
              <input
                id={field.id}
                type={
                  field.type === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : field.type
                }
                value={formData[field.id]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
              />
            </div>
          ))}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label className="text-sm">Show password</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-indigo-500 text-white font-semibold hover:bg-indigo-600 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-3">{error}</p>}

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>

        <p className="text-center mt-2">
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            Go Back
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;