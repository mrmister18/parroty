import React, { useEffect, useState } from "react";
import { getSquawks, createComment, createLike, unlike, createParrot, unparrot } from "../axios-services";
import { useParams, useNavigate } from "react-router-dom";

const Squawk = ({ token, user }) => {
  const [squawk, setSquawk] = useState({});
  const [commentContent, setCommentContent] = useState("");
  const { squawkId, username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSquawk = async () => {
      const squawks = await getSquawks();
      const singleSquawk = squawks.find(
        (squawk) => squawk.id === Number(squawkId)
      );
      setSquawk(singleSquawk);
    };
    fetchSquawk();
  }, []);
  return (<>
  <h1>Squawk</h1>
    {squawk?.id && squawk.author.username === username ? <div key={`${squawk.id}`}>
      <div className="post__avatar">
        <img src={squawk.author?.profilePicture} alt="" />
      </div>

      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3
              onClick={() => {
                navigate(`/${squawk.author.username}`);
              }}
            >
              {squawk.author?.name}
              <span className="post__headerSpecial">
                <span className="material-icons post__badge"> </span>@
                {squawk.author?.username}
              </span>
            </h3>
          </div>
          <div className="post__headerDescription">
            <p>{squawk.squawkContent}</p>
          </div>
          <div>{squawk.postedAt}</div>
        </div>
        <img src={squawk.picture ? squawk.picture : null} alt="" />
        <div className="post__footer">
          <span className="material-icons">
            {" "}
            Parrots: {squawk.parrots?.length}{" "}
          </span>
          <span className="material-icons">
            {" "}
            Likes: {squawk.likes?.length}{" "}
          </span>
        </div>
      </div>
      {squawk.id && squawk?.likes.find((person) => person.userId === user.id) ? (
              <button
                onClick={async () => {
                  await unlike(squawk.id, token);
                  let squawkCopy = { ...squawk };
                  squawkCopy.likes.splice(squawk?.likes.findIndex((person) => person.userId === user.id), 1);
                  setSquawk(squawkCopy);
                }}
              >
                Unlike
              </button>
            ) : (
              <button
                onClick={async () => {
                  const { like } = await createLike(squawk.id, token);
                  let squawkCopy = { ...squawk };
                  squawkCopy.likes.push(like);
                  setSquawk(squawkCopy);
                }}
              >
                Like
              </button>
            )}
            {squawk.id && squawk?.parrots.find((person) => person.userId === user.id) ? (
              <button
                onClick={async () => {
                  await unparrot(squawk.id, token);
                  let squawkCopy = { ...squawk };
                  squawkCopy.parrots.splice(squawk?.parrots.findIndex((person) => person.userId === user.id), 1);
                  setSquawk(squawkCopy);
                }}
              >
                Unparrot
              </button>
            ) : (
              <button
                onClick={async () => {
                  const { parrot } = await createParrot(squawk.id, token);
                  let squawkCopy = { ...squawk };
                  squawkCopy.parrots.push(parrot);
                  setSquawk(squawkCopy);
                }}
              >
                Parrot
              </button>
            )}
      <div>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const { comment } = await createComment(
              squawk.id,
              commentContent,
              token
            );
            let update = { ...squawk };
            update.comments.push(comment);
            setSquawk(update);
            setCommentContent("");
          }}
        >
          <input
            value={commentContent}
            onChange={(event) => setCommentContent(event.target.value)}
          ></input>
          <button type="submit" disabled={commentContent ? false : true}>
            Post Comment
          </button>
        </form>
        <p>Comments:</p>
        {squawk.comments?.length
          ? squawk?.comments.map((comment) => {
              return <div>{comment.commentContent}</div>;
            })
          : null}
      </div>
    </div> : <h1>This squawk does not exist</h1>}</>
  );
};

export default Squawk;
