import React, { useState, useCallback, useMemo } from "react";
import Card from "./Card";

const CardGrid = ({
  difficulties,
  memoizedCards,
  completeHandler,
  timeLeft,
}) => {
  const [activeCards, setActiveCards] = useState([]);
  const [matchPairs, setMatchPairs] = useState([]);
  const [moves, setMoves] = useState(0);

  const handleCardClick = useCallback(
    (id) => {
      if (
        activeCards.length === 2 ||
        activeCards.includes(id) ||
        matchPairs.includes(id)
      )
        return;

      const newFlipped = [...activeCards, id];
      setActiveCards(newFlipped);

      if (newFlipped.length === 2) {
        const cardMap = new Map(memoizedCards.map((card) => [card.id, card]));

        const [first, second] = newFlipped.map((cardId) => cardMap.get(cardId));
        setMoves((prev) => prev + 1);

        if (first?.value === second?.value) {
          const newMatchPairs = [...matchPairs, first.id, second.id];
          setMatchPairs(newMatchPairs);
          if (newMatchPairs.length === memoizedCards.length) {
            console.log("Game Completed! Time Left:", timeLeft);
            completeHandler(moves + 1, timeLeft);
          }
        }
        setTimeout(() => setActiveCards([]), 600);
      }
    },
    [activeCards, matchPairs, memoizedCards, moves, completeHandler, timeLeft]
  );

  return (
    <>
      {memoizedCards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          imgurl={card.imgurl}
          choosen={
            activeCards.includes(card.id) || matchPairs.includes(card.id)
          }
          handleCardClick={handleCardClick}
        />
      ))}
    </>
  );
};

export default CardGrid;
