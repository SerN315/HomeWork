import React from "react";

const Card = React.memo(({ id, imgurl, choosen, handleCardClick }) => {
  return (
    <div className="card-container" onClick={() => handleCardClick(id)}>
      <div className={`card ${choosen ? "flipped" : ""}`}>
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
