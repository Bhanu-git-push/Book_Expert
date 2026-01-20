import React, { memo } from "react";

const EmployeeTable = ({
  employees,
  startIndex,
  onToggle,
  onEdit,
  onDelete,
}) => {
  return (
    <table className="w-full border-collapse text-center">
      <thead className="bg-gray-100 text-sm">
        <tr>
          <th className="border p-3">S.No</th>
          <th className="border p-3">ID</th>
          <th className="border p-3">Profile</th>
          <th className="border p-3">Name</th>
          <th className="border p-3">Gender</th>
          <th className="border p-3">DOB</th>
          <th className="border p-3">State</th>
          <th className="border p-3">Status</th>
          <th className="border p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {employees.map((emp, index) => (
          <EmployeeRow
            key={emp.id}
            emp={emp}
            index={index}
            startIndex={startIndex}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
};

const EmployeeRow = memo(
  ({ emp, index, startIndex, onToggle, onEdit, onDelete }) => {
    return (
      <tr className="hover:bg-gray-50">
        <td className="border p-3">{startIndex + index + 1}</td>
        <td className="border p-3">{emp.id}</td>
        <td className="border p-3">
          <img
            src={emp.image}
            alt="profile"
            className="w-10 h-10 rounded-full mx-auto"
          />
        </td>
        <td className="border p-3">{emp.name}</td>
        <td className="border p-3">{emp.gender}</td>
        <td className="border p-3">{emp.dob}</td>
        <td className="border p-3">{emp.state}</td>

        {/* Status toggle */}
        <td className="border p-3">
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm font-medium text-red-600">Inactive</span>

            <button
              onClick={() => onToggle(emp)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                emp.active ? "bg-indigo-600" : "bg-indigo-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emp.active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>

            <span className="text-sm font-medium text-green-600">Active</span>
          </div>
        </td>

        {/* Actions */}
        <td className="border p-3">
          <div className="flex flex-col items-center justify-center gap-2 lg:flex-row lg:gap-2">
            <button
              className="px-3 py-1 bg-blue-400 hover:bg-blue-500 text-white rounded w-full lg:w-auto"
              onClick={() => onEdit(emp.id)}
            >
              Edit
            </button>
            <button
              className="px-3 py-1 bg-red-400 hover:bg-red-500 text-white rounded w-full lg:w-auto"
              onClick={() => onDelete(emp)}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    );
  }
);

export default EmployeeTable;