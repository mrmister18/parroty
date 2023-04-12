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
          <div
          className="recipient"
            onClick={() => {
              navigate(`/${recipient.username}`);
            }}
          >
            <img src={recipient.profilePicture} alt="" className="recipient-pic"></img>
            <div className="recipient-name">{recipient.name}</div> 
            <div className="recipient-username">@{recipient.username}</div>
          </div>
          {conversation?.length ? <>
          {conversation.map((message) => {
            return (<>
              <div key={message.id}
              className={message.receiver === user.id ? "received message" : "sent message"}>
                <div>{message.messageContent}</div>
              </div>
                <div className={message.receiver === user.id ? "received-time message-time" : "sent-time message-time"}>{message.postedAt}</div>
                </>
            );
          })}</> : <div>Select a Message</div>}
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
            <div className="message-input-div"><input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Start a new message"
              className="message-input"
            ></input>
            <button className="message-button" type="submit" disabled={message ? false : true}>
              Send
            </button>
            </div>
          </form>
        </>
      ) : null}
      </div>
      </div>
    </>
  );
};

export default Messages;
