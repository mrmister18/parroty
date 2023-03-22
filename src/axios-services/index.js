import axios from "axios";
const baseurl = "http://localhost:4000/api/";

// this file holds your frontend network request adapters
// think about each function as a service that provides data
// to your React UI through AJAX calls

// for example, if we need to display a list of users
// we'd probably want to define a getUsers service like this:

export async function getUsers() {
  try {
    const { data } = await axios.get("/api/users");
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function getProfile(username) {
  try {
    const { data } = await axios.get(`/api/users/${username}`);
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function getSquawks() {
  try {
    const { data } = await axios.get("/api/squawks");
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function getAPIHealth() {
  try {
    const { data } = await axios.get("/api/health");
    return data;
  } catch (err) {
    console.error(err);
    return { healthy: false };
  }
}

export async function registerNewUser({ username, password, name }) {
  try {
    const { data } = await axios.post(
      baseurl + "users/register",
      {
        username,
        password,
        name,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    document.getElementById("myForm").style.display = "none";
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function userLogin({ username, password }) {
  try {
    const { data } = await axios.post(
      baseurl + "users/login",
      {
        username,
        password,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    document.getElementById("myForm").style.display = "none";
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUser(token) {
  try {
    const { data } = await axios.post(
      baseurl + "users/me",
      null,
      {
        headers: { "Content-Type": "application/json",
        'Authorization': `Bearer ${token}` },
      }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function sendMessage(messageContent, recipientId, token) {
  try {
    const { data } = await axios.post(
      baseurl + `messages/${recipientId}`,
      {messageContent},
      {
        headers: { "Content-Type": "application/json",
        'Authorization': `Bearer ${token}` },
      }
    )
    return data
  } catch (error) {
    console.log(error)
  }
}

export async function follow(userId, token) {
  try {
    const {data} = await axios.post(
      baseurl + `users/${userId}/follow`,
      null,
      {
        headers: { "Content-Type": "application/json",
        'Authorization': `Bearer ${token}` },
      }
    )
    return data
  } catch (error) {
    console.log(error)
  }
}

export async function unfollow(userId, token) {
  try {
    await axios.delete(
      baseurl + `users/${userId}/follow`,
      {
        headers: { "Content-Type": "application/json",
        'Authorization': `Bearer ${token}` },
      }
    )
  } catch (error) {
    console.log(error)
  }
}