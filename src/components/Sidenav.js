import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';

const Sidenav = ({token, baseurl, setToken, setUser}) => {
  const [registering, setRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  function closeForm () {
    document.getElementById("myForm").style.display = "none";
  }

  function openForm () {
    document.getElementById("myForm").style.display = "block";
  }

  async function registerNewUser() {
    try {
      const resp = await axios.post(baseurl + "users/register", {
        username, password, name
      },
      {
        headers: { "Content-Type": "application/json" },
      })
      const data = resp.data
      setToken(data.token)
      setUser(data.user)
    } catch (error) {
      console.log(error);
    }
  }

  async function userLogin() {
    try {
      const resp = await axios.post(baseurl + "users/login", {
        username, password
      },
      {
        headers: { "Content-Type": "application/json" },
      })
      const data = resp.data
      setToken(data.token)
      setUsername(data.user)
    } catch (error) {
      console.log(error);
    }
  }
    return <>
    <div className="sidenav">
  <Link to="/home">Home</Link>
  <Link to="/explore">Explore</Link>
  <Link to="/messages">Messages</Link>
  {token ? <button onClick={() => setToken("")}>Logout</button> : <><button onClick={() => {
    setRegistering(false)
    openForm()}}>Login</button><button onClick={() => {
      setRegistering(true)
    openForm()}}>Sign Up</button></>}
</div>
  <div className="popup" id="myForm">
  <form onSubmit={(event) => {event.preventDefault()
  registering ? registerNewUser() : userLogin()}}>
    {registering ? <h1>Register</h1> : <h1>Login</h1>}
    <label htmlFor="username">Username</label>
    <input name="username" placeholder="Username" onChange={(event) => {setUsername(event.target.value)}} required></input>
    <label htmlFor="password">Password</label>
    <input name="password" type={password} placeholder="Password" onChange={(event) => {setPassword(event.target.value)}} required></input>
    {registering ? <><label htmlFor="name">Name</label>
    <input name="name" placeholder="Name" onChange={(event) => {setName(event.target.value)}} required></input></> : null}
    {registering ? <button type="submit">Register</button> : <button type="submit">Login</button>}
    <button type="button" onClick={closeForm}>Close</button>
  </form>
  </div>
  </>
}

export default Sidenav