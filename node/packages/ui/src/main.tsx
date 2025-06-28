import { match, goto, initRouter } from "webjsx-router";

// Import type declarations
import "./types/components.js";

// Import all components
import "./components/common/loading-spinner.js";
import "./components/common/button-primary.js";
import "./components/common/hero-section.js";
import "./components/common/feature-grid.js";
import "./components/layout/app-header.js";
import "./components/layout/main-layout.js";
import "./components/auth/google-login-button.js";
import "./pages/login-page.js";
import "./pages/home-page.js";

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("app")!;
  
  initRouter(
    container,
    () =>
      match("/login", () => <login-page />) ||
      match("/", () => <home-page />) ||
      <login-page /> // Default fallback
  );

  // Check if we're returning from OAuth callback
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("auth") === "success") {
    goto("/");
  }
});