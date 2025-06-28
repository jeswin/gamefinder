import { component } from "magic-loop";

component("login-page", async function* (_component) {
  while (true) {
    yield (
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="brand-section">
              <h1 className="brand-title">Game Finder</h1>
              <p className="brand-subtitle">Find and track your favorite games</p>
            </div>
            
            <div className="login-section">
              <h2>Welcome Back</h2>
              <p>Sign in to continue your gaming journey</p>
              <google-login-button></google-login-button>
            </div>
            
            <div className="features-preview">
              <div className="preview-item">
                <span className="preview-icon">🎮</span>
                <span>Discover new games</span>
              </div>
              <div className="preview-item">
                <span className="preview-icon">🏆</span>
                <span>Join tournaments</span>
              </div>
              <div className="preview-item">
                <span className="preview-icon">👥</span>
                <span>Connect with players</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});