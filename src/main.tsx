import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/Errorfallback";


const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Could not find root element");
}

createRoot(rootElement).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
  </ErrorBoundary>,
);
