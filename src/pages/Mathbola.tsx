import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgeGroup } from "@/data/mathboladata";
import AgeSelection from "@/components/math-bola/AgeSelection";
import TicketSelection from "@/components/math-bola/TicketSelection";
import MathBolaGame from "@/components/math-bola/MathBolaGame";

type Phase = "age" | "ticket" | "game";

export default function MathBola() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("age");
  const [age, setAge] = useState<AgeGroup>("7");
  const [ticketIndex, setTicketIndex] = useState(0);

  const handleAgeSelect = (selectedAge: AgeGroup) => {
    setAge(selectedAge);
    setPhase("ticket");
  };

  const handleTicketSelect = (idx: number) => {
    setTicketIndex(idx);
    setPhase("game");
  };

  const handlePlayAgain = () => {
    setPhase("age");
  };

  const handleHome = () => {
    navigate("/");
  };

  switch (phase) {
    case "age":
      return <AgeSelection onSelect={handleAgeSelect} />;
    case "ticket":
      return <TicketSelection age={age} onSelect={handleTicketSelect} />;
    case "game":
      return (
        <MathBolaGame
          age={age}
          ticketIndex={ticketIndex}
          onComplete={handlePlayAgain}
          onHome={handleHome}
        />
      );
  }
}
