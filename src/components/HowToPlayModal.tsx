import { motion } from "framer-motion";

const HowToPlayModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="relative w-[90%] max-w-[450px] 
        bg-[#FBF5EF] 
        rounded-3xl 
        shadow-[0_15px_40px_rgba(0,0,0,0.25)] 
        p-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl font-bold text-[#8F2424]"
        >
          ✖
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-4 text-[#8F2424]">
          📖 How to Play
        </h2>

        {/* Content */}
        <div className="max-h-[300px] overflow-y-auto pr-2">
          <ul className="space-y-3 text-gray-700 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span>📅</span>
              Explore the calendar leaf shown on the screen.
            </li>
            <li className="flex gap-2">
              <span>🔎</span>
              Notice the pattern of days and dates to guess the correct month.
            </li>
            <li className="flex gap-2">
              <span>🧩</span>
              Drag and place the calendar leaf into the correct month space.
            </li>
            <li className="flex gap-2">
              <span>🎯</span>
              If correct, a fun challenge about that month will pop up!
            </li>
            <li className="flex gap-2">
              <span>💡</span>
              Answer the question to unlock the next calendar leaf.
            </li>
            <li className="flex gap-2">
              <span>🏆</span>
              Place all 12 months correctly to complete the calendar!
            </li>
          </ul>
        </div>

        {/* Fun Footer Button */}
        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="bg-[#8F2424] text-white px-6 py-2 rounded-full 
            shadow-md hover:scale-105 transition"
          >
            Let’s Play 🎉
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default HowToPlayModal;
