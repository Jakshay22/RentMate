import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      const msg =
        this.state.error?.message || "Unknown error occurred while rendering.";
      return (
        <div style={{ padding: 24, fontFamily: "system-ui" }}>
          <h2 style={{ marginBottom: 12 }}>Something went wrong</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{msg}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

