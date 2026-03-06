import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/BCAT_logo.png"

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
      setError("Enter your username and password!");
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
        <div className="text-center items-center mb-6">
          <div className="text-6xl mb-3 animate-float">
            <img src={logo} alt="" className="w-20 h-20 mx-auto" />
          </div>
          <h1 className="font-display text-3xl font-bold text-secondary">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground font-body text-xl mt-1">
            Login to play the games! 🌟
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="font-display text-lg font-bold text-foreground block mb-1">
              👤 Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background font-body text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Write your name"
            />
          </div>

          <div>
            <label className="font-display text-lg font-bold text-foreground block mb-1">
              🔒 Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background font-body text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Create your password "
            />
          </div>

          {error && (
            <p className="text-destructive font-display text-lg text-center animate-shake">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-display font-bold text-primary-foreground transition-all hover:scale-105"
            style={{ background: "var(--gradient-golden)" }}
          >
            🚀 Login!
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground font-body text-xs">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          onClick={handleGuest}
          className="w-full py-3 rounded-xl border-2 border-primary bg-primary/10 text-primary font-display font-bold transition-all hover:scale-105 hover:bg-primary/20"
        >
          🎭 Guest Login
        </button>

        <p className="text-center mt-5 font-body text-lg text-muted-foreground">
          Create new account{" "}
          <Link
            to="/register"
            className="text-primary font-display font-bold hover:underline"
          >
            Register now! ✨
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
