import React, { useEffect, useState } from "react";
const timeAgo = require('node-time-ago');

const Messages = ({messages}) => {
    const [conversation, setConversation] = useState([]);

    return <>
    {messages.length ? <>{messages.map((message) => {
        return <div onClick={() => {setConversation(message.conversation)}}>
            {message.name} {`@${message.username}`} {message.conversation[0].messageContent} {timeAgo(message.conversation[0].createdAt)}
        </div>
    })}</> : <h1>Aww look who's unloved</h1>}
    </>
}

export default Messages