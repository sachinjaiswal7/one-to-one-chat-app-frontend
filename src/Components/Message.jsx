import React from "react";
import empty_profile from "../empty_profile.png";
const Message = ({ user, imageUrl="https://chat.openai.com/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FAAcHTtdvfFvfUUCu8tnhk75tp4Epc1oeTJ2g1RkGVVkrU_u_lA%3Ds96-c&w=96&q=75",message}) => {
  return (
    <>
      {user !== "me" ? (
        <div className="one-message">
          <div className="one-message-left-side">
            <img src={imageUrl} alt="" />
            <p>{"sachhun"}</p>
          </div>
          <div className="one-message-right-side">{message}</div>
        </div>
      ) : (
        <div className="one-message-counter">
          <div className="one-message-counter-left-side">{message}</div>
          <div className="one-message-counter-right-side">
            <img src={imageUrl} alt="" />
            <p>something</p>
          </div>
        </div>
      )}




    </>
  );
};

export default Message;
