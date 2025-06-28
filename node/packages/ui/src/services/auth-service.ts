import { User } from "../types/user.js";

const API_BASE_URL = "http://localhost:3001";

export class AuthService {
  static async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include"
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      console.error("Auth check failed:", error);
      return null;
    }
  }

  static initiateGoogleLogin(): void {
    window.location.href = `${API_BASE_URL}/auth/google`;
  }

  static logout(): void {
    window.location.href = `${API_BASE_URL}/auth/logout`;
  }
}