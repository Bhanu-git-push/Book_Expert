import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Something went wrong.
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            We're sorry, the page failed to load. Please try again later.
          </p>
          <a
            onClick={() => window.location.reload()}
            className="text-sm font-medium text-blue-400 hover:underline hover:text-blue-600"
          >
            Reload Page
          </a>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;