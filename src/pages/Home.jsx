import React from "react";
import { Link } from "react-router-dom";
import dashboardImage from "../assets/employeePortal.png";

const Home = () => {
  return (
    <section className="flex min-h-screen bg-white text-white flex-col md:flex-row">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-start flex-1 px-8 md:px-12 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-500">
          Integrated Resource Management System
        </h1>
        <p className="text-lg md:text-xl mb-4 text-blue-500">
          UI/UX Case Study on IRMS
        </p>
        <p className="text-md md:text-lg mb-8 text-blue-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <Link
          to="/dashboard"
          className="bg-white text-indigo-600 font-semibold px-5 py-3 rounded-lg shadow-[0_0_25px_rgba(0,0,0,0.15)] hover:bg-gray-200 transition"
        >
          Access Dashboard
        </Link>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex flex-1 justify-center items-center p-8 bg-white">
        <img
          src={dashboardImage}
          alt="Dashboard Preview"
          className="w-full max-w-lg rounded-xl"
        />
      </div>
    </section>
  );
};

export default Home;
