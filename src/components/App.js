import React, { useState, useEffect } from 'react';
// getAPIHealth is defined in our axios-services directory index.js
// you can think of that directory as a collection of api adapters
// where each adapter fetches specific info from our express server's /api route
import { getAPIHealth, getUsers, getSquawks } from '../axios-services';
import '../style/App.css';

const App = () => {
  const [APIHealth, setAPIHealth] = useState('');
  const [users, setUsers] = useState([]);
  const [squawks, setSquawks] = useState([]);

  useEffect(() => {
    // follow this pattern inside your useEffect calls:
    // first, create an async function that will wrap your axios service adapter
    // invoke the adapter, await the response, and set the data
    const getAPIStatus = async () => {
      const { healthy } = await getAPIHealth();
      setAPIHealth(healthy ? 'api is up! :D' : 'api is down :/');
    };
    // second, after you've defined your getter above
    // invoke it immediately after its declaration, inside the useEffect callback
    getAPIStatus();

    const getParrotyUsers = async () => {
      const users = await getUsers();
      setUsers(users)
    };
    getParrotyUsers()

    const getParrotySquawks = async () => {
      const squawks = await getSquawks()
      setSquawks(squawks)
    };
    getParrotySquawks()
  }, []);

  return (
    <div className="app-container">
      <h1>Hello, World!</h1>
      <p>API Status: {APIHealth}</p>
      {squawks.map((squawk) =>{
        return <>
        <div class="post">
        <div class="post__avatar">
          <img
            src={squawk.author.profilePicture}
            alt=""
          />
        </div>

        <div class="post__body">
          <div class="post__header">
            <div class="post__headerText">
              <h3>
                {squawk.author.name}
                <span class="post__headerSpecial"
                  ><span class="material-icons post__badge"> verified </span>@{squawk.author.username}</span
                >
              </h3>
            </div>
            <div class="post__headerDescription">
              <p>{squawk.squawkContent}</p>
            </div>
          </div>
          <img
            src="https://www.focus2move.com/wp-content/uploads/2020/01/Tesla-Roadster-2020-1024-03.jpg"
            alt=""
          />
          <div class="post__footer">
            <span class="material-icons"> Parrots: {squawk.parrots.length} </span>
            <span class="material-icons"> Likes: {squawk.likes.length} </span>
            <span class="material-icons"> Comments: {squawk.comments.length} </span>
          </div>
        </div>
      </div>
        </>
      })}
    </div>
  );
};

export default App;
