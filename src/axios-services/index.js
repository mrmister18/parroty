import axios from "axios";
const baseurl = "https://parroty.onrender.com/";

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
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUser(token) {
  try {
    const { data } = await axios.post(baseurl + "users/me", null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function sendMessage(messageContent, recipientId, token) {
  try {
    const { data } = await axios.post(
      baseurl + `messages/${recipientId}`,
      { messageContent },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function follow(userId, token) {
  try {
    const { data } = await axios.post(
      baseurl + `users/${userId}/follow`,
      null,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function unfollow(userId, token) {
  try {
    await axios.delete(baseurl + `users/${userId}/follow`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser({ name, bio, profilePicture, userId, token }) {
  try {
    const { data } = await axios.patch(
      baseurl + `users/${userId}`,
      {
        name,
        bio,
        profilePicture,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    document.getElementById("profileForm").style.display = "none";
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function createSquawk(squawkContent, picture, token) {
  try {
    const { data } = await axios.post(
      baseurl + `squawks`,
      { squawkContent,
      picture },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function createComment(squawkId, commentContent, token) {
  try {
    const { data } = await axios.post(
      baseurl + `squawks/${squawkId}/comment`,
      { commentContent },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function createLike(squawkId, token) {
  try {
    const { data } = await axios.post(
      baseurl + `squawks/${squawkId}/like`,
      null,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function unlike(squawkId, token) {
  try {
    await axios.delete(baseurl + `squawks/${squawkId}/like`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function createParrot(squawkId, token) {
  try {
    const { data } = await axios.post(
      baseurl + `squawks/${squawkId}/parrot`,
      null,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function unparrot(squawkId, token) {
  try {
    await axios.delete(baseurl + `squawks/${squawkId}/parrot`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSquawk(squawkId, token) {
  try {
    await axios.delete(baseurl + `squawks/${squawkId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error);
  }
}