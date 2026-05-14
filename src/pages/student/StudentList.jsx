import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash, faDownload, faXmark, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import StudentService from "../../api/studentService";
import TNTable from "../../component/TNTable";
import ConfirmPopup from "../../components/ui/ConfirmPopup";
import {
  useStudents,
  useDeleteStudent,
  useToggleAdminStatus,
  useBulkDeleteStudents,
} from "../../hooks/useRQStudent";

const StudentList = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetRow, setTargetRow] = useState(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  const params = { page: pageIndex + 1, limit: 10, search: debouncedSearch || undefined };
  const { data, isLoading, refetch } = useStudents(params);

  const { mutate: deleteStudent, isPending: deleting } = useDeleteStudent(() => refetch());
  const { mutate: bulkDeleteStudents, isPending: bulkDeleting } = useBulkDeleteStudents(() => {
    setSelectedStudents(new Set());
    refetch();
  });
  const { mutate: toggleStatus } = useToggleAdminStatus(() => refetch());

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  useEffect(() => {
    setSelectedStudents(new Set());
  }, [pageIndex, debouncedSearch]);

  const students = data?.data?.students || [];
  const pagination = data?.data?.pagination || null;
  const paginationData = pagination
    ? { total: pagination.total, per_page: pagination.limit, last_page: pagination.totalPages }
    : null;

  const onDelete = useCallback((row) => {
    setTargetRow(row);
    setConfirmOpen(true);
  }, []);

  const handleSelectStudent = useCallback((id) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map((s) => s.id)));
    }
  }, [selectedStudents.size, students]);

  const handleExport = useCallback(async () => {
    const studentIds = students.map((s) => s.id);
    if (studentIds.length === 0) { toast.warning("No students to export"); return; }
    toast.info("Generating CSV...");
    try {
      await StudentService.exportStudents(studentIds);
      toast.success("Exported successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Export failed");
    }
  }, [students]);

  const isAllSelected = students.length > 0 && selectedStudents.size === students.length;
  const isIndeterminate = selectedStudents.size > 0 && selectedStudents.size < students.length;

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: () => (
          <input
            type="checkbox"
            className="table-checkbox"
            checked={isAllSelected}
            ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
            onChange={handleSelectAll}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="table-checkbox"
            checked={selectedStudents.has(row.original.id)}
            onChange={() => handleSelectStudent(row.original.id)}
            aria-label="Select student"
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "full_name",
        header: "Name",
        cell: ({ getValue }) => (
          <span style={{ fontWeight: 500 }}>{getValue() || "-"}</span>
        ),
      },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "educational_institution.name", header: "School" },
      { accessorKey: "academic_year", header: "Year" },
      { accessorKey: "major", header: "Program" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="tn-table-action-btn tn-table-action-btn-primary"
              onClick={() => navigate(`/students/${row.original.id}/view`)}
              title="View"
            >
              <FontAwesomeIcon icon={faEye} /> View
            </button>
            <button
              className="tn-table-action-btn tn-table-action-btn-primary"
              onClick={() => navigate(`/students/${row.original.id}/edit`, { state: { student: row.original } })}
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
    [navigate, deleting, onDelete, selectedStudents, handleSelectStudent, handleSelectAll, isAllSelected, isIndeterminate]
  );

  return (
    <div className="student-list-page">
      {/* Page Header */}
      <div className="page-header-block">
        <div>
          <h1 className="page-heading">Students</h1>
          <p className="page-heading-sub">Manage all enrolled students</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <button
            className="btn-secondary-action"
            onClick={handleExport}
            disabled={isLoading || students.length === 0}
            title="Export as CSV"
          >
            <FontAwesomeIcon icon={faDownload} /> Export
          </button>
        </div>
      </div>

      {/* Search & Bulk toolbar */}
      <div className="list-toolbar">
        <div className="search-wrap">
          <input
            type="text"
            className="filter-select"
            placeholder="Search by name, email, username…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        {searchInput && (
          <button
            className="filter-clear-btn"
            onClick={() => { setSearchInput(""); setPageIndex(0); }}
          >
            <FontAwesomeIcon icon={faXmark} /> Clear
          </button>
        )}
      </div>

      {/* Bulk-select bar */}
      {selectedStudents.size > 0 && (
        <div className="bulk-action-bar">
          <span className="bulk-count">
            {selectedStudents.size} student{selectedStudents.size !== 1 ? "s" : ""} selected
          </span>
          <div className="d-flex gap-2">
            <button
              className="filter-clear-btn"
              onClick={() => setSelectedStudents(new Set())}
            >
              <FontAwesomeIcon icon={faXmark} /> Clear selection
            </button>
            <button
              className="bulk-delete-btn"
              onClick={() => setBulkDeleteConfirmOpen(true)}
              disabled={bulkDeleting || deleting}
            >
              {bulkDeleting
                ? <Spinner size="sm" animation="border" />
                : <><FontAwesomeIcon icon={faTrashCan} /> Delete selected</>}
            </button>
          </div>
        </div>
      )}

      <TNTable
        columns={columns}
        data={Array.isArray(students) ? students : []}
        paginationData={paginationData}
        onSelectPage={(p) => setPageIndex(p)}
        idName="admin-students-table"
        pageIndexGet={pageIndex}
      />

      <ConfirmPopup
        open={confirmOpen}
        title="Delete Student"
        onCancel={() => { setConfirmOpen(false); setTargetRow(null); }}
        onConfirm={() => { if (targetRow) deleteStudent(targetRow.id); setConfirmOpen(false); setTargetRow(null); }}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={deleting}
      >
        Are you sure you want to delete{" "}
        <strong>{targetRow?.full_name || "this student"}</strong>?
      </ConfirmPopup>

      <ConfirmPopup
        open={bulkDeleteConfirmOpen}
        title="Delete Selected Students"
        onCancel={() => setBulkDeleteConfirmOpen(false)}
        onConfirm={() => { bulkDeleteStudents(Array.from(selectedStudents)); setBulkDeleteConfirmOpen(false); }}
        confirmText="Delete All"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={bulkDeleting}
      >
        Are you sure you want to delete{" "}
        <strong>{selectedStudents.size}</strong> selected student{selectedStudents.size !== 1 ? "s" : ""}?
        This cannot be undone.
      </ConfirmPopup>
    </div>
  );
};

export default StudentList;
