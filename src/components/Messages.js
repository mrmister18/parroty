import React, { useEffect, useState } from "react";
import { getUser } from "../axios-services"
const timeAgo = require('node-time-ago');

const Messages = ({user, setUser, token}) => {
    const [messages, setMessages] = useState([]);
    const [conversation, setConversation] = useState([]);

    useEffect(() => {
        const setUserProfile = async () => {
            const userProfile = await getUser(token)
            setUser(userProfile)
            setMessages(userProfile.messages)
        }
        setUserProfile()
    }, [])
    console.log(conversation)
    return <>
    {messages.length ? <>{messages.map((message) => {
        return <div onClick={() => {setConversation(message.conversation)}}>
            {message.name} {`@${message.username}`} {message.conversation[0].messageContent} {timeAgo(message.conversation[0].createdAt)}
        </div>
    })}</> : <h1>Aww look who's unloved</h1>}
    </>
}

export default Messages