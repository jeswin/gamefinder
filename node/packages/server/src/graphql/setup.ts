import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import { makeExecutableSchema } from "@graphql-tools/schema";
import { readFileSync } from "fs";
import { resolvers } from "./resolvers.js";
import http from "http";
import { Express } from "express";

interface GraphQLContext {
  user?: any;
}

export async function setupGraphQLServer(
  app: Express,
  httpServer: http.Server
) {
  const typeDefs = readFileSync("./src/graphql/schema.graphql", "utf-8");
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer<GraphQLContext>({
    schema,
  });

  // For now, we'll start the server in standalone mode on a different port
  // This avoids the Express middleware compatibility issues
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 },
    context: async () => ({ user: null }),
  });

  console.log(`🚀 GraphQL server ready at ${url}`);
}