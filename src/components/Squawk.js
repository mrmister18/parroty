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
  return (<div className="squawk-page">
  <h1 className="title">Squawk</h1>
    {squawk?.id && squawk.author.username === username ? <div key={`${squawk.id}`}>
        <img className="post__avatar" src={squawk.author?.profilePicture} alt="" />

      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3 style={{cursor: 'pointer'}}
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
          <div className="recipient-username">{squawk.postedAt}</div>
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
      <div className="squawk-icons">
            {squawk.id && squawk?.parrots.find((person) => person.userId === user.id) ? (
              <span
                onClick={async () => {
                  await unparrot(squawk.id, token);
                  let squawkCopy = { ...squawk };
                  squawkCopy.parrots.splice(squawk?.parrots.findIndex((person) => person.userId === user.id), 1);
                  setSquawk(squawkCopy);
                }}
              >
                <svg className="parroted-icon" viewBox="0 0 25 25">
              <g>
              <path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"></path>              </g>
            </svg>
              </span>
            ) : (
              <span
                onClick={async () => {
                  if (!token) {document.getElementById("myForm").style.display = "flex";
                  document.getElementById("background").style.display = "flex";}
                  else {
                  const { parrot } = await createParrot(squawk.id, token);
                  let squawkCopy = { ...squawk };
                  squawkCopy.parrots.push(parrot);
                  setSquawk(squawkCopy);}
                }}
              >
                <svg className="not-parroted-icon" viewBox="0 0 25 25">
              <g>
              <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
              </g>
            </svg>
              </span>
            )}
            {squawk.id && squawk?.likes.find((person) => person.userId === user.id) ? (
              <span
                onClick={async () => {
                  await unlike(squawk.id, token);
                  let squawkCopy = { ...squawk };
                  squawkCopy.likes.splice(squawk?.likes.findIndex((person) => person.userId === user.id), 1);
                  setSquawk(squawkCopy);
                }}
              >
                <svg className="liked-icon" viewBox="0 0 25 25">
              <g>
              <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>            
              </g>
              </svg>
              </span>
            ) : (
              <span
                onClick={async () => {
                  if (!token) {document.getElementById("myForm").style.display = "flex";
                  document.getElementById("background").style.display = "flex";}
                  else {
                  const { like } = await createLike(squawk.id, token);
                  let squawkCopy = { ...squawk };
                  squawkCopy.likes.push(like);
                  setSquawk(squawkCopy);}
                }}
              >
                <svg className="not-liked-icon" viewBox="0 0 25 25">
              <g>
              <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>              </g>
              </svg>
              </span>
            )}
            </div>
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
                <img className="post__avatar" src={user?.profilePicture} alt="" />
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
                <img className="post__avatar" src={comment.profilePicture} alt="" />

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
    </div> : <h1>This squawk does not exist</h1>}</div>
  );
};

export default Squawk;
