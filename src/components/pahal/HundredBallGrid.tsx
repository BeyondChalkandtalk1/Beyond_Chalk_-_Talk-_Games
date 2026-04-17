// HundredBallGrid.tsx
import { motion } from "framer-motion";
import blueBall from "@/assets/pahal/yellowBall.png";

interface Props {
  totalVisible?: number; // 0-100, kitne balls dikhne chahiye
}

const HundredBallGrid = ({ totalVisible = 100 }: Props) => {
  return (
    <div
      className="grid gap-0.5"
      style={{ gridTemplateColumns: "repeat(10, 1fr)", width: "fit-content" }}
    >
      {Array.from({ length: 100 }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, y: -10 }}
          animate={
            i < totalVisible
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0, y: -10 }
          }
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 12,
            delay: i * 0.04, // har ball thodi der baad aaye
          }}
        >
          <img
            src={blueBall}
            alt=""
            className="w-6 h-6 md:w-7 md:h-7 rounded-full shadow-sm"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default HundredBallGrid;
