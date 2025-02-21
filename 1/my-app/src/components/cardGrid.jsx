import React, { useState, useCallback } from "react";
import Card from "./Card";

const CardGrid = ({
  memoizedCards,
  onGameComplete,
  incrementMoves,
  getMoves,
}) => {
  // const [moves, setMoves] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]); //  Store up to 2 selected cards
  const [matchedPairs, setMatchedPairs] = useState(new Set()); //  Track matched pairs in state

  const handleCardClick = useCallback(
    (id, value, flipCard) => {
      if (selectedCards.length === 2 || matchedPairs.has(id)) return;

      const newSelection = [...selectedCards, { id, value, flipCard }];
      setSelectedCards(newSelection);
      flipCard(true);

      if (newSelection.length === 2) {
        incrementMoves(); //ref-based function instead of causing re-renders

        if (newSelection[0].value === newSelection[1].value) {
          setMatchedPairs(
            new Set([...matchedPairs, newSelection[0].id, newSelection[1].id])
          );
          setSelectedCards([]);
        } else {
          setTimeout(() => {
            newSelection[0].flipCard(false);
            newSelection[1].flipCard(false);
            setSelectedCards([]);
          }, 600);
        }

        if (matchedPairs.size + 2 === memoizedCards.length) {
          onGameComplete(getMoves());
        }
      }
    },
    [selectedCards, matchedPairs, onGameComplete, incrementMoves]
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
