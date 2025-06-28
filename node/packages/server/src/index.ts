import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import cors from "cors";
import { config } from "./config.js";
import { setupAuthRoutes } from "./auth/routes.js";

async function startServer() {
  const app = express();

  // Create HTTP server (needed for WebSocket subscriptions)
  const httpServer = http.createServer(app);

  // CORS configuration for development
  app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Frontend URL
    credentials: true, // Allow sending cookies
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }));

  // Middleware
  app.use(express.json());
  app.use(cookieParser());

  // Setup authentication routes
  setupAuthRoutes(app);

  // Create resolver structure if needed (development convenience)
  createResolverStructure();

  // Setup GraphQL server
  await setupGraphQLServer(app, httpServer);

  // Basic health check route
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // Start the server
  httpServer.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log(`GraphQL endpoint: http://localhost:${config.port}/graphql`);
  });
}

// Start the server
startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});