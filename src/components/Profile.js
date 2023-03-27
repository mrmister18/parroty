import React, { useEffect, useState } from "react";
import {
  getSquawks,
  getProfile,
  follow,
  unfollow,
  updateUser,
} from "../axios-services";
import { useParams, useNavigate } from "react-router-dom";

const Profile = ({ squawks, setSquawks, user, token, setUser }) => {
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
      setSquawks(profileSquawks);
    };
    getProfileSquawks();
  }, []);
  return (
    <>
      <div>
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
            <button>Message</button>{" "}
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
                      <h3>
                        {squawk.author.name}
                        <span className="post__headerSpecial">
                          <span className="material-icons post__badge"> </span>@
                          {squawk.author.username}
                        </span>
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
            placeholder="Profile Picture"
            value={profilePicture}
            onChange={(event) => {
              setProfilePicture(event.target.value);
            }}
          ></input>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={closeForm}>
            Close
          </button>
        </form>
      </div>
    </>
  );
};

export default Profile;
