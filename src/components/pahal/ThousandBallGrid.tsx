// ThousandBallGrid.tsx
import { motion } from "framer-motion";
import redBall from "@/assets/pahal/redball.png";
import { useState } from "react";

interface Props {
  totalVisible?: number;
  ballSize?: number;
}

const ThousandBallGrid = ({
  totalVisible = 1000,
  ballSize = 20,
}: Props) => {
  const COLS = 10;
  const ROWS = 10;
  const LAYERS = 10;
  const gap = 0.1;

  const cellSize = ballSize + gap;
  const gridW = COLS * cellSize;
  const gridH = ROWS * cellSize;

  // 3D cube depth = LAYERS * cellSize translateZ spread
  // rotateX(-28deg) rotateY(-40deg) se cube visually
  // ~40% extra width aur ~60% extra height leta hai
  // Wrapper ko itna bada banao ki cube fit ho, overflow:visible rakho
  const wrapperW = gridW + LAYERS * cellSize * 0.8;
  const wrapperH = gridH + LAYERS * cellSize * 0.6;

   const [animKey, setAnimKey] = useState(0);

  return (
    /* 
      KEY FIX:
      - Outer div: full width, flex center — column mein horizontally center
      - Inner div: fixed wrapperW x wrapperH, overflow: visible
      - 3D cube div: position absolute, top/left 50%, translate(-50%,-50%)
        → cube apne center pe render hoga, wrapper ke andar centered
    */
    <div
      className="cursor-pointer"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
      onClick={() => setAnimKey((k) => k + 1)}
    >
      <div
        style={{
          position: "relative",
          width: wrapperW,
          height: wrapperH,
          overflow: "visible",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "70%",
            transform: "translate(-50%, -50%)",
            perspective: "900px",
          }}
        >
          <div
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(-23deg) rotateY(-44deg)",
              position: "relative",
              width: gridW,
              height: gridH,
            }}
          >
            {Array.from({ length: LAYERS }, (_, layerIndex) => {
              const zOffset = layerIndex * cellSize;
              const layerStart = layerIndex * COLS * ROWS;

              return (
                <div
                  // key={layerIndex}
                  key={`${animKey}-${layerIndex}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transformStyle: "preserve-3d",
                    transform: `translateZ(${zOffset}px)`,
                    display: "grid",
                    gridTemplateColumns: `repeat(${COLS}, ${ballSize}px)`,
                    gap: `${gap}px`,
                  }}
                >
                  {Array.from({ length: COLS * ROWS }, (_, i) => {
                    const globalIndex = layerStart + i;
                    const isVisible = globalIndex < totalVisible;

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0, y: -8 }}
                        animate={
                          isVisible
                            ? { opacity: 1, scale: 1, y: 0 }
                            : { opacity: 0, scale: 0, y: -8 }
                        }
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 12,
                          delay: layerIndex * 0.15 + i * 0.008,
                        }}
                        style={{ width: ballSize, height: ballSize }}
                      >
                        <img
                          src={redBall}
                          alt=""
                          style={{
                            width: ballSize,
                            height: ballSize,
                            borderRadius: "50%",
                            display: "block",
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThousandBallGrid;

