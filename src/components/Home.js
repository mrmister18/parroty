import React, {useEffect, useState} from "react"
import { createSquawk, getSquawks, getUser } from '../axios-services';
import { useNavigate } from "react-router-dom";

const Home = ({setSquawks, squawks, user, setUser, token}) => {
  const navigate = useNavigate();
  const [squawkContent, setSquawkContent] = useState("")

    useEffect(() => {
      const setUserProfile = async () => {
        const userProfile = await getUser(token)
  setUser(userProfile)
    }
    setUserProfile()

    const following = []
    for (let i = 0; i < user?.following?.length; i++) {
      following.push(user?.following[i]?.userId)
    }

        const getFeedSquawks = async () => {
            const homeSquawks = await getSquawks()
            const profileSquawks = homeSquawks.filter((squawk) => {return following.includes(squawk.userId) || squawk.userId === user.id} )
            setSquawks(profileSquawks)
          };
          getFeedSquawks()
    }, [])
    return <div className="app-container">
      <h1>Home</h1>
      <form onSubmit={async (event) => {
        event.preventDefault();
        const {squawk} = await createSquawk(squawkContent, token)
        setSquawks([...squawks, squawk])
        setSquawkContent("")
    }}>
        <input value={squawkContent} onChange={(event) => setSquawkContent(event.target.value)}></input><button type="submit" disabled={squawkContent ? false : true}>Squawk</button>
    </form>
    {squawks.map((squawk) =>{
      return <>
      <div className="post" key={squawk.id} onClick={() => {navigate(`/${squawk.author.username}/${squawk.id}`)}}>
      <div className="post__avatar">
        <img
          src={squawk.author?.profilePicture}
          alt=""
        />
      </div>

      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>
              {squawk.author?.name}
              <span className="post__headerSpecial"
                ><span className="material-icons post__badge"> </span>@{squawk.author?.username}</span
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
          <span className="material-icons"> Parrots: {squawk.parrots?.length} </span>
          <span className="material-icons"> Likes: {squawk.likes?.length} </span>
          <span className="material-icons"> Comments: {squawk.comments?.length} </span>
        </div>
      </div>
    </div>
      </>
    })}
  </div>
}

export default Home