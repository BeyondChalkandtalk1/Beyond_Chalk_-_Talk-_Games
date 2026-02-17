import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const AVATARS = ["🦁", "🐯", "🐻", "🐼", "🐨", "🐸", "🦊", "🐰", "🐶", "🐱", "🦄", "🐲"];

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  return ctx || {};
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const saveUser = (u) => {
    setUser(u);
    localStorage.setItem("currentUser", JSON.stringify(u));
  };

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "{}");
    if (users[username] && users[username].password === password) {
      saveUser(users[username].profile);
      return true;
    }
    return false;
  };

  const register = (username, password, avatar) => {
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "{}");
    if (users[username]) return false;
    const profile = {
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
    const profile = {
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

  const updateProfile = (updates) => {
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
