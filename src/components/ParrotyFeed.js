import React, { useEffect, useState } from "react";
import { getSquawks } from '../axios-services';

const ParrotyFeed = () => {

    const [squawks, setSquawks] = useState([]);

    useEffect(() => {
        const getParrotySquawks = async () => {
            const squawks = await getSquawks()
            setSquawks(squawks)
          };
          getParrotySquawks()
    }, [])

    return <div className="app-container">
      {squawks.map((squawk) =>{
        return <>
        <div className="post" key={squawk.id}>
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
    </div>
}

export default ParrotyFeed;