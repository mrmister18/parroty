import React, { useEffect, useState } from "react";
import { createSquawk, getSquawks, getUser } from "../axios-services";
import { useNavigate } from "react-router-dom";

const Home = ({ setSquawks, squawks, user, setUser, token }) => {
  const navigate = useNavigate();
  const [squawkContent, setSquawkContent] = useState("");
  const [squawkPicture, setSquawkPicture] = useState("");
  const timeAgo = require("node-time-ago");

  useEffect(() => {
    const setUserProfile = async () => {
      const userProfile = await getUser(token);
      setUser(userProfile);
    };
    setUserProfile();

    const following = [];
    for (let i = 0; i < user?.following?.length; i++) {
      following.push(user?.following[i]?.userId);
    }

    const getFeedSquawks = async () => {
      const homeSquawks = await getSquawks();
      const profileSquawks = homeSquawks.filter((squawk) => {
        return following.includes(squawk.userId) || squawk.userId === user.id;
      });
      profileSquawks.reverse()
      setSquawks(profileSquawks);
    };
    getFeedSquawks();
  }, []);
  return (
    <div className="app-container">
      <h1 className="title">Home</h1>
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
      {squawks.map((squawk) => {
        return (
          <>
            <div
              className="post"
              key={squawk.id}
              onClick={() => {
                navigate(`/${squawk.author.username}/${squawk.id}`);
              }}
            >
              <div className="post__avatar">
                <img src={squawk.author?.profilePicture} alt="" />
              </div>

              <div className="post__body">
                <div className="post__header">
                  <div className="post__headerText">
                    <h3
                    className="author-name">
                      {squawk.author?.name}
                      <span className="post__headerSpecial">
                        <span className="material-icons post__badge"> </span>@
                        {squawk.author.username} · {timeAgo(squawk.createdAt, "twitter")}</span>
                    </h3>
                  </div>
                  <div className="post__headerDescription">
                    <p>{squawk.squawkContent}</p>
                  </div>
                </div>
                <img src={squawk.picture ? squawk.picture : null} alt="" />
                <div className="post__footer">
                  <span className="material-icons">
                    {" "}
                    Parrots: {squawk.parrots?.length}{" "}
                  </span>
                  <span className="material-icons">
                    {" "}
                    Likes: {squawk.likes?.length}{" "}
                  </span>
                  <span className="material-icons">
                    {" "}
                    Comments: {squawk.comments?.length}{" "}
                  </span>
                </div>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default Home;
