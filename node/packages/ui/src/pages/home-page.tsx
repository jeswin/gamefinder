import { component } from "magic-loop";
import { goto } from "webjsx-router";
import { AuthService } from "../services/auth-service.js";
import { User } from "../types/user.js";

component("home-page", async function* (component) {
  let userData: User | null = null;
  let isLoading = true;

  const checkAuth = async () => {
    try {
      userData = await AuthService.getCurrentUser();
      if (!userData) {
        goto("/login");
        return;
      }
      isLoading = false;
      component.render();
    } catch (error) {
      console.error("Auth check failed:", error);
      goto("/login");
    }
  };

  checkAuth();

  while (true) {
    if (isLoading) {
      yield <loading-spinner></loading-spinner>;
    } else if (userData) {
      return (
        <div>
          <main-layout user={userData}>
            <hero-section></hero-section>
            <feature-grid></feature-grid>
            
            <section className="quick-actions">
              <div className="container">
                <h2 className="section-title">Quick Start</h2>
                <div className="action-grid">
                  <div className="action-card">
                    <div className="action-icon">🔍</div>
                    <h3>Find Games</h3>
                    <p>Discover games tailored to your preferences</p>
                    <button className="action-button">Browse Games</button>
                  </div>
                  <div className="action-card">
                    <div className="action-icon">🏆</div>
                    <h3>Join Tournament</h3>
                    <p>Compete with players worldwide</p>
                    <button className="action-button">View Tournaments</button>
                  </div>
                  <div className="action-card">
                    <div className="action-icon">📝</div>
                    <h3>Create Game</h3>
                    <p>Add your own game to the platform</p>
                    <button className="action-button">Create Game</button>
                  </div>
                </div>
              </div>
            </section>
          </main-layout>
        </div>
      );
    }
  }
});