const MessageBubble = ({ sender, text }) => {
  const isUser = sender === "user";

  const bubbleStyle = {
    maxWidth: "70%",
    padding: "10px 14px",
    borderRadius: "16px",
    margin: "4px 0",
    fontSize: "15px",
    lineHeight: "1.4",
    alignSelf: isUser ? "flex-end" : "flex-start",
    backgroundColor: isUser ? "#9333ea" : "#4b5563",
    color: "#fff",
  };

  if (text === "__typing__") {
    return (
      <div style={bubbleStyle}>
        <div style={styles.typingIndicator}>
          <span style={{ ...styles.dot, animationDelay: "0s" }} />
          <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
          <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
        </div>
      </div>
    );
  }

  return <div style={bubbleStyle}>{text}</div>;
};

const styles = {
  typingIndicator: {
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    height: 20,
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: "#ccc",
    borderRadius: "50%",
    animation: "pulse 1.2s infinite ease-in-out",
  },
};

// Inject keyframes once into the document
const injectKeyframes = () => {
  if (!document.getElementById("typing-keyframes")) {
    const style = document.createElement("style");
    style.id = "typing-keyframes";
    style.innerHTML = `
      @keyframes pulse {
        0%, 100% {
          transform: scale(0.85);
          opacity: 0.5;
        }
        50% {
          transform: scale(1.2);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

injectKeyframes();

export default MessageBubble;