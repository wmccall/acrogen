import React from "react";

const LetterButton = props => {
  const { letter, locked, setLocked } = props;

  const handleClick = () => {
    setLocked(!locked);
  };

  return (
    <div className="LetterButton">
      <button type="button" onClick={() => handleClick()}>
        {letter}
      </button>
      <div className={locked ? "locked" : "unlocked"}>*</div>
    </div>
  );
};

export default LetterButton;
