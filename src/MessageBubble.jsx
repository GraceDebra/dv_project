// components/MessageBubble.jsx
import React from "react";

const MessageBubble = ({ sender, text }) => {
  const isUser = sender === "user";

  return (
    <div
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        backgroundColor: isUser ? "#4f46e5" : "#e5e7eb",
        color: isUser ? "#fff" : "#000",
        maxWidth: "70%",
        padding: "10px 14px",
        borderRadius: 16,
        wordWrap: "break-word",
      }}
    >
      {text}
    </div>
  );
};

export default MessageBubble;