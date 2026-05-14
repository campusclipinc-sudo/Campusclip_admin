import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import {
  useGetClubPosts,
  useGetClubEvents,
  useGetClubMembers,
} from "../../hooks/useRQClub";
import FeedItem from "../feedCard/FeedItem";
import ClubChat from "../feedCard/ClubChat";
import TNTable from "../../component/TNTable";

/**
 * ClubTabContainer - Handles tab navigation and API calls for club details tabs
 * @param {string} clubId - The club ID
 * @param {string} activeTab - Currently active tab key
 */
const ClubTabContainer = ({ clubId, activeTab, clubName }) => {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [eventsPageIndex, setEventsPageIndex] = useState(0);
  const [membersPageIndex, setMembersPageIndex] = useState(0);

  // Build params for posts API
  const postsParams = useMemo(
    () => ({
      page: pageIndex + 1,
      limit: 10,
    }),
    [pageIndex]
  );

  // Build params for events API
  const eventsParams = useMemo(
    () => ({
      page: eventsPageIndex + 1,
      limit: 10,
    }),
    [eventsPageIndex]
  );

  // Build params for members API
  const membersParams = useMemo(
    () => ({
      page: membersPageIndex + 1,
      limit: 10,
    }),
    [membersPageIndex]
  );

  // Fetch posts when discussion tab is active
  const { data: postsData, isLoading: postsLoading } = useGetClubPosts(
    clubId,
    postsParams,
    { enabled: activeTab === "discussion" && !!clubId }
  );

  // Fetch events when events tab is active
  const { data: eventsData, isLoading: eventsLoading } = useGetClubEvents(
    clubId,
    eventsParams,
    { enabled: activeTab === "events" && !!clubId }
  );

  // Fetch members when members tab is active
  const { data: membersData, isLoading: membersLoading } = useGetClubMembers(
    clubId,
    membersParams,
    { enabled: activeTab === "members" && !!clubId }
  );

  // Define members table columns (must be outside conditional to follow Rules of Hooks)
  const membersColumns = useMemo(
    () => [
      {
        accessorKey: "full_name",
        header: "Name",
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue() || "-",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="tn-table-action-btn"
              onClick={() => navigate(`/students/${row.original.id}/view`)}
              title="View Student Details"
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  // Handle discussion tab content
  if (activeTab === "discussion") {
    if (postsLoading) {
      return <div className="text-center py-4">Loading posts...</div>;
    }

    const posts = postsData?.data?.posts || [];
    const postsPagination = postsData?.data?.pagination || null;

    // Transform posts into feed format expected by FeedItem
    const feed = posts.map((post) => ({
      type: "post",
      id: post.id,
      data: post,
    }));

    if (feed.length === 0) {
      return (
        <div className="text-center py-4">
          <p>No posts yet. Be the first to post!</p>
        </div>
      );
    }

    return (
      <>
        <div className="feed-list">
          {feed.map((item) => (
            <FeedItem
              key={`${item.type}-${item.id}`}
              item={item}
              onDeleteEvent={() => {}}
            />
          ))}
        </div>
        {/* Pagination Controls */}
        {postsPagination && postsPagination.totalPages > 1 && (
          <div className="feed-pagination mt-4">
            <Button
              variant="primary"
              size="sm"
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(pageIndex - 1)}
            >
              Previous
            </Button>
            <span className="page-info mx-3">
              Page {postsPagination.page} of {postsPagination.totalPages}
            </span>
            <Button
              variant="primary"
              size="sm"
              disabled={pageIndex >= postsPagination.totalPages - 1}
              onClick={() => setPageIndex(pageIndex + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </>
    );
  }

  if (activeTab === "chat") {
    return <ClubChat roomId={clubId} clubName={clubName} />;
  }

  // Handle events tab content
  if (activeTab === "events") {
    if (eventsLoading) {
      return <div className="text-center py-4">Loading events...</div>;
    }

    const events = eventsData?.data?.events || [];
    const eventsPagination = eventsData?.data?.pagination || null;

    // Transform events into feed format expected by FeedItem
    const feed = events.map((event) => ({
      type: "event",
      id: event.id,
      data: {
        ...event,
        // Map user to author for consistency with FeedItem
        author: event.user
          ? {
              name: event.user.full_name,
              id: event.user.id,
            }
          : null,
        // Ensure startAt is available (might be start_at or startAt)
        startAt: event.startAt || event.start_at,
      },
    }));

    if (feed.length === 0) {
      return (
        <div className="text-center py-4">
          <p>No events yet. Create an event to get started!</p>
        </div>
      );
    }

    return (
      <>
        <div className="feed-list">
          {feed.map((item) => (
            <FeedItem
              key={`${item.type}-${item.id}`}
              item={item}
              onDeleteEvent={() => {}}
            />
          ))}
        </div>
        {/* Pagination Controls */}
        {eventsPagination && eventsPagination.totalPages > 1 && (
          <div className="feed-pagination mt-4">
            <Button
              variant="primary"
              size="sm"
              disabled={eventsPageIndex === 0}
              onClick={() => setEventsPageIndex(eventsPageIndex - 1)}
            >
              Previous
            </Button>
            <span className="page-info mx-3">
              Page {eventsPagination.page} of {eventsPagination.totalPages}
            </span>
            <Button
              variant="primary"
              size="sm"
              disabled={eventsPageIndex >= eventsPagination.totalPages - 1}
              onClick={() => setEventsPageIndex(eventsPageIndex + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </>
    );
  }

  // Handle members tab content
  if (activeTab === "members") {
    if (membersLoading) {
      return <div className="text-center py-4">Loading members...</div>;
    }

    const members = membersData?.data?.members || [];
    const pagination = membersData?.data?.pagination || null;
    const paginationData = pagination
      ? {
          total: pagination.total,
          per_page: pagination.limit,
          last_page: pagination.totalPages,
        }
      : null;

    if (members.length === 0) {
      return (
        <div className="text-center py-4">
          <p>No members yet.</p>
        </div>
      );
    }

    return (
      <TNTable
        columns={membersColumns}
        data={Array.isArray(members) ? members : []}
        paginationData={paginationData}
        onSelectPage={(p) => setMembersPageIndex(p)}
        pageIndexGet={membersPageIndex}
        idName="admin-club-members-table"
      />
    );
  }

  // Placeholder for other tabs
  return (
    <div className="text-center py-4">
      Content for {activeTab} tab coming soon...
    </div>
  );
};

export default ClubTabContainer;
