import { motion } from 'framer-motion';
import { AgeGroup } from '@/data/mathBolaData';
import { useSound } from '@/contexts/SoundContext';
import tapSound from '@/assets/tapToOpenSound.mpeg';

interface Props {
  age: AgeGroup;
  onSelect: (ticketIndex: number) => void;
}

export default function TicketSelection({ age, onSelect }: Props) {
  const { playSound } = useSound();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-2xl w-full"
      >
        <div className="text-4xl">🎫</div>
        <h2 className="text-2xl md:text-3xl font-bold text-secondary" style={{ fontFamily: 'var(--font-display)' }}>
          Pick Your Ticket!
        </h2>
        <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
          Age Group: <span className="font-bold text-primary">{age} years</span> — Choose one of the 6 Math Bola tickets
        </p>

        {/* 2 rows × 3 cols of face-down tickets */}
        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.button
              key={i}
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ delay: i * 0.1, type: 'spring', damping: 12 }}
              onClick={() => {
                playSound(tapSound);
                onSelect(i);
              }}
              className="relative aspect-[3/4] rounded-2xl border-2 border-primary/30 overflow-hidden
                bg-gradient-to-br from-primary/80 to-secondary/80 hover:from-primary hover:to-secondary
                shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer group"
            >
              {/* Card back design */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground">
                <div className="text-3xl mb-2 group-hover:animate-bounce">🎲</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Math Bola</div>
                <div className="text-lg font-bold mt-1">Clue #{i + 1}</div>
              </div>
              {/* Decorative pattern */}
              <div className="absolute inset-2 border-2 border-primary-foreground/20 rounded-xl pointer-events-none" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
