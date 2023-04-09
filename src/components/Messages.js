import React, { useEffect, useState } from "react";
const timeAgo = require("node-time-ago");
import { getUser, sendMessage } from "../axios-services";
import { useNavigate } from "react-router-dom";

const Messages = ({ messages, token, setMessages, conversation, setConversation, recipient, setRecipient, user }) => {
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
    <div className="convos">
    <div className="conversation-list">
    <h1 className="title">Messages</h1>
      {messages.length ? (
        <>
          {messages.map((message) => {
            return (
              <div
              className="conversation-block"
                onClick={() => {
                  setConversation(message.conversation);
                  setRecipient(message);
                }}
              >
                <h3
                    className="author-name">
                      {message.name}
                      <span className="post__headerSpecial">
                        <span className="material-icons post__badge"> </span>@
                        {message.username} · {timeAgo(message.conversation[message.conversation.length - 1]
                    .createdAt, "twitter")}</span>
                    </h3>
                {
                  message.conversation[message.conversation.length - 1]
                    .messageContent
                }{" "}
              </div>
            );
          })}
        </>
      ) : (
        <h1>No active conversations</h1>
      )}
      </div>
      <div className="active-conversation">
      {recipient.username ? (
        <>
          <h1
          className="recipient"
            onClick={() => {
              navigate(`/${recipient.username}`);
            }}
          >
            {recipient.name} @{recipient.username}
          </h1>
          {conversation?.length ? <>
          {conversation.map((message) => {
            console.log(message.receiver, user.id)
            return (<>
              <div key={message.id}
              className={message.receiver === user.id ? "received message" : "sent message"}>
                <h3>{message.messageContent}</h3>
              </div>
                <div>{message.postedAt}</div>
                </>
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
              placeholder="Start a new message"
            ></input>
            <button type="submit" disabled={message ? false : true}>
              Send
            </button>
          </form>
        </>
      ) : null}
      </div>
      </div>
    </>
  );
};

export default Messages;
