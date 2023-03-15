import React, { useEffect, useState } from "react";
import { getSquawks } from '../axios-services';
import { useParams } from 'react-router-dom'

const Squawk = () => {
const [squawk, setSquawk] = useState({})
const {squawkId} = useParams();

    useEffect(() => {
        const fetchSquawk = async () => {
            const squawks = await getSquawks()
            const singleSquawk = squawks.find(squawk => squawk.id === Number(squawkId))
      setSquawk(singleSquawk)
        }
        fetchSquawk()
    }, [])
console.log(squawk)
    return <div className="post" key={`${squawk.id}`}>
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
          </div>
        </div>
        <div>
            <p>Comments:</p>
            {squawk.comments?.length ? squawk?.comments.map((comment) => {
                return <div>{comment.commentContent}</div>
            }) : null}
        </div>
      </div>
}

export default Squawk;