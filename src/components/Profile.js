import React, { useEffect, useState } from "react";
import {
  getSquawks,
  getProfile,
  follow,
  unfollow,
  updateUser,
  createLike,
  unlike,
  createParrot,
  unparrot
} from "../axios-services";
import { useParams, useNavigate } from "react-router-dom";
const timeAgo = require("node-time-ago");

const Profile = ({
  squawks,
  setSquawks,
  user,
  token,
  setUser,
  setRecipient,
  setConversation,
  setActiveNav,
}) => {
  const { username } = useParams();
  const [profile, setProfile] = useState({});
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const navigate = useNavigate();

  function closeForm() {
    document.getElementById("profileForm").style.display = "none";
    document.getElementById("background").style.display = "none";
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
    let messageRecipient = user.messages.find(
      (message) => message.username === username
    );
    if (messageRecipient) {
      setRecipient(messageRecipient);
      setConversation(messageRecipient.conversation);
    } else {
      setRecipient({
        username: profile.username,
        name: profile.name,
        profilePicture: profile.profilePicture,
        userId: profile.id,
        conversation: [],
      });
      setConversation([]);
    }
    navigate("/messages");
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
      profileSquawks.reverse();
      setSquawks(profileSquawks);
    };
    getProfileSquawks();
  }, []);

  function openForm() {
    document.getElementById("profileForm").style.display = "block";
    document.getElementById("background").style.display = "block";
    setBio(profile.bio);
    setName(profile.name);
    setProfilePicture(profile.profilePicture);
  }

  if (user.username === username) {
    setActiveNav("Profile");
  }
  return (
    <>
      {profile.id ? (
        <>
          <div>
            <div className="profile-head">
              <img
                className="profile-page-picture"
                src={`${profile.profilePicture}`}
              ></img>
              {user.username === username ? (
                <div className="profile-button" onClick={openForm}>
                  Edit Profile
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <span
                    className="profile-message-button"
                    onClick={messageUser}
                  >
                    <svg viewBox="-5 -5 35 35" aria-hidden="true">
                      <g>
                        <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
                      </g>
                    </svg>
                  </span>{" "}
                  {user.id &&
                  user?.following.find(
                    (person) => person.userId === profile.id
                  ) ? (
                    <span
                      className="profile-button"
                      onClick={async () => {
                        await unfollow(profile.id, token);
                        let userCopy = { ...user };
                        userCopy.following.splice(
                          user?.following.findIndex(
                            (person) => person.userId === profile.id
                          ),
                          1
                        );
                        setUser(userCopy);
                      }}
                    >
                      Following
                    </span>
                  ) : (
                    <span
                      className="profile-button"
                      onClick={async () => {
                        const { follower } = await follow(profile.id, token);
                        let userCopy = { ...user };
                        userCopy.following.push(follower);
                        setUser(userCopy);
                      }}
                    >
                      Follow
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="title">
              <strong>{profile.name}</strong>
            </div>
            <div className="recipient-username">@{profile.username}</div>
            <div>{profile.bio}</div>
            <div>
              <strong>{profile.following?.length}</strong>{" "}
              <span className="username-result">Following</span>{" "}
              <strong>{profile.followers?.length}</strong>{" "}
              <span className="username-result">Followers</span>
            </div>
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
                    <img
                      className="post__avatar"
                      src={squawk.author.profilePicture}
                      alt=""
                    />

                    <div className="post__body">
                      <div className="post__header">
                        <div className="post__headerText">
                          <h3 className="author-name">
                            {squawk.author.name}
                            <span className="post__headerSpecial">
                              <span className="material-icons post__badge">
                                {" "}
                              </span>
                              @{squawk.author.username} ·{" "}
                              {timeAgo(squawk.createdAt, "twitter")}
                            </span>
                          </h3>
                        </div>
                        <div className="post__headerDescription">
                          <p>{squawk.squawkContent}</p>
                        </div>
                      </div>
                      <img
                        src={squawk.picture ? squawk.picture : null}
                        alt=""
                      />
                      <div className="post__footer">
                        <span>
                        {squawk.id &&
                    squawk?.parrots.find(
                      (person) => person.userId === user.id
                    ) ? (
                      <span
                        className="squawk-parrots"
                        style={{ color: "rgb(4, 187, 126)" }}
                        onClick={async (e) => {
                          if (!e) var e = window.event;
                          e.cancelBubble = true;
                          if (e.stopPropagation) e.stopPropagation();
                          await unparrot(squawk.id, token);
                          let squawksCopy = [...squawks];
                          let squawkIdx = squawksCopy.findIndex(
                            (squawkQuery) => squawkQuery.id === squawk.id
                          );
                          squawksCopy[squawkIdx].parrots.splice(
                            squawk?.parrots.findIndex(
                              (person) => person.userId === user.id
                            ),
                            1
                          );
                          setSquawks(squawksCopy);
                        }}
                      >
                        <svg
                          className="post-footer-icon parroted-icon"
                          viewBox="0 0 25 25"
                        >
                          <g>
                            <path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"></path>
                          </g>
                        </svg>{" "}
                        <span style={{ paddingTop: "2px" }}>
                          {squawk.parrots?.length}
                        </span>
                      </span>
                    ) : (
                      <span
                        className="squawk-parrots"
                        onClick={async (e) => {
                          if (!e) var e = window.event;
                          e.cancelBubble = true;
                          if (e.stopPropagation) e.stopPropagation();
                          if (!token) {
                            document.getElementById("myForm").style.display =
                              "flex";
                            document.getElementById(
                              "background"
                            ).style.display = "flex";
                          } else {
                            const { parrot } = await createParrot(
                              squawk.id,
                              token
                            );
                            let squawksCopy = [...squawks];
                            let squawkIdx = squawksCopy.findIndex(
                              (squawkQuery) => squawkQuery.id === squawk.id
                            );
                            squawksCopy[squawkIdx].parrots.push(parrot);
                            setSquawks(squawksCopy);
                          }
                        }}
                      >
                        <svg
                          className="post-footer-icon not-parroted-icon"
                          viewBox="0 0 25 25"
                        >
                          <g>
                            <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
                          </g>
                        </svg>{" "}
                        <span style={{ paddingTop: "2px" }}>
                          {squawk.parrots?.length}
                        </span>
                      </span>
                    )}
                        </span>
                        {squawk.id &&
                    squawk?.likes.find(
                      (person) => person.userId === user.id
                    ) ? (
                      <span
                        className="squawk-likes"
                        style={{ color: "rgb(249, 24, 128)" }}
                        onClick={async (e) => {
                          if (!e) var e = window.event;
                          e.cancelBubble = true;
                          if (e.stopPropagation) e.stopPropagation();
                          await unlike(squawk.id, token);
                          let squawksCopy = [...squawks];
                          let squawkIdx = squawksCopy.findIndex(
                            (squawkQuery) => squawkQuery.id === squawk.id
                          );
                          squawksCopy[squawkIdx].likes.splice(
                            squawk?.parrots.findIndex(
                              (person) => person.userId === user.id
                            ),
                            1
                          );
                          setSquawks(squawksCopy);
                        }}
                      >
                        <svg
                          className="post-footer-icon liked-icon"
                          viewBox="0 0 25 25"
                        >
                          <g>
                            <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                          </g>
                        </svg>
                        <span style={{ paddingTop: "2px" }}>
                          {squawk.likes?.length}
                        </span>
                      </span>
                    ) : (
                      <span
                        className="squawk-likes"
                        onClick={async (e) => {
                          if (!e) var e = window.event;
                          e.cancelBubble = true;
                          if (e.stopPropagation) e.stopPropagation();
                          if (!token) {
                            document.getElementById("myForm").style.display =
                              "flex";
                            document.getElementById(
                              "background"
                            ).style.display = "flex";
                          } else {
                            const { like } = await createLike(squawk.id, token);
                            let squawksCopy = [...squawks];
                            let squawkIdx = squawksCopy.findIndex(
                              (squawkQuery) => squawkQuery.id === squawk.id
                            );
                            squawksCopy[squawkIdx].likes.push(like);
                            setSquawks(squawksCopy);
                          }
                        }}
                      >
                        <svg
                          className="post-footer-icon not-liked-icon"
                          viewBox="0 0 25 25"
                        >
                          <g>
                            <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                          </g>
                        </svg>
                        <span style={{ paddingTop: "2px" }}>
                          {squawk.likes?.length}
                        </span>
                      </span>
                    )}
                        <span className="material-icons">
                        <span
                      className="squawk-comments"
                      onClick={async (e) => {
                        if (!e) var e = window.event;
                        e.cancelBubble = true;
                        if (e.stopPropagation) e.stopPropagation();
                        if (!token) {
                          document.getElementById("myForm").style.display =
                            "flex";
                          document.getElementById("background").style.display =
                            "flex";
                        } else {
                          navigate(`/${squawk.author.username}/${squawk.id}`);
                        }
                      }}
                    >
                      <svg
                        className="post-footer-icon squawk-comment-icon"
                        viewBox="0 0 25 25"
                      >
                        <g>
                          <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
                        </g>
                      </svg>
                      {squawk.comments?.length}
                    </span>
                        </span>
                      </div>
                    </div>
                    <div className="delete">
                {squawk.author.userId === user.id ? (
                  <svg
                    className="delete-icon"
                    viewBox="-4 -3 33 33"
                    aria-hidden="true"
                    onClick={async (e) => {
                      if (!e) var e = window.event;
                        e.cancelBubble = true;
                        if (e.stopPropagation) e.stopPropagation();
                      await deleteSquawk(squawk.id, token)
                      let squawksCopy = [...squawks];
                          let squawkIdx = squawksCopy.findIndex(
                            (squawkQuery) => squawkQuery.id === squawk.id
                          );
                          squawksCopy.splice(
                            squawkIdx,
                            1
                          );
                          setSquawks(squawksCopy);
                    }}
                  >
                    <g>
                      <path d="M16 6V4.5C16 3.12 14.88 2 13.5 2h-3C9.11 2 8 3.12 8 4.5V6H3v2h1.06l.81 11.21C4.98 20.78 6.28 22 7.86 22h8.27c1.58 0 2.88-1.22 3-2.79L19.93 8H21V6h-5zm-6-1.5c0-.28.22-.5.5-.5h3c.27 0 .5.22.5.5V6h-4V4.5zm7.13 14.57c-.04.52-.47.93-1 .93H7.86c-.53 0-.96-.41-1-.93L6.07 8h11.85l-.79 11.07zM9 17v-6h2v6H9zm4 0v-6h2v6h-2z"></path>
                    </g>
                  </svg>
                ) : null}
              </div>
                  </div>
                </>
              );
            })}
          </div>
          <div className="popup popup-squawk" id="profileForm">
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                await updateUserProfile();
                closeForm()
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="close" onClick={closeForm}>
                  <svg viewBox="-5 -5 35 35" aria-hidden="true">
                    <g>
                      <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                    </g>
                  </svg>
                </div>
                <h1>Edit Profile</h1>
                <button className="profile-button" type="submit">
                  Save
                </button>
              </div>
              <label htmlFor="name">Name</label>
              <input
                className="profile-input"
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
                className="profile-input"
                name="bio"
                placeholder="Bio"
                value={bio}
                onChange={(event) => {
                  setBio(event.target.value);
                }}
              ></input>
              <label className="squawk-file">
                <input
                  name="squawkPicture"
                  type="file"
                  accept="image/*"
                  id="profilePic"
                  onChange={(event) => {
                    const [file] = profilePic.files;
                    setProfilePicture(URL.createObjectURL(file));
                  }}
                ></input>
                <svg className="squawk-pic-icon" viewBox="0 0 20 20">
                  <g>
                    <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                  </g>
                </svg>
              </label>
            </form>
          </div>
        </>
      ) : (
        <h1>This account does not exist</h1>
      )}
    </>
  );
};

export default Profile;
