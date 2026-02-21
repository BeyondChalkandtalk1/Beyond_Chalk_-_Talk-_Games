import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AVATARS = ["🦁", "🐯", "🐻", "🐼", "🐨", "🐸", "🦊", "🐰", "🐶", "🐱", "🦄", "🐲"];

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🦁");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Sab fields bharo! 😅");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username kam se kam 3 characters ka ho! 📝");
      return;
    }
    if (password.length < 4) {
      setError("Password kam se kam 4 characters ka ho! 🔑");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords match nahi ho rahe! 🤔");
      return;
    }

    const success = register(username.trim(), password, selectedAvatar);
    if (success) {
      navigate("/");
    } else {
      setError("Ye username pehle se hai! Doosra try karo 😊");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div
        className="w-full max-w-md bg-card rounded-3xl p-8 border-2 border-border animate-bounce-in"
        style={{ boxShadow: "var(--shadow-hover)" }}
      >
        <div className="text-center mb-5">
          <div className="text-6xl mb-3 animate-float">🎉</div>
          <h1 className="font-display text-3xl font-bold text-secondary">
            Naya Account!
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-1">
            Register karo aur games ka maza lo! 🌟
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="font-display text-sm font-bold text-foreground block mb-2">
              🎨 Avatar Chuno
            </label>
            <div className="flex flex-wrap gap-2 justify-center">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-12 h-12 rounded-full text-2xl flex items-center justify-center transition-all ${
                    selectedAvatar === avatar
                      ? "bg-primary scale-125 ring-3 ring-primary/50"
                      : "bg-muted hover:scale-110"
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-display text-sm font-bold text-foreground block mb-1">
              🏫 School Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background font-body text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Apna cool naam likho..."
            />
          </div>
          <div>
            <label className="font-display text-sm font-bold text-foreground block mb-1">
              🔢 Age
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background font-body text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Apna cool naam likho..."
            />
          </div>
          <div>
            <label className="font-display text-sm font-bold text-foreground block mb-1">
              📧 Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background font-body text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Apna cool naam likho..."
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
              placeholder="Secret password..."
            />
          </div>

          <div>
            <label className="font-display text-sm font-bold text-foreground block mb-1">
              🔒 Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background font-body text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Password dobara likho..."
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
            ✨ Register Karo!
          </button>
        </form>

        <p className="text-center mt-5 font-body text-sm text-muted-foreground">
          Pehle se account hai?{" "}
          <Link
            to="/login"
            className="text-primary font-display font-bold hover:underline"
          >
            Login Karo! 🚀
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
