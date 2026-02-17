import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, guestLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Username aur password dono daalo! 😅");
      return;
    }
    const success = login(username.trim(), password);
    if (success) {
      navigate("/");
    } else {
      setError("Galat username ya password! 😢");
    }
  };

  const handleGuest = () => {
    guestLogin();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div
        className="w-full max-w-md bg-card rounded-3xl p-8 border-2 border-border animate-bounce-in"
        style={{ boxShadow: "var(--shadow-hover)" }}
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-3 animate-float">🎮</div>
          <h1 className="font-display text-3xl font-bold text-secondary">Welcome Back!</h1>
          <p className="text-muted-foreground font-body text-sm mt-1">
            Login karke games khelo! 🌟
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="font-display text-sm font-bold text-foreground block mb-1">
              👤 Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background font-body text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Apna naam likho..."
            />
          </div>

          <div>
            <label className="font-display text-sm font-bold text-foreground block mb-1">
              🔒 Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background font-body text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Password daalo..."
            />
          </div>

          {error && (
            <p className="text-destructive font-display text-sm text-center animate-shake">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-display font-bold text-primary-foreground transition-all hover:scale-105"
            style={{ background: "var(--gradient-golden)" }}
          >
            🚀 Login Karo!
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground font-body text-xs">YA</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          onClick={handleGuest}
          className="w-full py-3 rounded-xl border-2 border-primary bg-primary/10 text-primary font-display font-bold transition-all hover:scale-105 hover:bg-primary/20"
        >
          🎭 Guest Login
        </button>

        <p className="text-center mt-5 font-body text-sm text-muted-foreground">
          Naya account?{" "}
          <Link to="/register" className="text-primary font-display font-bold hover:underline">
            Register Karo! ✨
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
