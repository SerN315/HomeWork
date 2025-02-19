import React, { useState, useCallback } from "react";
import Card from "./Card";

const CardGrid = ({ memoizedCards, onGameComplete }) => {
  const [moves, setMoves] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]); // ✅ Store up to 2 selected cards
  const [matchedPairs, setMatchedPairs] = useState(new Set()); // ✅ Track matched pairs in state

  const handleCardClick = useCallback(
    (id, value, flipCard) => {
      if (selectedCards.length === 2 || matchedPairs.has(id)) return;

      const newSelection = [...selectedCards, { id, value, flipCard }];
      setSelectedCards(newSelection);
      flipCard(true); // ✅ Flip this card when clicked

      if (newSelection.length === 2) {
        setMoves((prev) => prev + 1);

        if (newSelection[0].value === newSelection[1].value) {
          // ✅ It's a match!
          setMatchedPairs(new Set([...matchedPairs, newSelection[0].id, newSelection[1].id]));
          setSelectedCards([]);
        } else {
          // ❌ Not a match, flip back after 600ms
          setTimeout(() => {
            newSelection[0].flipCard(false);
            newSelection[1].flipCard(false);
            setSelectedCards([]);
          }, 600);
        }

        // ✅ Check if game is complete
        if (matchedPairs.size + 2 === memoizedCards.length) {
          onGameComplete(moves + 1);
        }
      }
    },
    [selectedCards, matchedPairs, moves, onGameComplete]
  );

  return (
    <>
      {memoizedCards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          imgurl={card.imgurl}
          value={card.value}
          isMatched={matchedPairs.has(card.id)}
          handleCardClick={handleCardClick}
        />
      ))}
    </>
  );
};

export default CardGrid;
