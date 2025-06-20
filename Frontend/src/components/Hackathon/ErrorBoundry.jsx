// src/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-3">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              We're sorry, but there was an error loading this content. Please try refreshing the page.
            </p>
            <details className="mb-6 text-left bg-gray-50 p-4 rounded-lg">
              <summary className="cursor-pointer font-medium text-gray-700 mb-2">Technical Details</summary>
              <p className="text-sm text-gray-600 mt-2">
                {this.state.error && this.state.error.toString()}
              </p>
              <div className="mt-2 text-xs text-gray-500 overflow-auto max-h-32">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </div>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;