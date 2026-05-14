import React, { useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import TNTable from "../../component/TNTable";
import ConfirmPopup from "../../components/ui/ConfirmPopup";
import { useListClubs, useDeleteClub } from "../../hooks/useRQClub";

const ClubList = () => {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetRow, setTargetRow] = useState(null);

  const { data, refetch } = useListClubs({ page: pageIndex + 1, limit: 10 });
  const { mutate: deleteClub, isPending: deleting } = useDeleteClub(() => {
    setConfirmOpen(false);
    setTargetRow(null);
    refetch();
  });

  const clubs = data?.data?.clubs || [];
  const pagination = data?.data?.pagination || null;
  const paginationData = pagination
    ? { total: pagination.total, per_page: pagination.limit, last_page: pagination.totalPages }
    : null;

  const onDelete = useCallback((row) => {
    setTargetRow(row);
    setConfirmOpen(true);
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ getValue }) => (
          <span style={{ fontWeight: 500 }}>{getValue() || "-"}</span>
        ),
      },
      {
        accessorKey: "category.name",
        header: "Category",
        cell: ({ getValue }) => getValue() || "-",
      },
      {
        accessorKey: "total_members",
        header: "Members",
        cell: ({ getValue }) => getValue() || "-",
      },
      {
        accessorKey: "is_public",
        header: "Visibility",
        cell: ({ getValue }) => (
          <span className={`badge-pill ${getValue() ? "badge-active" : "badge-inactive"}`}>
            {getValue() ? "Public" : "Private"}
          </span>
        ),
      },
      {
        accessorKey: "owner.full_name",
        header: "Owner",
        cell: ({ getValue }) => getValue() || "-",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="tn-table-action-btn tn-table-action-btn-primary"
              onClick={() => navigate(`/clubs/${row.original.id}`)}
              title="View"
            >
              <FontAwesomeIcon icon={faEye} /> View
            </button>
            <button
              className="tn-table-action-btn tn-table-action-btn-primary"
              onClick={() => navigate(`/clubs/${row.original.id}/edit`, { state: { clubItem: row.original } })}
              title="Edit"
            >
              <FontAwesomeIcon icon={faEdit} /> Edit
            </button>
            <button
              className="tn-table-action-btn tn-table-action-btn-danger"
              disabled={deleting}
              onClick={() => onDelete(row.original)}
              title="Delete"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      },
    ],
    [navigate, deleting, onDelete]
  );

  return (
    <div className="club-list-page">
      <div className="page-header-block">
        <div>
          <h1 className="page-heading">Clubs</h1>
          <p className="page-heading-sub">Manage all campus clubs</p>
        </div>
      </div>

      <TNTable
        columns={columns}
        data={Array.isArray(clubs) ? clubs : []}
        paginationData={paginationData}
        onSelectPage={(p) => setPageIndex(p)}
        pageIndexGet={pageIndex}
        idName="admin-clubs-table"
      />

      <ConfirmPopup
        open={confirmOpen}
        title="Delete Club"
        onConfirm={() => targetRow && deleteClub(targetRow.id)}
        onCancel={() => { setConfirmOpen(false); setTargetRow(null); }}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={deleting}
      >
        Are you sure you want to delete{" "}
        <strong>{targetRow?.name || "this club"}</strong>? This action cannot be undone.
      </ConfirmPopup>
    </div>
  );
};

export default ClubList;
