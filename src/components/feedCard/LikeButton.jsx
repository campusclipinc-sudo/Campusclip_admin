import React from 'react';
import { Button } from 'react-bootstrap';

/**
 * LikeButton Component
 * Displays like button with count and handles like/unlike
 * Includes real-time updates via Socket.io
 */
const LikeButton = ({ likesCount, isLiked }) => {
  return (
    <Button
      variant={isLiked ? 'danger' : 'outline-danger'}
      size="sm"
      className="d-flex align-items-center gap-1"
      style={{ cursor: 'default' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      <span>{likesCount}</span>
    </Button>
  );
};

export default LikeButton;
