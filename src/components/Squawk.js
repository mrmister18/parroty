import React, { useEffect, useState } from "react";
import { getSquawks, createComment } from "../axios-services";
import { useParams, useNavigate } from "react-router-dom";

const Squawk = ({ token }) => {
  const [squawk, setSquawk] = useState({});
  const [commentContent, setCommentContent] = useState("");
  const { squawkId } = useParams();
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
  return (
    <div className="post" key={`${squawk.id}`}>
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
    </div>
  );
};

export default Squawk;
