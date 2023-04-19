import React, { useEffect, useState } from "react";
import {
  getSquawks,
  getProfile,
  follow,
  unfollow,
  updateUser,
} from "../axios-services";
import { useParams, useNavigate } from "react-router-dom";
const timeAgo = require("node-time-ago");

const Profile = ({ squawks, setSquawks, user, token, setUser, setRecipient, setConversation }) => {
  const { username } = useParams();
  const [profile, setProfile] = useState({});
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const navigate = useNavigate();

  function closeForm() {
    document.getElementById("profileForm").style.display = "none";
  }

  function openForm() {
    document.getElementById("profileForm").style.display = "block";
  }

  async function updateUserProfile() {
    const data = await updateUser({
      name,
      bio,
      profilePicture,
      token,
      userId: user.id,
    });
    setProfile(data.updatedUser);
    setUser(data.updatedUser);
  }

  function messageUser() {
    let messageRecipient = user.messages.find(message => message.username === username)
    if (messageRecipient) {
      setRecipient(messageRecipient)
      setConversation(messageRecipient.conversation)
    } else {setRecipient({username: profile.username,
    name: profile.name,
    profilePicture: profile.profilePicture,
  userId: profile.id,
conversation: []})
setConversation([])}
navigate("/messages")
  }

  useEffect(() => {
    const getViewingProfile = async () => {
      const data = await getProfile(username);
      setProfile(data);
    };

    getViewingProfile();

    const getProfileSquawks = async () => {
      const squawks = await getSquawks();
      const profileSquawks = squawks.filter(
        (squawk) => squawk.author.username === username
      );
      profileSquawks.reverse()
      setSquawks(profileSquawks);
    };
    getProfileSquawks();
  }, []);
  return (
    <>
      {profile.id ? <><div>
        <img src={`${profile.profilePicture}`}></img>
        <div>{profile.name}</div>
        <div>@{profile.username}</div>
        <div>{profile.bio}</div>
        <div>
          {profile.following?.length} Following {profile.followers?.length}{" "}
          Followers
        </div>
        {user.username === username ? (
          <button onClick={openForm}>Edit Profile</button>
        ) : (
          <>
            <button onClick={messageUser}>Message</button>{" "}
            {user.id && user?.following.find((person) => person.userId === profile.id) ? (
              <button
                onClick={async () => {
                  await unfollow(profile.id, token);
                  let userCopy = { ...user };
                  userCopy.following.splice(user?.following.findIndex((person) => person.userId === profile.id), 1);
                  setUser(userCopy);
                }}
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={async () => {
                  const { follower } = await follow(profile.id, token);
                  let userCopy = { ...user };
                  userCopy.following.push(follower);
                  setUser(userCopy);
                }}
              >
                Follow
              </button>
            )}
          </>
        )}
      </div>
      <div className="app-container">
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
                  <img src={squawk.author.profilePicture} alt="" />
                </div>

                <div className="post__body">
                  <div className="post__header">
                    <div className="post__headerText">
                      <h3
                      className="author-name">
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
                  <span><span>
                  <svg className="post-footer-icon" viewBox="0 0 25 25">
              <g>
              <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
              </g>
            </svg> {squawk.parrots?.length}</span>
                  </span>
                  <span className="material-icons">
                    <span>
                    <svg className="post-footer-icon" viewBox="0 0 25 25">
              <g>
              <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
              </g>
            </svg>
                      {squawk.likes?.length}</span>
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
            </>
          );
        })}
      </div>
      <div className="popup" id="profileForm">
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await updateUserProfile();
          }}
        >
          <h1>Edit Profile</h1>
          <label htmlFor="name">Name</label>
          <input
            name="name"
            placeholder="Name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            required
          ></input>
          <label htmlFor="bio">Bio</label>
          <input
            name="bio"
            placeholder="Bio"
            value={bio}
            onChange={(event) => {
              setBio(event.target.value);
            }}
          ></input>
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            name="profilePicture"
            type="file"
            accept="image/*"
            id="profileInput"
            onChange={(event) => {
              const [file] = profileInput.files
              setProfilePicture(URL.createObjectURL(file))
            }}
          ></input>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={closeForm}>
            Close
          </button>
        </form>
      </div></> : <h1>This account does not exist</h1>}
    </>
  );
};

export default Profile;
