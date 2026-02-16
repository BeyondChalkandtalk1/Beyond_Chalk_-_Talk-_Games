import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-card border-b-4 border-primary sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display text-xl font-bold">
            B
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-secondary leading-tight">
              Beyond Chalk & Talk
            </h1>
            <p className="text-xs text-muted-foreground font-body">Fun Learning Games 🎮</p>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="font-display text-sm font-semibold text-foreground hover:text-primary transition-colors"
          >
            🏠 Home
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
