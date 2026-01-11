import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AuthWatcher from "./components/AuthWatcher";
import LoadingSpinner from "./components/LoadingSpinner";
const PrivateRoute = lazy(() => import("./routes/PrivateRoute"));
const ErrorBoundary = lazy(() => import("./components/ErrorBoundary"));
const MainLayout = lazy(() => import("./layout/MainLayout"));

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AddEditEmployee = lazy(() => import("./pages/AddEditEmployee"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

function App() {
  return (
    <>
      <Router>
        <AuthWatcher />
        <Suspense fallback={<LoadingSpinner />}>
          <ErrorBoundary>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />

                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                <Route
                  path="/add-edit-employee"
                  element={<AddEditEmployee />}
                />
                <Route
                  path="/add-edit-employee/:id"
                  element={<AddEditEmployee />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<PageNotFound />} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </Router>
    </>
  );
}

export default App;