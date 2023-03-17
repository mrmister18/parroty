import React, { useEffect, useState } from "react";
const timeAgo = require('node-time-ago');
import { getUser } from "../axios-services";

const Messages = ({messages, token, setMessages}) => {
    const [conversation, setConversation] = useState([]);

    useEffect(() => {
        const setUserMessages = async () => {
            const userProfile = await getUser(token)
      setMessages(userProfile.messages)
        }
        setUserMessages()
    }, [])
    
    return <>
    {messages.length ? <>{messages.map((message) => {
        return <div onClick={() => {setConversation(message.conversation)}}>
            {message.name} {`@${message.username}`} {message.conversation[0].messageContent} {timeAgo(message.conversation[0].createdAt)}
        </div>
    })}</> : <h1>No active conversations</h1>}
    {conversation.length ? <><h1>Conversation</h1>
    {conversation.map((message) => {
        return <><div>{message.messageContent}</div>
        <span>{timeAgo(message.createdAt)}</span></>
    })}
    </> : null}

    </>
}

export default Messages