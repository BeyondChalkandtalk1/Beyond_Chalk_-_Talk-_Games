import { motion } from "framer-motion";

interface Props {
  tables: number[];
  onSelect: (table: number) => void;
  level: 1 | 2;
  onLevelChange: (level: 1 | 2) => void;
}

const BharatTableSelector = ({
  tables,
  onSelect,
  level,
  onLevelChange,
}: Props) => {
  return (
    <div className="space-y-8">
      {/* Game info */}
      <div className="text-center space-y-2">
        {/* <p className="text-muted-foreground text-sm">
          Age: 4+ years • 2 Levels
        </p> */}
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          From Representation to Real Understanding
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Learn multiplication tables through 6 different representations —
          text, speech, addition, graphics, arrays, and multiplication. Build
          deep understanding step by step!
        </p>
      </div>

      {/* Level selector */}
      {/* <div className="flex justify-center gap-3">
        {[1, 2].map((l) => (
          <button
            key={l}
            onClick={() => onLevelChange(l as 1 | 2)}
            className={`px-6 py-2 rounded-lg font-display font-semibold text-sm transition-all ${
              level === l
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Level {l}
          </button>
        ))}
      </div> */}

      {/* Table grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
        {tables.map((t, i) => (
          <motion.button
            key={t}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(t)}
            className="bg-card rounded-xl p-6 game-card-shadow hover:scale-105 transition-transform border border-border group"
          >
            <div className="text-4xl font-display font-bold text-primary group-hover:text-secondary transition-colors">
              {t}
            </div>
            <div className="text-sm text-muted-foreground mt-1 font-body">
              Table of {t}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BharatTableSelector;
