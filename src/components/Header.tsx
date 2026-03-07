// import { Link } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import logo  from "../assets/BCAT_logo.png"

// const Header = () => {
//   const { user, logout } = useAuth();

//   return (
//     <header className="bg-card border-b-[3px] border-primary sticky top-0 z-50">
//       <div className="container mx-auto px-4 py-1 flex items-center justify-between">
//         <Link to="/" className="flex items-center gap-3">
//           <div className="w-36 h-32 rounded-full  flex items-center justify-center text-primary-foreground font-display text-xl font-bold">
//             <img src={logo} alt="" className="w-full h-full" />
//           </div>
//           <div>
//             <h1 className="font-display text-2xl font-bold text-secondary leading-tight">
//               Beyond Chalk and Talk (OPC) Pvt. Ltd.
//             </h1>
//             <p className="text-sm text-muted-foreground font-body">
//               Interactive Math Games Designed for Conceptual Understanding.🎮
//             </p>
//           </div>
//         </Link>
//         <nav className="flex items-center gap-3">
//           {/* <Link
//             to="/"
//             className="font-display text-sm font-semibold text-foreground hover:text-primary transition-colors"
//           >
//             🏠 Home
//           </Link> */}
//           {user ? (
//             <div className="flex items-center gap-2">
//               <span className="text-xl">{user.avatar}</span>
//               <span className="font-display text-sm font-bold text-foreground hidden sm:inline">
//                 {user.username}
//               </span>
//               <button
//                 onClick={logout}
//                 className="px-3 py-1 rounded-lg bg-destructive/10 text-destructive font-display text-xs font-bold hover:bg-destructive/20 transition-colors"
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <Link
//               to="/login"
//               className="px-4 py-2 rounded-xl font-display text-sm font-bold text-primary-foreground transition-all hover:scale-105"
//               style={{ background: "var(--gradient-golden)" }}
//             >
//               Login 🎲
//             </Link>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;

import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSound } from "../contexts/SoundContext";
import logo from "../assets/BCAT_logo.png";

const Header = () => {
  const { user, logout } = useAuth();
  const { isSoundEnabled, toggleSound } = useSound();

  return (
    <header className="bg-card border-b-[3px] border-primary sticky top-0 z-50">
      <div className="container mx-auto px-4 py-1 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-36 h-32 rounded-full flex items-center justify-center text-primary-foreground font-display text-xl font-bold">
            <img src={logo} alt="" className="w-full h-full" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-secondary leading-tight">
              Beyond Chalk and Talk (OPC) Pvt. Ltd.
            </h1>
            <p className="text-sm text-muted-foreground font-body">
              Interactive Math Games Designed for Conceptual Understanding.🎮
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            title={
              isSoundEnabled
                ? "Sound On — Click to Mute"
                : "Sound Off — Click to Unmute"
            }
            className="relative w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              borderColor: isSoundEnabled
                ? "hsl(var(--primary))"
                : "hsl(var(--muted-foreground))",
              background: isSoundEnabled
                ? "hsl(var(--primary) / 0.1)"
                : "hsl(var(--muted) / 0.5)",
            }}
          >
            {isSoundEnabled ? (
              // Speaker ON icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "hsl(var(--primary))" }}
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            ) : (
              // Speaker OFF (muted with cross line) icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>

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
              Login 🎲
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;