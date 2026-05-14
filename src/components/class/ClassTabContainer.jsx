import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import AssignmentTable from "../assignment/AssignmentTable";
import ClassChat from "../feedCard/ClassChat";
import { useGetClassMembers } from "../../hooks/useRQclass";
import TNTable from "../../component/TNTable";

/**
 * ClassTabContainer - Handles tab navigation and API calls for class details tabs
 * @param {string} classId - The class ID
 * @param {string} activeTab - Currently active tab key
 */
const ClassTabContainer = ({ classId, activeTab, className }) => {
  const navigate = useNavigate();
  const [membersPageIndex, setMembersPageIndex] = useState(0);

  // Build params for members API
  const membersParams = useMemo(
    () => ({
      page: membersPageIndex + 1,
      limit: 10,
    }),
    [membersPageIndex]
  );

  // Fetch members when classmates tab is active
  const { data: membersData, isLoading: membersLoading } = useGetClassMembers(
    classId,
    membersParams,
    { enabled: activeTab === "classmates" && !!classId }
  );

  // Define members table columns
  const membersColumns = useMemo(
    () => [
      {
        accessorKey: "user.full_name",
        header: "Name",
        cell: (info) => {
          const member = info.row.original;
          return member.user?.full_name || member.full_name || "-";
        },
      },
      {
        accessorKey: "user.academic_year",
        header: "Academic Year",
        cell: (info) => {
          const member = info.row.original;
          return member.user?.academic_year || member.academic_year || "-";
        },
      },
      {
        accessorKey: "user.major",
        header: "Major",
        cell: (info) => {
          const member = info.row.original;
          return member.user?.major || member.major || "-";
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const member = row.original;
          const userId = member.user_id || member.user?.id;
          return (
            <div className="d-flex gap-2 justify-content-center">
              <button
                className="tn-table-action-btn"
                onClick={() => navigate(`/students/${userId}/view`)}
                title="View Student Details"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
            </div>
          );
        },
      },
    ],
    [navigate]
  );

  // Handle assignment tab content - show assignment table inline
  if (activeTab === "assignment") {
    return <AssignmentTable classId={classId} showAddButton={true} />;
  }

  if (activeTab === "chat") {
    return <ClassChat classId={classId} className={className} />;
  }

  // Handle classmates tab content
  if (activeTab === "classmates") {
    if (membersLoading) {
      return <div className="text-center py-4">Loading classmates...</div>;
    }

    const members = membersData?.data?.members || [];
    // Note: The API doesn't return pagination, so we'll handle it without pagination for now
    // If pagination is needed, it should be added to the API response

    if (members.length === 0) {
      return (
        <div className="text-center py-4">
          <p>No classmates yet.</p>
        </div>
      );
    }

    // Transform members data to match table format
    const tableData = members.map((member) => ({
      ...member,
      // Ensure user data is accessible
      user: member.user || {},
    }));

    return (
      <TNTable
        columns={membersColumns}
        data={Array.isArray(tableData) ? tableData : []}
        paginationData={null}
        onSelectPage={() => {}}
        idName="admin-class-members-table"
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

export default ClassTabContainer;
