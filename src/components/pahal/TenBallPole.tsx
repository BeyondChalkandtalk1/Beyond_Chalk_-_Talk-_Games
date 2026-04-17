// TenBallPole.tsx
// 10 balls — vertical pole shape, upar se neeche one by one girti hain
import { motion } from "framer-motion";
import blueBall from "@/assets/pahal/greenBall.png";
import { useState } from "react";

interface Props {
  totalVisible?: number; // 0–10
  ballSize?: number; // px, default 28
}

const TenBallPole = ({ totalVisible = 10, ballSize = 28 }: Props) => {
   const [animKey, setAnimKey] = useState(0);
  return (
    <div className="cursor-pointer"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        width: "fit-content",
      }}
      onClick={() => setAnimKey((k) => k + 1)}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div
          key={`${animKey}-${i}`}
          initial={{ opacity: 0, y: -40, scale: 0.4 }}
          animate={
            i < totalVisible
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: -40, scale: 0.4 }
          }
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 14,
            delay: i * 0.12, // har ball 0.12s baad aaye
          }}
        >
          <img
            src={blueBall}
            alt=""
            style={{
              width: ballSize,
              height: ballSize,
              borderRadius: "50%",
              display: "block",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default TenBallPole;
