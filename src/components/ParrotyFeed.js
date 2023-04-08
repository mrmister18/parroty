import React, { useEffect, useState } from "react";
import { getSquawks } from "../axios-services";
import { useNavigate } from "react-router-dom";
const timeAgo = require("node-time-ago");

const ParrotyFeed = ({ squawks, setSquawks }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const getParrotySquawks = async () => {
      const squawks = await getSquawks();
      squawks.reverse();
      setSquawks(squawks);
    };
    getParrotySquawks();
  }, []);

  return (
    <div className="app-container">
      <h1>Explore</h1>
      <form
        onSubmit={() => {
          navigate(`/search/${searchText}`);
        }}
      >
        <input
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        ></input>
        <button type="submit" disabled={searchText ? false : true}>
          Search
        </button>
      </form>
      <div className="post-list">
        {squawks.map((squawk) => {
          return (
            <div
              className="post"
              key={`${squawk.id}`}
              onClick={() => {
                navigate(`/${squawk.author.username}/${squawk.id}`);
              }}
            >
              <div className="post__avatar">
                <img src={squawk.author.profilePicture} alt="" />
              </div>

              <div className="post__body">
                <div className="post__header">
                  <div className="post__headerText">
                    <h3>
                      {squawk.author.name}
                      <span className="post__headerSpecial">
                        <span className="material-icons post__badge"> </span>@
                        {squawk.author.username}
                      </span>
                      <span> {timeAgo(squawk.createdAt, "twitter")}</span>
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
                    Parrots: {squawk.parrots.length}{" "}
                  </span>
                  <span className="material-icons">
                    {" "}
                    Likes: {squawk.likes.length}{" "}
                  </span>
                  <span className="material-icons">
                    {" "}
                    Comments: {squawk.comments.length}{" "}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParrotyFeed;
