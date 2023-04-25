import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerNewUser, userLogin, getUser, createSquawk } from "../axios-services";

const Sidenav = ({
  token,
  setToken,
  user,
  setUser,
  setMessages,
  setRecipient,
  setConversation,
  activeNav,
  squawkContent,
  setSquawkContent,
  squawkPicture,
  setSquawkPicture,
  setSquawks,
  squawks
}) => {
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
    const userProfile = await getUser(data.token);
      setUser(userProfile);
  }

  async function registeringUser() {
    const data = await registerNewUser({ username, password, name });
    setToken(data.token);
    const userProfile = await getUser(data.token);
      setUser(userProfile);
  }
  return (
    <>
      <div className="sidenav">
        {token && (
          <div onClick={() => navigate("/home")} className={`sidebar-option ${activeNav === "Home" ? "active-nav-option" : " "}`}>
            <svg className="sidebar-pic" viewBox="0 0 24 24">
              <g>
                {activeNav === "Home" ? <path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"></path> : <path d="M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z"></path>}
              </g>
            </svg>
            <div>Home</div>
          </div>
        )}
        <div className={`sidebar-option ${activeNav === "Explore" ? "active-nav-option" : " "}`} onClick={() => navigate("/")}>
          <svg className="sidebar-pic" viewBox="0 0 24 24">
            <g>
              {activeNav === "Explore" ? <path d="M10.64 3.157l-.36 3.593h4.99l.38-3.892 2.99.299-.36 3.593h2.97v2.5h-3.22l-.55 5.5h2.77v2.5h-3.02l-.39 3.892-2.98-.299.36-3.593H9.23l-.39 3.892-2.98-.299.36-3.593H2.75v-2.5h3.72l.55-5.5H3.75v-2.5h3.52l.38-3.892 2.99.299zm3.83 11.593l.55-5.5h-4.99l-.55 5.5h4.99z"></path> : <path d="M10.09 3.098L9.72 7h5.99l.39-4.089 1.99.187L17.72 7h3.78v2h-3.97l-.56 6h3.53v2h-3.72l-.38 4.089-1.99-.187.36-3.902H8.78l-.38 4.089-1.99-.187L6.77 17H2.5v-2h4.46l.56-6H3.5V7h4.21l.39-4.089 1.99.187zM14.96 15l.56-6H9.53l-.56 6h5.99z"></path>}
            </g>
          </svg>
          <div>Explore</div>
        </div>
        {token && (
          <div className={`sidebar-option ${activeNav === "Messages" ? "active-nav-option" : " "}`} onClick={() => navigate("/messages")}>
            <svg className="sidebar-pic" viewBox="0 0 24 24">
              <g>
                {activeNav === "Messages" ? <path d="M1.998 4.499c0-.828.671-1.499 1.5-1.499h17c.828 0 1.5.671 1.5 1.499v2.858l-10 4.545-10-4.547V4.499zm0 5.053V19.5c0 .828.671 1.5 1.5 1.5h17c.828 0 1.5-.672 1.5-1.5V9.554l-10 4.545-10-4.547z"></path> : <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>}
              </g>
            </svg>
            <div>Messages</div>
          </div>
        )}
        {user.username && (
          <div
            onClick={() => navigate(`/${user.username}`)}
            className={`sidebar-option ${activeNav === "Profile" ? "active-nav-option" : " "}`}
          >
            <svg className="sidebar-pic" viewBox="0 0 24 24">
              <g>
                {activeNav === "Profile" ? <path d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z"></path> : <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>}
              </g>
            </svg>
            <div>Profile</div>
          </div>
        )}
        {token ? (
          <>
          <div
            onClick={() => {
              setToken("");
              setMessages([]);
              setConversation([]);
              setRecipient({});
              setUser({});
              navigate("/");
            }}
            className="sidebar-option"
            >
            <svg className="sidebar-pic" viewBox="0 0 24 24">
              <g>
                <path d="M15 24H1c-.6 0-1-.4-1-1V1c0-.6.4-1 1-1h14c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1s-1-.4-1-1V2H2v20h12v-6c0-.6.4-1 1-1s1 .4 1 1v7c0 .6-.4 1-1 1z"></path>
                <path d="M23 13H8c-.6 0-1-.4-1-1s.4-1 1-1h15c.6 0 1 .4 1 1s-.4 1-1 1z"></path>
                <path d="M23 13c-.3 0-.5-.1-.7-.3l-4-4c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l4 4c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3z"></path>
                <path d="M19 17c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l4-4c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-4 4c-.2.2-.4.3-.7.3z"></path>
              </g>
            </svg>
            <div>Logout</div>
          </div>
            <button onClick={() => {
              document.getElementById("popup-squawk-form").style.display = "flex";
              document.getElementById("background").style.display = "flex";
            }}>Squawk</button>
          </>
        ) : (
          <>
            <div
              onClick={() => {
                setRegistering(false);
                openForm();
              }}
              className="sidebar-option"
            >
              <svg className="sidebar-pic" viewBox="0 0 500 500">
                <path d="M255.988 32C160.473 32 78.934 91.804 46.727 176h34.639c9.396-20.484 22.457-39.35 38.868-55.762C156.497 83.973 204.709 64 255.988 64c51.286 0 99.504 19.973 135.771 56.239C428.027 156.505 448 204.719 448 256c0 51.285-19.973 99.501-56.239 135.765C355.494 428.029 307.275 448 255.988 448c-51.281 0-99.493-19.971-135.755-56.234-16.412-16.412-29.473-35.28-38.871-55.766H46.725c32.206 84.201 113.746 144 209.264 144C379.703 480 480 379.715 480 256c0-123.702-100.297-224-224.012-224z"></path>
                <path d="M206.863 323.883l22.627 22.627L320 256l-90.51-90.51-22.628 22.628L258.745 240H32v32h226.745z"></path>
              </svg>
              <div>Login</div>
            </div>
            <div
              className="sidebar-option"
              onClick={() => {
                setRegistering(true);
                openForm();
              }}
            >
              <svg className="sidebar-pic" viewBox="0 0 60 60">
                <path d="M25.71118,34.71187A14.83144,14.83144,0,0,0,40.52545,19.89712C39.7112.24471,11.70817.25044,10.89689,19.89723A14.83146,14.83146,0,0,0,25.71118,34.71187Zm0-27.62782A12.82793,12.82793,0,0,1,38.52475,19.89712C37.82111,36.89674,13.59866,36.8918,12.8976,19.897A12.82793,12.82793,0,0,1,25.71118,7.08405Z"></path>
                <path d="M25.71118 36.19481a21.74618 21.74618 0 00-21.721 21.72147 1.00009 1.00009 0 001.00035 1.00035H46.43181a.99978.99978 0 001.00035-1.00035A21.74586 21.74586 0 0025.71118 36.19481zm0 2.0007a19.72829 19.72829 0 0119.6696 18.72042H6.04159A19.728 19.728 0 0125.71118 38.19551zM59.00945 32.71117H50.81811V24.52179a1.00055 1.00055 0 00-2.0007.00006v8.18932H40.628a1.00035 1.00035 0 000 2.0007h8.18939v8.18841a1.00035 1.00035 0 002.0007 0V34.71187h8.19134A1.00055 1.00055 0 0059.00945 32.71117z"></path>
              </svg>
              <div>Sign Up</div>
            </div>
          </>
        )}
      </div>
      <div id="background" onClick={() => {
        document.getElementById("background").style.display = "none";
        document.getElementById("myForm").style.display = "none";
        document.getElementById("popup-squawk-form").style.display = "none";
      }}></div>
      <div className="popup" id="popup-squawk-form">
      <form
      className="squawk-form"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!squawkContent) {return}
          const { squawk } = await createSquawk(squawkContent, squawkPicture, token);
          setSquawks([squawk, ...squawks]);
          setSquawkContent("");
          setSquawkPicture("")
        }}
      >
        <div className="squawk-form-top">
        <div className="post__avatar">
                <img src={user?.profilePicture} alt="" />
              </div>
        <input
          value={squawkContent}
          className="squawk-input"
          placeholder="What's happening?"
          onChange={(event) => setSquawkContent(event.target.value)}
        ></input>
        </div>
        <div className="squawk-controls">
          <label className="squawk-file">
        <input
            name="squawkPicture"
            type="file"
            accept="image/*"
            id="squawkPic"
            onChange={(event) => {
              const [file] = squawkPic.files
              setSquawkPicture(URL.createObjectURL(file))
            }}
          ></input>
          <svg className="squawk-pic-icon" viewBox="0 0 20 20">
              <g>
              <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
              </g>
            </svg>
          </label>
        <span className={squawkContent ? "squawk-button enabled-squawk" : "squawk-button disabled"}
        onClick={async (event) => {
          event.preventDefault();
          if (!squawkContent) {return}
          const { squawk } = await createSquawk(squawkContent, squawkPicture, token);
          setSquawks([squawk, ...squawks]);
          setSquawkContent("");
          setSquawkPicture("")
        }}>
          Squawk
        </span>
        </div>
      </form>
      </div>
      <div className="popup" id="myForm">
        <form className="nav-form">
          <div className="popup-head">
            <div className="close" onClick={closeForm}>
              &times;
            </div>
          </div>
          {registering ? (
            <h1>Join Parroty today</h1>
          ) : (
            <h1>Sign in to Parroty</h1>
          )}
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
            <>
              <div
                class="submit"
                onClick={(event) => {
                  event.preventDefault();
                  registering ? registeringUser() : loggingIn();
                  setUsername("");
                  setPassword("");
                }}
              >
                Register
              </div>
              <h4>
                Have an account already?{" "}
                <span
                  class="pop-switch"
                  onClick={() => {
                    setRegistering(false);
                  }}
                >
                  Login Here!
                </span>
              </h4>
            </>
          ) : (
            <>
              <div
                className="submit"
                onClick={(event) => {
                  event.preventDefault();
                  registering ? registeringUser() : loggingIn();
                  setUsername("");
                  setPassword("");
                }}
              >
                Login
              </div>
              <h4>
                Don't have an account?{" "}
                <span
                  className="pop-switch"
                  onClick={() => {
                    setRegistering(true);
                  }}
                >
                  Register Here!
                </span>
              </h4>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default Sidenav;
