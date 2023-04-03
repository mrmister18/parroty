import React, { useEffect, useState } from "react";
import { getSquawks, getUsers } from "../axios-services";
import { useNavigate, useParams } from "react-router-dom";
const timeAgo = require("node-time-ago");

const Search = ({squawks, setSquawks, users, setUsers}) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("")
  const [squawkSearch, setSquawkSearch] = useState(true)
  const { searchTerm } = useParams()

  useEffect(() => {
    const getParrotySquawks = async () => {
      const squawks = await getSquawks();
      squawks.reverse()
      const filter = squawks.filter((squawk) => {
        const ref = searchTerm.toLowerCase()
        const squawkText = squawk.squawkContent.toLowerCase()
        const username = squawk.author.username.toLowerCase()
        const name = squawk.author.name.toLowerCase()
        return squawkText.includes(ref) || username.includes(ref) || name.includes(ref)})
      setSquawks(filter);
    };
    getParrotySquawks();

    const getParrotyUsers = async () => {
        const parrotyUsers = await getUsers();
        const filter = parrotyUsers.filter((user) => {
          const ref = searchTerm.toLowerCase()
          const username = user.username.toLowerCase()
          const name = user.name.toLowerCase()
          return username.includes(ref) || name.includes(ref)})
        setUsers(filter);
      };
      getParrotyUsers();
  }, []);

  return (
    <div className="app-container">
      <h1>Search</h1>
      <form onSubmit={() => {navigate(`/search/${searchText}`)}}>
      <input value={searchText} onChange={(event) => setSearchText(event.target.value)}></input>
      <button type="submit" disabled={searchText ? false : true}>Search</button>
      </form>
      <button onClick={() => {setSquawkSearch(true)}}>Latest</button><button onClick={() => {setSquawkSearch(false)}}>Users</button>
      {squawkSearch ? squawks.map((squawk) => {
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
                    <span> {timeAgo(squawk.createdAt, 'twitter')}</span>
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
      }) : users.map((user) => {
        return <div onClick={() => {navigate(`/${user.username}`)}}>
          {user.name} @{user.username}
          <div>{user.bio}</div>
        </div>
      })}
    </div>
  );
};

export default Search;