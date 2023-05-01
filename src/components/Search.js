import React, { useEffect, useState } from "react";
import { getSquawks, getUsers } from "../axios-services";
import { useNavigate, useParams } from "react-router-dom";
const timeAgo = require("node-time-ago");

const Search = ({ squawks, setSquawks, users, setUsers }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [squawkSearch, setSquawkSearch] = useState(true);
  const { searchTerm } = useParams();

  useEffect(() => {
    const getParrotySquawks = async () => {
      const squawks = await getSquawks();
      squawks.reverse();
      const filter = squawks.filter((squawk) => {
        const ref = searchTerm.toLowerCase();
        const squawkText = squawk.squawkContent.toLowerCase();
        const username = squawk.author.username.toLowerCase();
        const name = squawk.author.name.toLowerCase();
        return (
          squawkText.includes(ref) ||
          username.includes(ref) ||
          name.includes(ref)
        );
      });
      setSquawks(filter);
    };
    getParrotySquawks();

    const getParrotyUsers = async () => {
      const parrotyUsers = await getUsers();
      const filter = parrotyUsers.filter((user) => {
        const ref = searchTerm.toLowerCase();
        const username = user.username.toLowerCase();
        const name = user.name.toLowerCase();
        return username.includes(ref) || name.includes(ref);
      });
      setUsers(filter);
    };
    getParrotyUsers();
  }, []);

  return (
    <div className="app-container">
      <h1>Search</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          navigate(`/search/${searchText}`);
          const parrotyUsers = await getUsers();
          const filter1 = parrotyUsers.filter((user) => {
            const ref = searchText.toLowerCase();
            const username = user.username.toLowerCase();
            const name = user.name.toLowerCase();
            return username.includes(ref) || name.includes(ref);
          });
          setUsers(filter1);
          const squawks = await getSquawks();
          squawks.reverse();
          const filter = squawks.filter((squawk) => {
            const ref = searchText.toLowerCase();
            const squawkText = squawk.squawkContent.toLowerCase();
            const username = squawk.author.username.toLowerCase();
            const name = squawk.author.name.toLowerCase();
            return (
              squawkText.includes(ref) ||
              username.includes(ref) ||
              name.includes(ref)
            );
          });
          setSquawks(filter);
        }}
      >
        <input
          placeholder="Search Parroty"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        ></input>
      </form>
      <div className="search-options">
        <div
          className={`search-option ${squawkSearch ? "active-option" : " "}`}
          onClick={() => {
            setSquawkSearch(true);
          }}
        >
          <div>Latest</div>
          {squawkSearch ? <div className="active-option-strip"></div> : null}
        </div>
        <div
          className={`search-option ${squawkSearch ? " " : "active-option"}`}
          onClick={() => {
            setSquawkSearch(false);
          }}
        >
          <div>Users</div>
          {squawkSearch ? null : <div className="active-option-strip"></div>}
        </div>
      </div>
      {squawkSearch ? (
        squawks.length ? (
          squawks.map((squawk) => {
            return (
              <div
                className="post"
                key={`${squawk.id}`}
                onClick={() => {
                  navigate(`/${squawk.author.username}/${squawk.id}`);
                }}
              >
                  <img className="post__avatar" src={squawk.author.profilePicture} alt="" />

                <div className="post__body">
                  <div className="post__header">
                    <div className="post__headerText">
                      <h3>
                        {squawk.author.name}
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
                    <span>
                      <span>
                        <svg className="post-footer-icon" viewBox="0 0 25 25">
                          <g>
                            <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
                          </g>
                        </svg>{" "}
                        {squawk.parrots?.length}
                      </span>
                    </span>
                    <span className="material-icons">
                      <span>
                        <svg className="post-footer-icon" viewBox="0 0 25 25">
                          <g>
                            <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                          </g>
                        </svg>
                        {squawk.likes?.length}
                      </span>
                    </span>
                    <span className="material-icons">
                      <span>
                        <svg className="post-footer-icon" viewBox="0 0 25 25">
                          <g>
                            <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
                          </g>
                        </svg>
                        {squawk.comments?.length}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <h1>No results for "{searchTerm}"</h1>
        )
      ) : users?.length ? (
        users.map((user) => {
          return (
            <div id={user.id}
              className="user-result"
              onClick={() => {
                navigate(`/${user.username}`);
              }}
            >
                <img className="post__avatar" src={user?.profilePicture} alt="" />
              <div className="user-info">
                <strong>{user.name}</strong>{" "}
                <div className="username-result">@{user.username}</div>
                <div>{user.bio}</div>
              </div>
            </div>
          );
        })
      ) : (
        <h1>No results for "{searchTerm}"</h1>
      )}
    </div>
  );
};

export default Search;
