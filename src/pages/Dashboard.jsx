import React, { useCallback, useEffect, useState } from "react";
import {
  getEmployees,
  deleteEmployee as deleteEmployeeAPI,
  updateEmployee as updateEmployeeAPI,
} from "../api/employeesAPI";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  EMPLOYEE_FETCH_REQUEST,
  EMPLOYEE_FETCH_SUCCESS,
  EMPLOYEE_FETCH_FAILURE,
  UPDATE_EMPLOYEE_STATUS,
} from "../store/slices/employeesSlice";
import { FiDownload } from "react-icons/fi";
import { downloadAsImage, downloadAsPDF } from "../utils/download";
import EmployeeTable from "../components/EmployeeTable";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    list: employees,
    loading,
    error,
  } = useSelector((state) => state.employees);

  /* Pagination state */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showAll, setShowAll] = useState(false);

  /* Dropdown state */
  const [showPrintDropdown, setShowPrintDropdown] = useState(false);

  /* Fetch employees */
  const fetchEmployees = async () => {
    try {
      dispatch(EMPLOYEE_FETCH_REQUEST());
      const data = await getEmployees();
      dispatch(EMPLOYEE_FETCH_SUCCESS(data));
    } catch (err) {
      dispatch(EMPLOYEE_FETCH_FAILURE("Failed to load employees"));
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* Search and filter state */
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const isFiltering =
    searchTerm !== "" || genderFilter !== "all" || statusFilter !== "all";

  useEffect(() => {
    if (isFiltering) {
      setShowAll(true);
      setCurrentPage(1);
    }
  }, [isFiltering]);

  /* Add employee */
  const handleAddEmployee = () => {
    navigate("/add-edit-employee");
  };

  /* Toggle status */
  const toggleStatus = useCallback(
    async (emp) => {
      const updatedEmp = { ...emp, active: !emp.active };

      dispatch(
        UPDATE_EMPLOYEE_STATUS({
          id: emp.id,
          active: updatedEmp.active,
        })
      );

      try {
        await updateEmployeeAPI(emp.id, updatedEmp);
      } catch {
        alert("Failed to update employee");
        dispatch(
          UPDATE_EMPLOYEE_STATUS({
            id: emp.id,
            active: emp.active,
          })
        );
      }
    },
    [dispatch]
  );

  /* Delete employee */
  const handleDelete = async (emp) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${emp.name}?`
    );
    if (!confirmDelete) return;

    try {
      await deleteEmployeeAPI(emp.id);
      alert(`Deleted ${emp.name} of ID ${emp.id}`);
      fetchEmployees();
    } catch {
      alert("Failed to delete employee");
    }
  };

  /* Print functions */
  const handleDownloadImage = async () => {
    await downloadAsImage("print-area");
    setShowPrintDropdown(false);
  };

  const handleDownloadPDF = async () => {
    await downloadAsPDF("print-area");
    setShowPrintDropdown(false);
  };

  /* Handle dropdown */
  const togglePrintDropdown = () => setShowPrintDropdown((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest("#print-button") &&
        !e.target.closest("#print-dropdown")
      ) {
        setShowPrintDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /* Combined filtering */
  const filteredEmployees = employees.filter((emp) => {
    const matchesName = emp.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesGender = genderFilter === "all" || emp.gender === genderFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && emp.active) ||
      (statusFilter === "inactive" && !emp.active);

    return matchesName && matchesGender && matchesStatus;
  });

  /* Pagination logic */
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentEmployees = showAll
    ? filteredEmployees
    : filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleToggleShowAll = () => {
    setShowAll((prev) => !prev);
    setCurrentPage(1);
    setItemsPerPage(showAll ? 5 : filteredEmployees.length);
  };

  /* Counts */
  const totalEmployees = employees.length;
  const activeCount = employees.filter((e) => e.active).length;
  const inactiveCount = totalEmployees - activeCount;

  /* UI states */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <section className="min-h-screen px-4 py-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col items-center gap-4 mb-6 md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-500 text-center md:text-left">
          Employees Dashboard
        </h1>

        {/* Add and Print */}
        <div className="relative flex gap-3">
          <button
            onClick={handleAddEmployee}
            className="px-4 py-2 bg-indigo-500 text-white rounded shadow hover:bg-indigo-600 transition"
          >
            Add Employee +
          </button>

          <button
            id="print-button"
            onClick={togglePrintDropdown}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded shadow hover:bg-gray-700 transition"
          >
            Print <FiDownload className="text-lg" />
          </button>

          {showPrintDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border-0 rounded-lg shadow-lg z-50">
              <button
                onClick={handleDownloadImage}
                className="w-full text-left px-4 py-2 hover:bg-gray-200 rounded-lg"
              >
                Download as Image
              </button>

              <hr className="border-gray-500" />

              <button
                onClick={handleDownloadPDF}
                className="w-full text-left px-4 py-2 hover:bg-gray-200 rounded-lg"
              >
                Download as PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="w-full max-w-6xl bg-white p-4 mb-4 rounded shadow flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded w-full"
        />

        {/* Gender */}
        <select
          value={genderFilter}
          onChange={(e) => {
            setGenderFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="all">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Reset Button */}
        <div className="flex justify-center md:justify-center lg:justify-start w-full lg:w-auto">
          <button
            onClick={() => {
              setSearchTerm("");
              setGenderFilter("all");
              setStatusFilter("all");
              setShowAll(false);
              setItemsPerPage(5);
              setCurrentPage(1);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-32"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        id="print-area"
        className="w-full max-w-6xl bg-white shadow mb-4 overflow-x-auto"
      >
        <EmployeeTable
          employees={currentEmployees}
          startIndex={startIndex}
          onToggle={toggleStatus}
          onEdit={(id) => navigate(`/add-edit-employee/${id}`)}
          onDelete={handleDelete}
        />

        {/* No Data Found */}
        {currentEmployees.length === 0 && (
          <div className="py-6 text-center text-black font-medium">
            No data found
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="relative w-full max-w-6xl flex flex-col md:flex-row justify-center items-center">
        <div className="flex flex-col items-center">
          {!showAll && (
            <>
              {/* Mobile */}
              <div className="flex flex-col items-center gap-3 mb-4 md:hidden">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="w-full max-w-xs px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm font-medium">{currentPage}</span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="w-full max-w-xs px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              {/* Desktop */}
              <div className="hidden md:flex items-center gap-4 mb-4">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span>{currentPage}</span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}

          <button
            onClick={handleToggleShowAll}
            className="px-4 py-1 bg-blue-600 text-white rounded mb-6"
          >
            {showAll ? "Show Pagination" : "Show All"}
          </button>
        </div>
      </div>

      {/* Employee details */}
      <div className="flex flex-wrap gap-6 justify-center">
        <div className="bg-indigo-100 px-6 py-4 rounded-lg text-center min-w-[160px]">
          <p className="font-semibold">Total Employees</p>
          <p className="text-2xl">{totalEmployees}</p>
        </div>
        <div className="bg-green-100 px-6 py-4 rounded-lg text-center min-w-[160px]">
          <p className="font-semibold">Active Employees</p>
          <p className="text-2xl">{activeCount}</p>
        </div>
        <div className="bg-red-100 px-6 py-4 rounded-lg text-center min-w-[160px]">
          <p className="font-semibold">Inactive Employees</p>
          <p className="text-2xl">{inactiveCount}</p>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
