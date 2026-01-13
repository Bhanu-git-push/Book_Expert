import React, { Suspense, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTasks, FaBars } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { LOGOUT } from "../store/slices/userAuthSlice";
import LoadingSpinner from "./LoadingSpinner";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuth, user } = useSelector((state) => state.userAuth);

  const linkClass = ({ isActive }) =>
    `hover:underline ${
      isActive ? "text-indigo-600 dark:text-indigo-300 font-semibold" : ""
    }`;

  const linkAuthClass = ({ isActive }) =>
    `hover:underline ${
      isActive ? "text-gray-900 dark:text-gray-300 font-semibold" : ""
    }`;

  const handleLogout = () => {
    dispatch(LOGOUT());
    navigate("/login");
  };

  return (
    <nav className="w-full shadow bg-indigo-100 dark:bg-indigo-900">
      {/* Navbar header */}
      <div className="px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <FaTasks size={26} className="text-indigo-600 dark:text-indigo-300" />

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-10 font-medium text-lg text-gray-800 dark:text-gray-200">
          <li>
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" className={linkClass}>
              Services
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={linkClass}>
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Right side auth */}
        <div className="hidden md:flex items-center gap-1 text-gray-800 dark:text-gray-200">
          {!isAuth ? (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>

              <span>/</span>

              <NavLink to="/register" className={linkClass}>
                Register
              </NavLink>
            </>
          ) : (
            <Suspense fallback={<LoadingSpinner />}>
              <>
                <div className="flex flex-col leading-tight text-center">
                  <span className="text-sm text-gray-700 dark:text-gray-400">
                    Welcome
                  </span>
                  <span className="font-medium">
                    {user?.firstName || user?.email}
                  </span>
                </div>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                >
                  Logout
                </button>
              </>
            </Suspense>
          )}
        </div>

        {/* Mobile menu */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-800 dark:text-gray-200"
        >
          <FaBars size={26} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 bg-indigo-100 dark:bg-indigo-900 ${
          isMobileMenuOpen ? "max-h-[500px] py-4" : "max-h-0 overflow-hidden"
        }`}
      >
        <ul className="flex flex-col gap-4 px-6 text-gray-800 dark:text-gray-200 font-medium text-lg">
          <li>
            <NavLink
              to="/"
              className={linkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className={linkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={linkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/services"
              className={linkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={linkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </NavLink>
          </li>

          {/* Mobile auth section */}
          {!isAuth ? (
            <li className="flex gap-1">
              <NavLink
                to="/login"
                className={linkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </NavLink>
              <span>/</span>
              <NavLink
                to="/register"
                className={linkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </NavLink>
            </li>
          ) : (
            <li>
              <Suspense fallback={<LoadingSpinner />}>
                <div className="flex flex-col gap-3">
                  <span className="font-medium">
                    Welcome, {user?.firstName || user?.email}
                  </span>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded w-fit"
                  >
                    Logout
                  </button>
                </div>
              </Suspense>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;