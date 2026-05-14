import React, { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import TNTable from "../../component/TNTable";
import { useListClasses, useDeleteClass } from "../../hooks/useRQclass";
import ConfirmPopup from "../../components/ui/ConfirmPopup";

const ClassList = () => {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetRow, setTargetRow] = useState(null);

  const { data, refetch } = useListClasses();
  const { mutate: deleteClass, isPending: deleting } = useDeleteClass(() => {
    setConfirmOpen(false);
    setTargetRow(null);
    refetch();
  });

  const classes = data?.data?.classrooms || data?.data?.data?.classrooms || [];

  const onDelete = useCallback((row) => {
    setTargetRow(row);
    setConfirmOpen(true);
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "class_name",
        header: "Class Name",
        cell: ({ getValue }) => (
          <span style={{ fontWeight: 500 }}>{getValue() || "-"}</span>
        ),
      },
      { accessorKey: "instructor_name", header: "Instructor" },
      { accessorKey: "students_count", header: "Students" },
      { accessorKey: "semester", header: "Semester" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="tn-table-action-btn tn-table-action-btn-primary"
              onClick={() => navigate(`/classes/${row.original.id}/view`, { state: { classItem: row.original } })}
              title="View"
            >
              <FontAwesomeIcon icon={faEye} /> View
            </button>
            <button
              className="tn-table-action-btn tn-table-action-btn-primary"
              onClick={() => navigate(`/classes/${row.original.id}/edit`, { state: { classItem: row.original } })}
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
    <div className="class-list-page">
      <div className="page-header-block">
        <div>
          <h1 className="page-heading">Classes</h1>
          <p className="page-heading-sub">Manage all campus classes</p>
        </div>
      </div>

      <TNTable
        columns={columns}
        data={classes}
        paginationData={null}
        onSelectPage={() => {}}
        idName="admin-class-table"
      />

      <ConfirmPopup
        open={confirmOpen}
        title="Delete Class"
        onConfirm={() => targetRow && deleteClass(targetRow.id)}
        onCancel={() => { setConfirmOpen(false); setTargetRow(null); }}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={deleting}
      >
        Are you sure you want to delete{" "}
        <strong>{targetRow?.class_name || targetRow?.class_code}</strong>?
        This action cannot be undone.
      </ConfirmPopup>
    </div>
  );
};

export default ClassList;
