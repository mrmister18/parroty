import React, { useEffect, useState } from "react";
const timeAgo = require("node-time-ago");
import { getUser, sendMessage } from "../axios-services";
import { useNavigate } from "react-router-dom";

const Messages = ({ messages, token, setMessages, conversation, setConversation, recipient, setRecipient }) => {
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
    <h1>Messages</h1>
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
      {recipient.username ? (
        <>
          <h1
            onClick={() => {
              navigate(`/${recipient.username}`);
            }}
          >
            {recipient.name} @{recipient.username}
          </h1>
          {conversation?.length ? <>
          {conversation.map((message) => {
            return (
              <div key={message.id}>
                <h3>{message.messageContent}</h3>
                <span>{message.postedAt}</span>
              </div>
            );
          })}</> : null}
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
              let index = messages.findIndex(message => message.name === recipient.name)
              let copy = [...messages]
              if (index >= 0) {
              copy[index]?.conversation.push(createdMessage)}
              else {let recipientCopy = {...recipient}
              recipientCopy.conversation.push(createdMessage)
                copy.push(recipientCopy)}
              setMessages(copy)
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
