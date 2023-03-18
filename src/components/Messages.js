import React, { useEffect, useState } from "react";
const timeAgo = require('node-time-ago');
import { getUser, sendMessage } from "../axios-services";

const Messages = ({messages, token, setMessages}) => {
    const [conversation, setConversation] = useState({});
    const [message, setMessage] = useState("")

    useEffect(() => {
        const setUserMessages = async () => {
            const userProfile = await getUser(token)
      setMessages(userProfile.messages)
        }
        setUserMessages()
    }, [])
    
    return <>
    {messages.length ? <>{messages.map((message) => {
        return <div onClick={() => {setConversation(message)}}>
            {message.name} {`@${message.username}`} {message.conversation[message.conversation.length - 1].messageContent} {timeAgo(message.conversation[message.conversation.length - 1].createdAt)}
        </div>
    })}</> : <h1>No active conversations</h1>}
    {conversation?.conversation?.length ? <><h1>{conversation.name} @{conversation.username}</h1>
    {conversation.conversation.map((message) => {
        return <><h3>{message.messageContent}</h3>
        <span>{timeAgo(message.createdAt)}</span></>
    })}<br/>
    <form onSubmit={(event) => {
        event.preventDefault();
        const sentMessage = sendMessage(message, conversation.userId, token)
        setMessage("")
    }}>
        <input value={message} onChange={(event) => setMessage(event.target.value)}></input><button type="submit" disabled={message ? false : true}>Send</button>
    </form>
    </> : null}

    </>
}

export default Messages