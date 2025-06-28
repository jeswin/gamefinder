import { component } from "magic-loop";

component("feature-grid", async function* (_component) {
  const features = [
    {
      icon: "🔍",
      title: "Discover Games",
      description: "Find new games based on your preferences and gaming history."
    },
    {
      icon: "📊",
      title: "Track Progress",
      description: "Monitor your gaming achievements and progress across all platforms."
    },
    {
      icon: "🏆",
      title: "Join Tournaments",
      description: "Compete with other players in organized tournaments and events."
    },
    {
      icon: "👥",
      title: "Connect Players",
      description: "Build your gaming network and find players for multiplayer experiences."
    },
    {
      icon: "⭐",
      title: "Rate & Review",
      description: "Share your thoughts and help others discover great games."
    },
    {
      icon: "📱",
      title: "Cross Platform",
      description: "Seamlessly switch between mobile, desktop, and console gaming."
    }
  ];

  while (true) {
    yield (
      <section className="feature-grid">
        <div className="container">
          <h2 className="section-title">Everything You Need for Gaming</h2>
          <div className="features">
            {features.map((feature) => (
              <div className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
});