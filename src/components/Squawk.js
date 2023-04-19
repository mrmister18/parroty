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
  <h1 className="title">Squawk</h1>
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
        <div>
          <span className="material-icons">
            <strong>{squawk.parrots?.length}</strong> Parrots {" "}
          </span>
          <span className="material-icons">
            <strong>{squawk.likes?.length}</strong> Likes
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
        {user.username && <form
        className="squawk-form"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!commentContent) {return}
            const { comment } = await createComment(
              squawk.id,
              commentContent,
              token
            );
            comment.username = user.username;
            let update = { ...squawk };
            update.comments.push(comment);
            setSquawk(update);
            setCommentContent("");
          }}
        >
          <div className="squawk-form-top">
        <div className="post__avatar">
                <img src={user?.profilePicture} alt="" />
              </div>
        <input
          value={commentContent}
          className="squawk-input"
          placeholder="Leave a comment"
          onChange={(event) => setCommentContent(event.target.value)}
        ></input>
        </div>
        <div className="squawk-controls">
        <span className={commentContent ? "squawk-button enabled-squawk" : "squawk-button disabled"}
        onClick={async (event) => {
          event.preventDefault();
          if (!commentContent) {return}
          const { comment } = await createComment(
            squawk.id,
            commentContent,
            token
          );
          comment.username = user.username;
          let update = { ...squawk };
          update.comments.push(comment);
          setSquawk(update);
          setCommentContent("");
        }}>
          Comment
        </span>
        </div>
        </form>}
        {squawk.comments?.length
          ? squawk?.comments.map((comment) => {
              return <div
              className="post"
              key={comment.id}
              onClick={() => {
                navigate(`/${comment.username}`);
              }}
            >
              <div className="post__avatar">
                <img src={comment.profilePicture} alt="" />
              </div>

              <div className="post__body">
                <div className="post__header">
                  <div className="post__headerText">
                    <h3
                    className="author-name">
                      {comment?.name}
                      <span className="post__headerSpecial">
                        <span className="material-icons post__badge"> </span>@
                        {comment.username} · {comment.postedAt}</span>
                    </h3>
                  </div>
                  <div className="post__headerDescription">
                    <p>{comment.commentContent}</p>
                  </div>
                </div>
              </div>
            </div>
            })
          : null}
      </div>
    </div> : <h1>This squawk does not exist</h1>}</>
  );
};

export default Squawk;
