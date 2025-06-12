// src/hooks/useMoves.ts
import { useRef, useState } from "react";

export function useMoves() {
  const [moves, setMoves] = useState(0);
  const movesRef = useRef(0);

  const incrementMoves = () => {
    movesRef.current += 1;
    setMoves((prev) => prev + 1);
  };

  return { moves, movesRef, incrementMoves };
}
