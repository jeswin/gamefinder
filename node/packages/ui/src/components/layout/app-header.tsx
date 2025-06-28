import { component } from "magic-loop";
import { AuthService } from "../../services/auth-service.js";

component("app-header", async function* (component: any) {
  const handleLogout = () => {
    AuthService.logout();
  };

  while (true) {
    yield (
      <header className="app-header">
        <div className="header-container">
          <div className="logo-section">
            <h1 className="logo">Game Finder</h1>
          </div>
          
          {component.user && (
            <div className="user-section">
              <img src={component.user.picture} alt={component.user.name} className="user-avatar" />
              <span className="user-name">{component.user.name}</span>
              <button className="logout-btn" onclick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
    );
  }
});