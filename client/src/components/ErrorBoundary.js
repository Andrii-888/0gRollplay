import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#0a0a1a",
            color: "#fff",
            fontFamily: "sans-serif",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "rgba(248, 113, 113, 0.1)",
              border: "1px solid rgba(248, 113, 113, 0.3)",
              borderRadius: "16px",
              padding: "2rem 3rem",
              maxWidth: "400px",
            }}
          >
            <h2
              style={{
                color: "#f87171",
                marginBottom: "1rem",
                fontSize: "1.3rem",
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.9rem",
                marginBottom: "1.5rem",
              }}
            >
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/menu";
              }}
              style={{
                padding: "10px 24px",
                background: "linear-gradient(135deg, #8b5cf6, #c084fc)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Back to Menu
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
