import React, { useState } from "react";

const Card = React.memo(({ id, imgurl, value, isMatched, handleCardClick }) => {
  const [isFlipped, setFlipped] = useState(false);

  const flipCard = (state) => {
    setFlipped(state);
  };

  return (
    <div
      className="card-container"
      onClick={() => !isFlipped && !isMatched && handleCardClick(id, value, flipCard)}
    >
      <div className={`card ${isFlipped || isMatched ? "flipped" : ""}`}>
        <div className="side card_front"></div>
        <div
          className="side card_back"
          style={{ backgroundImage: `url(${imgurl})` }}
        ></div>
      </div>
    </div>
  );
});

export default Card;
