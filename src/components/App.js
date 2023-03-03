import React, { useState, useEffect } from "react";
// getAPIHealth is defined in our axios-services directory index.js
// you can think of that directory as a collection of api adapters
// where each adapter fetches specific info from our express server's /api route
import { getAPIHealth, getUsers } from "../axios-services";
import { Routes, Route } from "react-router-dom";
import "../style/App.css";
import ParrotyFeed from "./ParrotyFeed";
import Sidenav from "./Sidenav";
import Messages from "./Messages";
import Profile from "./Profile";

const App = () => {
  const [APIHealth, setAPIHealth] = useState("");
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [token, setToken] = useState(
    window.localStorage.getItem("token") || ""
  );
  const [squawks, setSquawks] = useState([]);

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
  }, []);

  return (
    <>
      <Sidenav token={token} setToken={setToken} />
      <div className="main">
      <Routes>
        <Route path="/messages" element={<Messages user={user} setUser={setUser} token={token} />}></Route>
        <Route path="/" element={<ParrotyFeed squawks={squawks} setSquawks={setSquawks} />}></Route>
        <Route path="/:username" element={<Profile squawks={squawks} setSquawks={setSquawks} />}></Route>
      </Routes>
      </div>
    </>
  );
};

export default App;
