import React, { useState, useMemo, useCallback } from "react";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  useFeed,
  useUpdatePostStatus,
  useWarnUser,
  useBlockUser,
} from "../../hooks/useRQFeed";
import FeedItem from "../../components/feedCard/FeedItem";
import ConfirmPopup from "../../components/ui/ConfirmPopup";
import UserWarning from "../../components/feedCard/UserWarning";

const FeedList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [filter, setFilter] = useState("most_recent");

  const [confirmRemove, setConfirmRemove] = useState(false);
  const [confirmWarn, setConfirmWarn] = useState(false);
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [targetPost, setTargetPost] = useState(null);
  const [targetUser, setTargetUser] = useState(null);

  const feedParams = useMemo(
    () => ({ page: pageIndex + 1, limit: 10, filter }),
    [pageIndex, filter]
  );

  const { data: feedDataResponse, isLoading: isLoadingFeed, refetch } = useFeed(feedParams);

  const { mutate: updatePostStatus, isPending: updatingStatus } = useUpdatePostStatus(() => {
    refetch();
    setConfirmRemove(false);
    setTargetPost(null);
  });

  const { mutate: warnUser, isPending: warning } = useWarnUser(() => {
    refetch();
    setConfirmWarn(false);
    setTargetPost(null);
    setTargetUser(null);
  });

  const { mutate: blockUser, isPending: blocking } = useBlockUser(() => {
    refetch();
    setConfirmBlock(false);
    setTargetUser(null);
  });

  const postsData = useMemo(() => {
    if (!feedDataResponse?.data) return [];
    if (feedDataResponse.data.posts) return Array.isArray(feedDataResponse.data.posts) ? feedDataResponse.data.posts : [];
    return Array.isArray(feedDataResponse.data) ? feedDataResponse.data : [];
  }, [feedDataResponse]);

  const feedPagination = useMemo(
    () => feedDataResponse?.data?.pagination || null,
    [feedDataResponse]
  );

  const feed = useMemo(
    () => postsData.map((post) => ({ type: "post", id: post.id, data: post })),
    [postsData]
  );

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPageIndex(0);
  };

  const handleApprove = useCallback((postId) => {
    updatePostStatus({ postId, status: "approved" });
  }, [updatePostStatus]);

  const handleRemove = useCallback((postId) => {
    setTargetPost(postId);
    setConfirmRemove(true);
  }, []);

  const handleWarnUser = useCallback((postId, userId) => {
    setTargetPost(postId);
    setTargetUser(userId);
    setConfirmWarn(true);
  }, []);

  const handleBlockUser = useCallback((userId) => {
    setTargetUser(userId);
    setConfirmBlock(true);
  }, []);

  const confirmRemovePost = () => {
    if (targetPost) updatePostStatus({ postId: targetPost, status: "rejected" });
  };

  const confirmWarnUserAction = (formData) => {
    if (targetPost && targetUser) {
      warnUser({ postId: targetPost, userId: targetUser, ...formData });
    }
  };

  const confirmBlockUserAction = () => {
    if (targetUser) blockUser(targetUser);
  };

  const getPageNumbers = () => {
    if (!feedPagination) return [];
    const totalPages = feedPagination.totalPages;
    const currentPage = feedPagination.page;
    const maxVisible = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);
    const pages = [];
    if (startPage > 1) { pages.push(1); if (startPage > 2) pages.push("ellipsis-start"); }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages) { if (endPage < totalPages - 1) pages.push("ellipsis-end"); pages.push(totalPages); }
    return pages;
  };

  if (isLoadingFeed) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" style={{ color: "#6366f1", width: "2rem", height: "2rem" }} />
      </div>
    );
  }

  return (
    <div className="feed-list-page">
      {/* Page Header */}
      <div className="page-header-block">
        <div>
          <h1 className="page-heading">Feed Management</h1>
          <p className="page-heading-sub">Manage and moderate student posts</p>
        </div>
      </div>

      {/* Posts Card */}
      <div className="feed-management-card">
        {/* Card Header */}
        <div className="feed-card-header">
          <span className="feed-card-title">Posts Feed</span>
          <select
            className="filter-select"
            value={filter}
            onChange={handleFilterChange}
            style={{ maxWidth: 180 }}
          >
            <option value="most_recent">Most Recent</option>
            <option value="most_liked">Most Liked</option>
            <option value="reported">Reported</option>
          </select>
        </div>

        {/* Feed Content */}
        <div className="feed-card-body">
          {postsData.length === 0 ? (
            <div className="feed-empty-state">
              <div className="empty-icon">📭</div>
              <p className="empty-title">No posts found</p>
              <p className="empty-sub">Try changing the filter above</p>
            </div>
          ) : (
            <>
              <div className="feed-list">
                {feed.map((item) => (
                  <FeedItem
                    key={`${item.type}-${item.id}`}
                    item={item}
                    onApprove={handleApprove}
                    onRemove={handleRemove}
                    onWarnUser={handleWarnUser}
                    onBlockUser={handleBlockUser}
                  />
                ))}
              </div>

              {/* Pagination */}
              {feedPagination && feedPagination.totalPages > 1 && (
                <div className="feed-pagination-wrap">
                  <div className="feed-pagination">
                    <button
                      className="feed-page-btn"
                      disabled={pageIndex === 0}
                      onClick={() => setPageIndex(0)}
                      title="First page"
                    >
                      <FontAwesomeIcon icon={faAnglesLeft} />
                    </button>
                    <button
                      className="feed-page-btn"
                      disabled={pageIndex === 0}
                      onClick={() => setPageIndex(pageIndex - 1)}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>

                    {getPageNumbers().map((page, idx) => {
                      if (page === "ellipsis-start" || page === "ellipsis-end") {
                        return (
                          <span key={`el-${idx}`} className="feed-page-ellipsis">
                            …
                          </span>
                        );
                      }
                      const isActive = page === feedPagination.page;
                      return (
                        <button
                          key={page}
                          className={`feed-page-btn${isActive ? " active" : ""}`}
                          onClick={() => setPageIndex(page - 1)}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      className="feed-page-btn"
                      disabled={pageIndex >= feedPagination.totalPages - 1}
                      onClick={() => setPageIndex(pageIndex + 1)}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                    <button
                      className="feed-page-btn"
                      disabled={pageIndex >= feedPagination.totalPages - 1}
                      onClick={() => setPageIndex(feedPagination.totalPages - 1)}
                      title="Last page"
                    >
                      <FontAwesomeIcon icon={faAnglesRight} />
                    </button>
                  </div>
                  <div className="feed-pagination-info">
                    Page <strong>{feedPagination.page}</strong> of{" "}
                    <strong>{feedPagination.totalPages}</strong> &middot;{" "}
                    {feedPagination.total} total posts
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmPopup
        open={confirmRemove}
        title="Remove Post"
        onConfirm={confirmRemovePost}
        onCancel={() => { setConfirmRemove(false); setTargetPost(null); }}
        confirmText="Remove"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={updatingStatus}
      >
        Are you sure you want to remove this post? This action cannot be undone.
      </ConfirmPopup>

      <UserWarning
        show={confirmWarn}
        onHide={() => { setConfirmWarn(false); setTargetPost(null); setTargetUser(null); }}
        onConfirm={confirmWarnUserAction}
        loading={warning}
      />

      <ConfirmPopup
        open={confirmBlock}
        title="Block User"
        onConfirm={confirmBlockUserAction}
        onCancel={() => { setConfirmBlock(false); setTargetUser(null); }}
        confirmText="Block User"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={blocking}
      >
        Are you sure you want to block this user? They will not be able to access the platform.
      </ConfirmPopup>
    </div>
  );
};

export default FeedList;
