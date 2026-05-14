import React, { useState, useRef, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
// import EmojiPicker from 'emoji-picker-react';
import { useGetClassChatMessages, useSendClassChatMessage } from '../../hooks/useRQclass';
import '../../scss/components/_clubChat.scss';

const ClassChat = ({ classId, className }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const currentUser = useSelector((state) => state.user?.user);
  const currentUserId = currentUser?.id;

  // Build room_id in format: class:{classId}
  const roomId = `class:${classId}`;

  const {
    data: chatData,
    isLoading,
    error,
    refetch,
  } = useGetClassChatMessages(classId, { page: 1, limit: 50 });

  const sendMessageMutation = useSendClassChatMessage(classId, () => {
    setMessage('');
  });

  const messages = chatData?.data?.messages || [];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || sendMessageMutation.isLoading) return;

    sendMessageMutation.mutate({
      message: message.trim(),
      room_id: roomId,
      message_type: 'group',
      media_type: 'text',
    });
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleEmojiClick = (emojiData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="club-chat-container">
      {/* Chat Header */}
      <div className="club-chat-header">
        <div className="club-chat-header-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div className="club-chat-header-content">
          <h4 className="club-chat-title">{className || 'Class Discussion'}</h4>
          <p className="club-chat-subtitle">Connect with your classmates</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="club-chat-messages" ref={chatContainerRef}>
        {isLoading ? (
          <div className="club-chat-loading">
            <Spinner animation="border" variant="primary" size="sm" />
            <span>Loading messages...</span>
          </div>
        ) : error ? (
          <div className="club-chat-error">
            <p>Error loading messages. Please try again.</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="club-chat-empty">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p>No messages yet</p>
            <p className="small">Be the first to start the conversation!</p>
          </div>
        ) : (
          <div className="club-chat-messages-list">
            {messages.map((msg) => {
              const isOwnMessage =
                currentUserId &&
                (String(msg.from_user_id) === String(currentUserId));
              
              return (
                <div
                  key={msg.id}
                  className={`club-chat-message ${
                    isOwnMessage ? 'club-chat-message-own' : ''
                  }`}
                >
                  {msg.media_type === 'image' && msg.metadata?.imageUrl ? (
                    <div className="club-chat-message-image">
                      <img src={msg.metadata.imageUrl} alt="Shared" />
                    </div>
                  ) : msg.media_type === 'video' && msg.metadata?.videoUrl ? (
                    <div className="club-chat-message-video">
                      <video controls src={msg.metadata.videoUrl}></video>
                    </div>
                  ) : null}
                  {msg.message && (
                    <div className="club-chat-message-content">
                      <p>{msg.message}</p>
                    </div>
                  )}
                  <div className="club-chat-message-meta">
                    <span className="club-chat-message-sender">
                      {isOwnMessage ? 'You' : msg.sender?.full_name || 'Unknown'}
                    </span>
                    <span className="club-chat-message-time">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input Area */}
      {/* <div className="club-chat-input-area">
        <form onSubmit={handleSendMessage} className="club-chat-input-form">
          <input
            type="text"
            className="club-chat-input"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sendMessageMutation.isLoading}
          />
          <div className="emoji-picker-wrapper" ref={emojiPickerRef}>
            <button
              type="button"
              className="club-chat-emoji-btn"
              aria-label="Add emoji"
              onClick={toggleEmojiPicker}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </button>
            {showEmojiPicker && (
              <div className="emoji-picker-container">
                <EmojiPicker onEmojiClick={handleEmojiClick} width={320} height={400} />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="club-chat-send-btn"
            disabled={!message.trim() || sendMessageMutation.isLoading}
          >
            {sendMessageMutation.isLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 2-7 20-4-9-9-4Z"></path>
                <path d="M22 2 11 13"></path>
              </svg>
            )}
          </button>
        </form>
      </div> */}
    </div>
  );
};

export default ClassChat;

