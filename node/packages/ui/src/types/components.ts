declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Auth components
      "login-page": {};
      "auth-callback": {};
      "google-login-button": {};
      
      // Layout components
      "app-header": { user?: any };
      "app-footer": {};
      "main-layout": { user?: any; children?: any };
      
      // Page components
      "home-page": {};
      "games-page": {};
      "profile-page": {};
      "tournaments-page": {};
      
      // Common components
      "loading-spinner": {};
      "error-message": { message?: string };
      "button-primary": { 
        disabled?: boolean;
        onclick?: () => void;
        children?: any;
      };
      "hero-section": {};
      "feature-grid": {};
    }
  }
}

export {};