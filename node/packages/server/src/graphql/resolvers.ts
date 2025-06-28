import { IResolvers } from "@graphql-tools/utils";
import { User } from "../auth/token-service.js";

// A mock resolver to get the server running.
// In a real application, this would be a complete resolver map.
export const resolvers: IResolvers = {
  Query: {
    me: (parent, args, context, info): User => {
      return context.user;
    },
  },
};