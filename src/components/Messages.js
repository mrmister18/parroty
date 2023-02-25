import React, { useEffect, useState } from "react";
import { getUser } from "../axios-services"

const Messages = ({user, setUser, token}) => {
    const [messages, setMessages] = useState({});

    useEffect(() => {
        const setUserProfile = async () => {
            const userProfile = await getUser(token)
            setUser(userProfile)
            setMessages(userProfile.messages)
        }
        setUserProfile()
    }, [])
    return <>
    {messages.length ? <h1>Wow look at you mistuh popular!</h1> : <h1>Aww look who's unloved</h1>}
    </>
}

export default Messages