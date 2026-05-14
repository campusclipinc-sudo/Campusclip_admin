// FeedCard.jsx - Common component for displaying posts in feed style
import React, { useState } from "react";
import { Image, Badge } from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";
import "../scss/student-posts.scss";

const FeedCard = ({
  item,
  user,
  type = "post", // "post" or "club"
  showStats = true, // Show likes/comments (for posts)
}) => {
  const isPost = type === "post";
  const [showComments, setShowComments] = useState(false);

  if (!isPost) {
    return null; // Only handle posts for now
  }

  const comments = item?.comments || [];
  const commentsCount = comments.length;

  return (
    <div className="feed-post">
      <div className="post-header">
        <div className="post-avatar">
          {user?.profile_image ? (
            <Image
              src={user.profile_image}
              alt={user.full_name || "User"}
              roundedCircle
              className="avatar-img"
            />
          ) : (
            <div className="avatar-placeholder">
              {(user?.full_name || "U").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="post-meta">
          <div className="post-author">
            {user?.full_name || "Unknown User"}
            {item?.club && (
              <span className="post-club"> in {item.club.name}</span>
            )}
          </div>
          <div className="post-time">
            {item?.created_at &&
              formatDistanceToNow(new Date(item.created_at), {
                addSuffix: true,
              })}
          </div>
        </div>
        <div className="post-badges">
          <Badge
            bg={item?.is_public ? "success" : "secondary"}
            className="privacy-badge"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {item?.is_public ? (
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              ) : (
                <>
                  <rect
                    width="18"
                    height="11"
                    x="3"
                    y="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </>
              )}
            </svg>
            <span className="ms-1">
              {item?.is_public ? "Public" : "Private"}
            </span>
          </Badge>
        </div>
      </div>

      {item?.content && (
        <div className="post-content">
          <p>{item.content}</p>
        </div>
      )}

      {item?.image_url && (
        <div className="post-image">
          <Image src={item.image_url} alt="Post" fluid className="post-img" />
        </div>
      )}

      {showStats && (
        <div className="post-footer">
          <div className="d-flex align-items-center gap-1 text-muted">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span className="small">{item?.likes?.length || 0} Likes</span>
          </div>
          <div
            className="d-flex align-items-center gap-1 text-muted comment-toggle"
            onClick={() => setShowComments(!showComments)}
            style={{ cursor: "pointer" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className="small">
              {commentsCount} {commentsCount === 1 ? "Comment" : "Comments"}
            </span>
          </div>
        </div>
      )}

      {showComments && commentsCount > 0 && (
        <div className="post-comments">
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-content">
                  <p className="mb-1">{comment.comment}</p>
                  <div className="comment-meta">
                    <span className="text-muted small">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedCard;
