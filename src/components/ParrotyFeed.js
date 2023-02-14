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
        <div class="post" key={squawk.id}>
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
                  ><span class="material-icons post__badge"> </span>@{squawk.author.username}</span
                >
              </h3>
            </div>
            <div class="post__headerDescription">
              <p>{squawk.squawkContent}</p>
            </div>
          </div>
          <img
            src={squawk.picture ? squawk.picture: null}
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
}

export default ParrotyFeed;