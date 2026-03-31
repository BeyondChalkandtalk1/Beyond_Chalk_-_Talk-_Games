import { motion } from "framer-motion";

interface Props {
  tables: { table: number; image: string, bg:String }[];
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
        <h2 className="text-4xl md:text-4xl font-display font-bold  text-[#8F2424]">
          B.H.A.R.A.T
        </h2>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          Building Holistic Understanding through Representations of Arithmetic
          Tables
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-2xl">
          Begin your B.H.A.R.A.T. journey—select a table to explore and play.
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-8xl mx-auto">
        {tables.map((t, i) => (
          <motion.button
            key={t?.table}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(t?.table)}
            className={`bg-card rounded-xl p-6 game-card-shadow hover:scale-105 transition-transform border border-border group bg-gradient-to-br ${t?.bg}`}
          >
            <div className="text-4xl font-display font-bold text-primary group-hover:text-secondary transition-colors">
              {/* {t?.table} */}
              <img src={t?.image} alt={`Table ${t?.table}`} />
            </div>
            <div className="text-2xl font-bold mt-1  text-black">
              Times table of {t?.table}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BharatTableSelector;
