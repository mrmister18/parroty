import React, { useEffect, useState } from "react";
const timeAgo = require("node-time-ago");
import { getUser, sendMessage } from "../axios-services";
import { useNavigate } from "react-router-dom";

const Messages = ({ messages, token, setMessages }) => {
  const [conversation, setConversation] = useState([]);
  const [recipient, setRecipient] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const setUserMessages = async () => {
      const userProfile = await getUser(token);
      setMessages(userProfile.messages);
    };
    setUserMessages();
  }, []);

  return (
    <>
      {messages.length ? (
        <>
          {messages.map((message) => {
            return (
              <div
                onClick={() => {
                  setConversation(message.conversation);
                  setRecipient(message);
                }}
              >
                {message.name} {`@${message.username}`}{" "}
                {
                  message.conversation[message.conversation.length - 1]
                    .messageContent
                }{" "}
                {timeAgo(
                  message.conversation[message.conversation.length - 1]
                    .createdAt,
                  "twitter"
                )}
              </div>
            );
          })}
        </>
      ) : (
        <h1>No active conversations</h1>
      )}
      {conversation?.length ? (
        <>
          <h1
            onClick={() => {
              navigate(`/${recipient.username}`);
            }}
          >
            {recipient.name} @{recipient.username}
          </h1>
          {conversation.map((message) => {
            return (
              <div key={message.id}>
                <h3>{message.messageContent}</h3>
                <span>{timeAgo(message.createdAt, "twitter")}</span>
              </div>
            );
          })}
          <br />
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              const { createdMessage } = await sendMessage(
                message,
                recipient.userId,
                token
              );
              setConversation([...conversation, createdMessage]);
              setMessage("");
            }}
          >
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            ></input>
            <button type="submit" disabled={message ? false : true}>
              Send
            </button>
          </form>
        </>
      ) : null}
    </>
  );
};

export default Messages;
