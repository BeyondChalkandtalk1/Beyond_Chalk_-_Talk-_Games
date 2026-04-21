import { useState } from "react";
import { motion } from "framer-motion";
import blueBall from "@/assets/pahal/yellowBall.png";

interface Props {
  totalVisible?: number;
}

const HundredBallGrid = ({ totalVisible = 100 }: Props) => {
  const [animKey, setAnimKey] = useState(0);

  return (
    <div
      className="grid gap-0.5 cursor-pointer"
      style={{ gridTemplateColumns: "repeat(10, 1fr)", width: "fit-content" }}
      onClick={() => setAnimKey((k) => k + 1)} // 👈 click pe key change = animation restart
    >
      {Array.from({ length: 100 }, (_, i) => (
        <motion.div
          key={`${animKey}-${i}`} // 👈 key change hogi to framer motion re-mount karega
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
            delay: i * 0.04,
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