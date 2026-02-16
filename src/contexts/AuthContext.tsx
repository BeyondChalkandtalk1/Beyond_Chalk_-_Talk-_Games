import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  isGuest: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string, avatar: string) => boolean;
  guestLogin: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AVATARS = ["🦁", "🐯", "🐻", "🐼", "🐨", "🐸", "🦊", "🐰", "🐶", "🐱", "🦄", "🐲"];

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const saveUser = (u: UserProfile) => {
    setUser(u);
    localStorage.setItem("currentUser", JSON.stringify(u));
  };

  const login = (username: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "{}");
    if (users[username] && users[username].password === password) {
      saveUser(users[username].profile);
      return true;
    }
    return false;
  };

  const register = (username: string, password: string, avatar: string): boolean => {
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "{}");
    if (users[username]) return false;
    const profile: UserProfile = {
      id: Date.now().toString(),
      username,
      avatar,
      isGuest: false,
      createdAt: new Date().toISOString(),
    };
    users[username] = { password, profile };
    localStorage.setItem("registeredUsers", JSON.stringify(users));
    saveUser(profile);
    return true;
  };

  const guestLogin = () => {
    const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    const profile: UserProfile = {
      id: "guest-" + Date.now(),
      username: "Guest Player",
      avatar,
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
    saveUser(profile);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    saveUser(updated);
    if (!user.isGuest) {
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "{}");
      if (users[user.username]) {
        users[user.username].profile = updated;
        localStorage.setItem("registeredUsers", JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, guestLogin, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
