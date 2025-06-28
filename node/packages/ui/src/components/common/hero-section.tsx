import { component } from "magic-loop";

component("hero-section", async function* (_component) {
  while (true) {
    yield (
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover Your Next
              <span className="hero-accent"> Favorite Game</span>
            </h1>
            <p className="hero-description">
              Find, track, and organize your gaming experiences. Join tournaments, 
              connect with players, and never miss another great game.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Games</span>
              </div>
              <div className="stat">
                <span className="stat-number">5K+</span>
                <span className="stat-label">Players</span>
              </div>
              <div className="stat">
                <span className="stat-number">1K+</span>
                <span className="stat-label">Tournaments</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="game-cards">
              <div className="game-card card-1">🎮</div>
              <div className="game-card card-2">🏆</div>
              <div className="game-card card-3">🎯</div>
            </div>
          </div>
        </div>
      </section>
    );
  }
});