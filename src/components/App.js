import React, { useState, useEffect } from "react";
// getAPIHealth is defined in our axios-services directory index.js
// you can think of that directory as a collection of api adapters
// where each adapter fetches specific info from our express server's /api route
import { getAPIHealth, getUsers, getUser } from "../axios-services";
import { Routes, Route } from "react-router-dom";
import "../style/App.css";
import ParrotyFeed from "./ParrotyFeed";
import Sidenav from "./Sidenav";
import Messages from "./Messages";
import Profile from "./Profile";
import Home from "./Home";
import Squawk from "./Squawk";
import Search from "./Search";

const App = () => {
  const [APIHealth, setAPIHealth] = useState("");
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [token, setToken] = useState(
    window.localStorage.getItem("token") || ""
  );
  const [squawks, setSquawks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [recipient, setRecipient] = useState({});

  useEffect(() => {
    window.localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    // follow this pattern inside your useEffect calls:
    // first, create an async function that will wrap your axios service adapter
    // invoke the adapter, await the response, and set the data
    const getAPIStatus = async () => {
      const { healthy } = await getAPIHealth();
      setAPIHealth(healthy ? "api is up! :D" : "api is down :/");
    };
    // second, after you've defined your getter above
    // invoke it immediately after its declaration, inside the useEffect callback
    getAPIStatus();

    const getParrotyUsers = async () => {
      const users = await getUsers();
      setUsers(users);
    };
    getParrotyUsers();

    const setUserProfile = async () => {
      if (token) {
        const userProfile = await getUser(token);
        setUser(userProfile);
      }
    };
    setUserProfile();
  }, []);
  return (
    <>
      <Sidenav
        token={token}
        setToken={setToken}
        user={user}
        setUser={setUser}
        setMessages={setMessages}
        setRecipient={setRecipient}
        setConversation={setConversation}
      />
      <div className="main">
        <Routes>
          <Route
            path="/messages"
            element={
              <Messages
                token={token}
                messages={messages}
                setMessages={setMessages}
                conversation={conversation}
                setConversation={setConversation}
                recipient={recipient}
                setRecipient={setRecipient}
              />
            }
          ></Route>
          <Route
            path="/"
            element={<ParrotyFeed squawks={squawks} setSquawks={setSquawks} />}
          ></Route>
          <Route
            path="/:username"
            element={
              <Profile
                squawks={squawks}
                setSquawks={setSquawks}
                user={user}
                token={token}
                setUser={setUser}
                setRecipient={setRecipient}
                setConversation={setConversation}
              />
            }
          ></Route>
          <Route
            path="/home"
            element={
              <Home
                setSquawks={setSquawks}
                squawks={squawks}
                user={user}
                setUser={setUser}
                token={token}
              />
            }
          ></Route>
          <Route
            path="/:username/:squawkId"
            element={<Squawk token={token} user={user} />}
          ></Route>
          <Route
            path="/search/:searchTerm"
            element={<Search users={users} setUsers={setUsers} squawks={squawks} setSquawks={setSquawks} />}
          ></Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
