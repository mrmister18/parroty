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
        {token && <Link to="/home">Home</Link>}
        <Link to="/">Explore</Link>
        {token && <Link to="/messages">Messages</Link>}
        {user.username && <Link to={user.username}>Profile</Link>}
        {token ? (
          <button
            onClick={() => {
              setToken("");
              setMessages([]);
              setConversation([])
              setRecipient({})
              setUser({});
              navigate("/");
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                setRegistering(false);
                openForm();
              }}
            >
              Login
            </button>
            <button
              onClick={() => {
                setRegistering(true);
                openForm();
              }}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
      <div id="background">
        </div>
      <div className="popup" id="myForm">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            registering ? registeringUser() : loggingIn();
            setUsername("");
            setPassword("");
          }}
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
            <><button type="submit">Register</button>
            <h4>Have an account already? <span class="pop-switch" onClick={() => {setRegistering(false)}}>Login Here!</span></h4></>
          ) : (
            <><button type="submit">Login</button>
            <h4>Don't have an account? <span class="pop-switch" onClick={() => {setRegistering(true)}}>Register Here!</span></h4></>
          )}
        </form>
      </div>
    </>
  );
};

export default Sidenav;
