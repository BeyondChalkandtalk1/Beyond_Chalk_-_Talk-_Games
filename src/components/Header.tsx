import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo  from "../assets/BCAT_logo.png"

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-card border-b-[3px] border-primary sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full  flex items-center justify-center text-primary-foreground font-display text-xl font-bold">
            <img src={logo} alt="" className="w-full h-full"/>
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-secondary leading-tight">
              Beyond Chalk & Talk
            </h1>
            <p className="text-xs text-muted-foreground font-body">Fun Learning Games 🎮</p>
          </div>
        </Link>
        <nav className="flex items-center gap-3">
          {/* <Link
            to="/"
            className="font-display text-sm font-semibold text-foreground hover:text-primary transition-colors"
          >
            🏠 Home
          </Link> */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">{user.avatar}</span>
              <span className="font-display text-sm font-bold text-foreground hidden sm:inline">
                {user.username}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1 rounded-lg bg-destructive/10 text-destructive font-display text-xs font-bold hover:bg-destructive/20 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl font-display text-sm font-bold text-primary-foreground transition-all hover:scale-105"
              style={{ background: "var(--gradient-golden)" }}
            >
              Login 🚀
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
