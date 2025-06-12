import React from "react";

function UserInfo({
  userName,
  setUserName,
  isNameSet,
  setIsNameSet,
  handleUserNameSubmit,
  isStart,
}) {
  return (
    <div
      className="Uinfo"
      style={{
        display: isStart ? "none" : "block",
      }}
    >
      {!isNameSet ? (
        <form onSubmit={handleUserNameSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button type="submit">Save Name</button>
        </form>
      ) : (
        <p>
          Welcome back, <strong>{userName}</strong>!
        </p>
      )}
      <button
        onClick={() => {
          localStorage.removeItem("userName");
          setUserName("");
          setIsNameSet(false);
        }}
      >
        Change Username
      </button>
    </div>
  );
}

export default UserInfo;
