import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-gray-500 font-semibold">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;