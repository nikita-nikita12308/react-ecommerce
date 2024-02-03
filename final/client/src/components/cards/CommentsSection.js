import React, { useState, useEffect } from "react";
import "./CommentsSection.css";
import { FaStar } from "react-icons/fa";
import moment from "moment";

const Comment = ({ comment, onReply }) => {
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = () => {
    setIsReplying(true);
  };
  const handleCancel = () => {
    setReplyText("");
    setIsReplying(false);
  };
  const handleSendReply = () => {
    onReply(comment._id, replyText);
    setReplyText("");
    setIsReplying(false);
  };
  const renderRating = () => {
    const stars = [];
    for (let i = 0; i < comment.rating; i++) {
      stars.push(<FaStar style={{ color: "#FFD700" }} key={i} />);
    }
    return stars;
  };

  const formattedDateTime = (typeOfComment) => {
    return moment(typeOfComment.createdAt).format("DD.MM.YYYY HH:mm");
  };

  return (
    <div className="commentContainer" key={comment._id}>
      <div className="commentHeader"></div>
      <div className="commentInfo">
        {!isReplying && (
          <button
            className="btn btn-outline-primary btn-sm float-end"
            onClick={handleReply}
          >
            Відповісти
          </button>
        )}

        <p>
          <strong>{comment.user.name} </strong> - {formattedDateTime(comment)}
        </p>
        <p>{comment.text}</p>
        <div>
          <span>Рейтинг: </span>
          {renderRating()}
        </div>
        {isReplying && (
          <div className="mb-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="form-control mt-2"
              placeholder="Напишіть відповідь..."
            />
            <button
              className="btn btn-outline-primary btn-sm me-2 mt-2"
              onClick={handleSendReply}
            >
              Відправити
            </button>
            <button
              className="btn btn-outline-secondary btn-sm mt-2"
              onClick={handleCancel}
            >
              Відмінити
            </button>
          </div>
        )}
      </div>

      <div>
        {comment.replies.map((reply) => (
          <div className="replyContainer" key={reply._id}>
            <strong>{reply.user.name} </strong>
            <p>{reply.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CommentsList = ({ comments, handleReply, commentsPerPage }) => {
  const [displayedComments, setDisplayedComments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(commentsPerPage);
  useEffect(() => {
    // Sort comments by date in descending order
    const sortedComments = [...comments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Slice comments based on the visible count
    const slicedComments = sortedComments.slice(0, visibleCount);

    setDisplayedComments(slicedComments);
  }, [comments, visibleCount]);
  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + commentsPerPage);
  };
  return (
    <div className="commentsListContainer">
      {displayedComments.map((comment) => (
        <Comment key={comment._id} comment={comment} onReply={handleReply} />
      ))}
      {visibleCount < comments.length && (
        <div className="text-center">
          <a
            href="#load-more"
            className="nav-link pb-4"
            onClick={handleLoadMore}
          >
            Завантажити більше...
          </a>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
