import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from "../store/slices/userAuthSlice";
import { userLogin } from "../api/userAuthAPI";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isAuth  } = useSelector((state) => state.userAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(LOGIN_REQUEST());

    try {
      const user = await userLogin({ email, password });

      // valid credentials
      dispatch(LOGIN_SUCCESS(user));
      // navigate("/dashboard");
    } catch (error) {
      // invalid credentials
      dispatch(LOGIN_FAILURE());
    }
  };

  useEffect(() => {
  if (isAuth) {
    navigate("/dashboard", { replace: true });
  }
}, [isAuth, navigate]);

  return (
    <section
      className="
        bg-white px-4
        flex items-center justify-center
        min-h-screen
        md:min-h-[calc(100vh-120px)]
      "
    >
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left section */}
        <div className="hidden md:block text-left">
          <h1 className="text-indigo-500 text-5xl font-bold mb-4">
            Employee Portal
          </h1>
          <p className="text-2xl text-gray-800 leading-relaxed">
            Welcome to Employee Dashboard Portal.
            <br />
            Helps to manage employees effectively.
          </p>
        </div>

        {/* Right section */}
        <div className="flex flex-col items-center md:items-end w-full">
          {/* Mobile Heading */}
          <h1 className="md:hidden text-indigo-500 text-4xl font-bold mb-6 text-center">
            Employee Portal
          </h1>

          {/* Card */}
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-[0_0_25px_rgba(0,0,0,0.15)]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="border rounded-sm px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Password:
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="border rounded-sm px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Show password */}
              <div className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <span className="text-gray-600">Show password</span>
              </div>

              {/* Error */}
              {isError && (
                <p className="text-red-600 text-sm text-center">
                  Invalid email or password
                </p>
              )}

              {/* Login button */}
              <button
                type="submit"
                disabled={isLoading}
                className="
                  bg-indigo-500 hover:bg-indigo-600
                  text-white text-xl font-semibold
                  py-2 rounded-md
                  disabled:opacity-60
                "
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>

              {/* Forgot password */}
              <Link
                to="#"
                className="text-blue-600 text-sm text-center hover:underline"
              >
                Forgot password?
              </Link>

              {/* Register */}
              <p className="text-center text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Register
                </Link>
              </p>

              {/* Go back */}
              <p className="text-center">
                <Link
                  to="/"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Go Back
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
