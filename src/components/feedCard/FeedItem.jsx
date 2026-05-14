import React from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTrash,
  faTriangleExclamation,
  faBan,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";
import CommentSection from "./CommentSection";
import LikeButton from "./LikeButton";
import "../../scss/components/_feedItem.scss";

const ReviewBadge = ({ status }) => {
  if (!status) return null;
  const map = {
    approved: { label: "Approved", cls: "badge-pill badge-active" },
    rejected: { label: "Rejected", cls: "badge-pill badge-inactive" },
    pending:  { label: "Pending",  cls: "badge-pill badge-warning" },
  };
  const cfg = map[status] || { label: status, cls: "badge-pill badge-info" };
  return <span className={cfg.cls}>{cfg.label}</span>;
};

const FeedItem = ({ item, onApprove, onRemove, onWarnUser, onBlockUser }) => {
  const navigate = useNavigate();

  if (item.type === "post") {
    const author = item.data.author || {};
    const likesCount = item.data.likes?.length || 0;
    const isLiked = false;

    return (
      <div className="post-item">
        <div className="feed-post-card">
          {/* Header */}
          <div className="feed-post-header">
            <div className="d-flex align-items-center gap-3 flex-grow-1 min-w-0">
              <div className="feed-avatar">
                {author.profile_image ? (
                  <Image
                    src={author.profile_image}
                    alt={author.full_name || "User"}
                    roundedCircle
                    style={{ width: "42px", height: "42px", objectFit: "cover" }}
                  />
                ) : (
                  <div className="feed-avatar-placeholder">
                    {(author.full_name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="feed-author-info">
                <div className="feed-author-name">
                  {author.full_name || "Unknown"}
                  {item.data.club && (
                    <span className="feed-author-club">
                      {" "}in <strong>{item.data.club.name}</strong>
                    </span>
                  )}
                </div>
                <div className="feed-author-time">
                  {formatDistanceToNow(new Date(item.data.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
            <div className="feed-badges">
              {item.data.reported_count > 0 && (
                <span className="badge-pill badge-inactive">
                  {item.data.reported_count} Report{item.data.reported_count !== 1 ? "s" : ""}
                </span>
              )}
              <ReviewBadge status={item.data.review_status} />
              <span className="badge-pill badge-primary">Post</span>
            </div>
          </div>

          {/* Content */}
          {item.data.content && (
            <div className="feed-post-content">{item.data.content}</div>
          )}
          {item.data.image_url && (
            <div className="feed-post-image">
              <img src={item.data.image_url} alt="Post" />
            </div>
          )}

          {/* Interactions */}
          <div className="feed-interactions">
            <LikeButton likesCount={likesCount} isLiked={isLiked} />
            <CommentSection
              post_id={item.data.id}
              comments={item.data.comments || []}
              readOnly={true}
            />
          </div>

          {/* Admin Actions */}
          {onApprove && (
            <div className="feed-admin-actions">
              <button
                className="feed-action-btn feed-action-approve"
                onClick={() => onApprove(item.data.id)}
              >
                <FontAwesomeIcon icon={faCheck} />
                Approve
              </button>
              <button
                className="feed-action-btn feed-action-remove"
                onClick={() => onRemove(item.data.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
                Remove
              </button>
              <button
                className="feed-action-btn feed-action-warn"
                onClick={() => onWarnUser(item.data.id, item.data.author?.id)}
              >
                <FontAwesomeIcon icon={faTriangleExclamation} />
                Warn User
              </button>
              <button
                className="feed-action-btn feed-action-block"
                onClick={() => onBlockUser(item.data.author?.id)}
              >
                <FontAwesomeIcon icon={faBan} />
                Block User
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (item.type === "event") {
    return (
      <div className="event-item">
        <div className="feed-post-card event-feed-card">
          <div className="d-flex align-items-flex-start gap-3">
            <div className="event-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 2v4" /><path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
              </svg>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                <h6 className="event-feed-title mb-0">{item.data.title}</h6>
                <span className="badge-pill badge-primary ms-auto">Event</span>
                {item.data.paymentRequired && (
                  <span className="badge-pill badge-warning">Paid</span>
                )}
              </div>
              {item.data.description && (
                <p className="event-feed-desc">{item.data.description}</p>
              )}
              <div className="event-feed-meta">
                <span>
                  {new Date(item.data.startAt).toLocaleDateString()} at{" "}
                  {new Date(item.data.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span>By {item.data.user?.full_name || "Unknown"}</span>
              </div>
              <button
                className="feed-action-btn feed-action-view mt-2"
                onClick={() => navigate(`/events/${item.id}`)}
              >
                View Details
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FeedItem;
