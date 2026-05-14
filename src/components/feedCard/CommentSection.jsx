import React, { useState } from "react";
import { Button, Image } from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";
import "../../scss/components/_commentSection.scss";

/**
 * CommentSection Component
 * Displays comments list (read-only mode for admin)
 * @param {number} post_id - Post ID
 * @param {Array} comments - Array of comments to display
 * @param {boolean} readOnly - If true, hide comment input and make read-only
 */
const CommentSection = ({ post_id, comments = [], readOnly = false }) => {
  const [showComments, setShowComments] = useState(false);
  const commentsCount = comments?.length || 0;

  return (
    <div className="comment-section">
      <Button
        variant="outline-primary"
        size="sm"
        onClick={() => setShowComments(!showComments)}
        className="d-flex align-items-center gap-1 comment-toggle-btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span style={{ minWidth: '1ch', display: 'inline-block' }}>
          {commentsCount} {commentsCount === 1 ? "Comment" : "Comments"}
        </span>
      </Button>

      {showComments && (
        <div className="comments-list-container mt-3">
          {comments.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <p className="small mb-0">No comments yet.</p>
            </div>
          ) : (
            <div className="comments-list">
              {comments.map((comment) => {
                const commentUser = comment.user || {};
                const userName = commentUser.full_name || commentUser.username || "Unknown User";
                const userInitial = userName.charAt(0).toUpperCase();
                
                return (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-avatar">
                      {commentUser.profile_image ? (
                        <Image
                          src={commentUser.profile_image}
                          alt={userName}
                          roundedCircle
                          className="avatar-img"
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {userInitial}
                        </div>
                      )}
                    </div>
                    <div className="comment-content-wrapper">
                      <div className="comment-header">
                        <span className="comment-author">{userName}</span>
                        <span className="comment-time">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <div className="comment-text">
                        {comment.comment}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
