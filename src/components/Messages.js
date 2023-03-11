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
    </>
}

export default Messages