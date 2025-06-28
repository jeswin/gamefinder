import type { User } from "./token-service.js";

// In-memory users store for demo purposes
// In a real application, this would be a database
const users: Map<string, User> = new Map();

/**
 * Find a user by provider and provider user ID
 */
export async function findUserByProviderData(
  provider: string,
  providerUserId: string
): Promise<User | null> {
  for (const user of users.values()) {
    if (user.provider === provider && user.providerUserId === providerUserId) {
      return user;
    }
  }
  return null;
}

/**
 * Find a user by ID
 */
export async function findUserById(id: string): Promise<User | null> {
  return users.get(id) || null;
}

/**
 * Create a new user or update an existing one based on OAuth profile
 */
export async function createOrUpdateUser(
  userData: Omit<User, "id">
): Promise<User> {
  // Look for an existing user
  const existingUser = await findUserByProviderData(
    userData.provider,
    userData.providerUserId
  );

  if (existingUser) {
    // Update the existing user
    const updatedUser: User = {
      ...existingUser,
      ...userData,
      id: existingUser.id,
      provider: existingUser.provider,
      providerUserId: existingUser.providerUserId,
    };

    users.set(existingUser.id, updatedUser);
    return updatedUser;
  }

  // Create a new user
  const newUser: User = {
    ...userData,
    id: generateUserId(),
  };

  users.set(newUser.id, newUser);
  return newUser;
}

/**
 * Generate a simple user ID
 * In a real app, this would be handled by the database or UUID generation
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
