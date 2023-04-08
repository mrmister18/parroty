import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerNewUser, userLogin } from "../axios-services";

const Sidenav = ({ token, setToken, user, setUser, setMessages, setRecipient, setConversation }) => {
  const [registering, setRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  function closeForm() {
    document.getElementById("myForm").style.display = "none";
    document.getElementById("background").style.display = "none";
  }

  function openForm() {
    document.getElementById("myForm").style.display = "flex";
    document.getElementById("background").style.display = "flex";
  }

  async function loggingIn() {
    const data = await userLogin({ username, password });
    setToken(data.token);
  }

  async function registeringUser() {
    const data = await registerNewUser({ username, password, name });
    setToken(data.token);
  }
  return (
    <>
      <div className="sidenav">
        {token && <div onClick={() => navigate("/home")} className="sidebar-option"><h2>Home</h2></div>}
        <div className="sidebar-option" onClick={() => navigate("/")}><h2>Explore</h2></div>
        {token && <div className="sidebar-option" onClick={() => navigate("/messages")}><h2>Messages</h2></div>}
        {user.username && <div onClick={() => navigate(`/${user.username}`)} className="sidebar-option"><h2>Profile</h2></div>}
        {token ? (
          <div onClick={() => {
            setToken("");
            setMessages([]);
            setConversation([])
            setRecipient({})
            setUser({});
            navigate("/");
          }} className="sidebar-option"><h2>
            Logout
          </h2></div>
        ) : (
          <>
          <div onClick={() => {
                setRegistering(false);
                openForm();
              }} className="sidebar-option"><h2>
              Login
            </h2></div>
            <div className="sidebar-option" onClick={() => {
                setRegistering(true);
                openForm();
              }}><h2>
              Sign Up
            </h2></div>
          </>
        )}
      </div>
      <div id="background">
        </div>
      <div className="popup" id="myForm">
        <form
          className="nav-form"
        >
          <div className="popup-head"><div className="close" onClick={closeForm}>&times;</div></div>
          {registering ? <h1>Join Parroty today</h1> : <h1>Sign in to Parroty</h1>}
          <input
            name="username"
            placeholder="Username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            required
          ></input>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            required
          ></input>
          {registering ? (
            <>
              <input
                name="name"
                placeholder="Name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                required
              ></input>
            </>
          ) : null}
          {registering ? (
            <><div class="submit" onClick={(event) => {
              event.preventDefault();
              registering ? registeringUser() : loggingIn();
              setUsername("");
              setPassword("");
            }}>Register</div>
            <h4>Have an account already? <span class="pop-switch" onClick={() => {setRegistering(false)}}>Login Here!</span></h4></>
          ) : (
            <><div class="submit" onClick={(event) => {
              event.preventDefault();
              registering ? registeringUser() : loggingIn();
              setUsername("");
              setPassword("");
            }}>Login</div>
            <h4>Don't have an account? <span class="pop-switch" onClick={() => {setRegistering(true)}}>Register Here!</span></h4></>
          )}
        </form>
      </div>
    </>
  );
};

export default Sidenav;
