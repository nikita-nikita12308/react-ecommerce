import React, { useState } from 'react';
import './CommentsSection.css';
import { FaStar } from 'react-icons/fa';
import moment from 'moment';

const Comment = ({ comment, onReply }) => {
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = () => {
    setIsReplying(true);
  };
  const handleCancel = () => {
    setReplyText('');
    setIsReplying(false);
  };
  const handleSendReply = () => {
    onReply(comment._id, replyText);
    setReplyText('');
    setIsReplying(false);
  };
  const renderRating = () => {
    const stars = [];
    for (let i = 0; i < comment.rating; i++) {
      stars.push(<FaStar key={i} />);
    }
    return stars;
  };

  const formattedDateTime = moment(comment.createdAt).format(
    'DD.MM.YYYY HH:mm'
  );

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

        <p>Користувач: {comment.user.name}</p>
        <p>Текст: {comment.text}</p>
        <div>
          <span>Рейтинг: </span>
          {renderRating()}
        </div>
        <p>Створений: {formattedDateTime}</p>
        {isReplying && (
          <div className="mb-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="form-control"
              placeholder="Напишіть відповідь..."
            />
            <button
              className="btn btn-outline-primary btn-sm me-2"
              onClick={handleSendReply}
            >
              Відправити
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
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
            <p>User: {reply.user.name}</p>
            <p>Text: {reply.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CommentsList = ({ comments, handleReply }) => {
  const sortedComments = comments.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return (
    <div className="commentsListContainer">
      {sortedComments.map((comment) => (
        <Comment key={comment._id} comment={comment} onReply={handleReply} />
      ))}
    </div>
  );
};

export default CommentsList;
