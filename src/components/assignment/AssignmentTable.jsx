import React, { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import TNTable from "../../component/TNTable";
import ConfirmPopup from "../ui/ConfirmPopup";
import { useListAssignments, useDeleteAssignment } from "../../hooks/useRQassignment";

/**
 * AssignmentTable - Reusable component for displaying assignments in a table
 * @param {string} classId - The class ID to filter assignments
 * @param {boolean} showAddButton - Whether to show the Add Assignment button
 */
const AssignmentTable = ({ classId, showAddButton = true }) => {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  
  const params = useMemo(
    () => ({
      page: pageIndex + 1,
      limit: 10,
    }),
    [pageIndex]
  );

  const { data, refetch, isLoading } = useListAssignments(classId, params, {
    enabled: !!classId,
  });
  const { mutate: deleteAssignment, isPending: deleting } = useDeleteAssignment(classId, () => {
    setConfirmOpen(false);
    setTargetRow(null);
    refetch();
  });

  const assignments = data?.data?.assignments || [];
  const pagination = data?.data?.pagination || null;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetRow, setTargetRow] = useState(null);

  const openEdit = (row) => {
    navigate(`/classes/${classId}/assignments/${row.id}/edit`);
  };

  const onDelete = useCallback((row) => {
    setTargetRow(row);
    setConfirmOpen(true);
  }, []);

  const confirmDelete = () => {
    if (targetRow) {
      deleteAssignment(targetRow.id);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setTargetRow(null);
  };

  const handleAdd = () => {
    navigate(`/classes/${classId}/assignments/new`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge bg="secondary">Pending</Badge>;
      case "submitted":
        return <Badge bg="success">Submitted</Badge>;
      case "graded":
        return <Badge bg="primary">Graded</Badge>;
      case "overdue":
        return <Badge bg="danger">Overdue</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "due_date",
        header: "Due Date",
        cell: (info) => {
          const date = info.getValue();
          return date ? new Date(date).toLocaleDateString() : "-";
        },
      },
      {
        accessorKey: "weight",
        header: "Weight",
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "points_possible",
        header: "Points",
        cell: (info) => {
          const points = info.getValue();
          return points !== null && points !== undefined ? points : "-";
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          return getStatusBadge(status);
        },
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: (info) => info.getValue() || "-",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="tn-table-action-btn tn-table-action-btn-primary"
              onClick={() => openEdit(row.original)}
              title="Edit Assignment"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              className="tn-table-action-btn tn-table-action-btn-danger"
              disabled={deleting}
              onClick={() => onDelete(row.original)}
              title="Delete Assignment"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      },
    ],
    [deleting, onDelete]
  );

  if (isLoading) {
    return <div className="text-center py-4">Loading assignments...</div>;
  }

  return (
    <div>
      {showAddButton && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Assignments</h5>
          <Button variant="primary" onClick={handleAdd}>
            Add Assignment
          </Button>
        </div>
      )}
      {assignments.length === 0 ? (
        <div className="text-center py-4">
          <p>No assignments yet. Create an assignment to get started!</p>
          {showAddButton && (
            <Button variant="primary" onClick={handleAdd} className="mt-2">
              Add Assignment
            </Button>
          )}
        </div>
      ) : (
        <TNTable
          columns={columns}
          data={assignments}
          paginationData={
            pagination
              ? {
                  total: pagination.total,
                  per_page: pagination.limit,
                  last_page: pagination.totalPages,
                }
              : null
          }
          onSelectPage={(p) => setPageIndex(p)}
          pageIndexGet={pageIndex}
          idName="admin-assignment-table"
        />
      )}
      <ConfirmPopup
        open={confirmOpen}
        title="Delete Assignment"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={deleting}
      >
        <p>
          Are you sure you want to delete the assignment{" "}
          <strong>{targetRow?.title}</strong>? This action cannot be undone.
        </p>
      </ConfirmPopup>
    </div>
  );
};

export default AssignmentTable;

