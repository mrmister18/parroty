import React, { useEffect, useState } from "react";
import { getSquawks, getProfile, follow, unfollow } from '../axios-services';
import { useParams, useNavigate } from 'react-router-dom'

const Profile = ({squawks, setSquawks, user, token}) => {

const { username } = useParams();
const [profile, setProfile] = useState({})
const navigate = useNavigate();

    useEffect(() => {
      const getViewingProfile = async () => {
        const data = await getProfile(username)
        setProfile(data)
      }

      getViewingProfile()
      
        const getProfileSquawks = async () => {
            const squawks = await getSquawks()
            const profileSquawks = squawks.filter((squawk) => squawk.author.username === username)
            setSquawks(profileSquawks)
          };
          getProfileSquawks()
          
    }, [])
    return <>
    <div>
    <img src={`${profile.profilePicture}`}></img>
    <div>{profile.name}</div>
    <div>@{profile.username}</div>
    <div>{profile.bio}</div>
    <div>{profile.following?.length} Following {profile.followers?.length} Followers</div>
    {user.username === username ? <button>Edit Profile</button> : <><button>Message</button> {user?.following.find(person => person.userId === profile.id) ? <button onClick={async () => {await unfollow(profile.id, token)}}>Unfollow</button> : <button onClick={async () => {await follow(profile.id, token)}}>Follow</button>}</>}
    </div>
    <div className="app-container">
      {squawks.map((squawk) =>{
        return <>
        <div className="post" key={squawk.id} onClick={() => {navigate(`/${squawk.author.username}/${squawk.id}`)}}>
        <div className="post__avatar">
          <img
            src={squawk.author.profilePicture}
            alt=""
          />
        </div>

        <div className="post__body">
          <div className="post__header">
            <div className="post__headerText">
              <h3>
                {squawk.author.name}
                <span className="post__headerSpecial"
                  ><span className="material-icons post__badge"> </span>@{squawk.author.username}</span
                >
              </h3>
            </div>
            <div className="post__headerDescription">
              <p>{squawk.squawkContent}</p>
            </div>
          </div>
          <img
            src={squawk.picture ? squawk.picture: null}
            alt=""
          />
          <div className="post__footer">
            <span className="material-icons"> Parrots: {squawk.parrots.length} </span>
            <span className="material-icons"> Likes: {squawk.likes.length} </span>
            <span className="material-icons"> Comments: {squawk.comments.length} </span>
          </div>
        </div>
      </div>
        </>
      })}
    </div></>
}

export default Profile;