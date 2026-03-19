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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10 p-6">
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
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
              className="relative aspect-[9/4] rounded-2xl border-2 border-primary/30 overflow-hidden
                bg-gradient-to-br from-primary/80 to-secondary/80 hover:from-primary hover:to-secondary
                shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer group"
            >
              {/* Ticket back design */}
              <div className="absolute inset-0 flex items-center justify-center gap-3 text-primary-foreground">
                <div className="text-2xl group-hover:animate-bounce">🎲</div>
                <div className="flex flex-col items-start">
                  <div className="text-xs font-bold uppercase tracking-widest opacity-80">Math Bola</div>
                  <div className="text-lg font-bold">Ticket #{i + 1}</div>
                </div>
              </div>
              {/* Decorative border */}
              <div className="absolute inset-2 border-2 border-primary-foreground/20 rounded-xl pointer-events-none" />
              {/* Dashed line like a ticket stub */}
              <div className="absolute left-6 top-0 bottom-0 border-l-2 border-dashed border-primary-foreground/20 pointer-events-none" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
