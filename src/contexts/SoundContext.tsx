// import { createContext, useContext, useState, useCallback, ReactNode } from "react";

// interface SoundContextType {
//   isSoundEnabled: boolean;
//   toggleSound: () => void;
//   playSound: (src: string) => void;
// }

// const SoundContext = createContext<SoundContextType | null>(null);

// export const SoundProvider = ({ children }: { children: ReactNode }) => {
//   const [isSoundEnabled, setIsSoundEnabled] = useState(true);

//   const toggleSound = useCallback(() => {
//     setIsSoundEnabled((prev) => !prev);
//   }, []);

//   const playSound = useCallback(
//     (src: string) => {
//       if (!isSoundEnabled) return;
//       const audio = new Audio(src);
//       audio.currentTime = 0;
//       audio.play().catch(() => {});
//     },
//     [isSoundEnabled]
//   );

//   return (
//     <SoundContext.Provider value={{ isSoundEnabled, toggleSound, playSound }}>
//       {children}
//     </SoundContext.Provider>
//   );
// };

// export const useSound = () => {
//   const ctx = useContext(SoundContext);
//   if (!ctx) throw new Error("useSound must be used within SoundProvider");
//   return ctx;
// };

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from "react";

interface SoundContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  playSound: (src: string) => void;
  playLoopingSound: (src: string) => void;
  stopLoopingSound: () => void;
  clearLoopingSound: () => void; // ✅ new
}

const SoundContext = createContext<SoundContextType | null>(null);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const loopingAudioRef = useRef<HTMLAudioElement | null>(null);
  const pendingSrcRef = useRef<string | null>(null);
  const userInteractedRef = useRef<boolean>(false);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (userInteractedRef.current) return;
      userInteractedRef.current = true;

      if (pendingSrcRef.current && isSoundEnabled) {
        const audio = new Audio(pendingSrcRef.current);
        audio.loop = true;
        audio.volume = 0.5;
        loopingAudioRef.current = audio;
        audio.play().catch(() => {});
        pendingSrcRef.current = null;
      }

      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [isSoundEnabled]);

const toggleSound = useCallback(() => {
  setIsSoundEnabled((prev) => {
    const newValue = !prev;
    if (!newValue) {
      // Sound OFF
      if (loopingAudioRef.current) {
        loopingAudioRef.current.pause();
        loopingAudioRef.current.currentTime = 0;
      }
    } else {
      // ✅ Sound ON
      if (loopingAudioRef.current) {
        // Ref exist karta hai — resume karo
        loopingAudioRef.current.play().catch(() => {});
      } else if (pendingSrcRef.current && userInteractedRef.current) {
        // ✅ Ref null hai but pending src hai (Index page mounted) — naya audio banao
        const audio = new Audio(pendingSrcRef.current);
        audio.loop = true;
        audio.volume = 0.5;
        loopingAudioRef.current = audio;
        audio.play().catch(() => {});
      }
      // ✅ pendingSrcRef null hai (koi aur page) — kuch nahi chalega
    }
    return newValue;
  });
}, []);

  const playSound = useCallback(
    (src: string) => {
      if (!isSoundEnabled) return;
      const audio = new Audio(src);
      audio.currentTime = 0;
      audio.play().catch(() => {});
    },
    [isSoundEnabled],
  );

const playLoopingSound = useCallback(
  (src: string) => {
    // ✅ Pehle se chal raha ho to band karo
    if (loopingAudioRef.current) {
      loopingAudioRef.current.pause();
      loopingAudioRef.current.currentTime = 0;
      loopingAudioRef.current = null;
    }

    // ✅ Src hamesha pending mein store karo (sound off ho tab bhi)
    pendingSrcRef.current = src;

    // Sound off hai to bas src store karke return karo
    if (!isSoundEnabled) return;

    // User ne interact nahi kiya to bhi sirf src store karke return
    if (!userInteractedRef.current) return;

    // ✅ Dono conditions sahi hain — play karo
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.5;
    loopingAudioRef.current = audio;
    audio.play().catch(() => {});
  },
  [isSoundEnabled],
);

  const stopLoopingSound = useCallback(() => {
    if (loopingAudioRef.current) {
      loopingAudioRef.current.pause();
      loopingAudioRef.current.currentTime = 0;
    }
  }, []);

  // ✅ New — ref bhi null karo taaki dusre page pe sound na chale
const clearLoopingSound = useCallback(() => {
  if (loopingAudioRef.current) {
    loopingAudioRef.current.pause();
    loopingAudioRef.current.currentTime = 0;
    loopingAudioRef.current = null;
  }
  pendingSrcRef.current = null; // ✅ src bhi clear karo
}, []);

  return (
    <SoundContext.Provider
      value={{
        isSoundEnabled,
        toggleSound,
        playSound,
        playLoopingSound,
        stopLoopingSound,
        clearLoopingSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
};