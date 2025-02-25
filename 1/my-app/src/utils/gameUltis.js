export const difficultiesSetting = {
  easy: { time: 40, pairs: 2 },
  medium: { time: 20, pairs: 4 },
  hard: { time: 10, pairs: 6 },
};

export const generateCards = (allCards, difficulty) => {
  if (!allCards.length) return [];

  const { pairs } = difficultiesSetting[difficulty];
  const selectedCards = allCards.slice(0, pairs);

  // Duplicate and assign unique IDs
  const pairedCards = selectedCards.flatMap((card, index) => [
    { ...card, id: index * 2 },
    { ...card, id: index * 2 + 1 },
  ]);

  return pairedCards.sort(() => Math.random() - 0.5); // Shuffle
};
