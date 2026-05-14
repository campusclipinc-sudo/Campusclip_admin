import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilterCircleXmark } from "@fortawesome/free-solid-svg-icons";
import TNTable from "../../component/TNTable";
import { useEvents } from "../../hooks/useRQevents";
import { useListCategories } from "../../hooks/useRQClub";
import { useStudents } from "../../hooks/useRQStudent";

const EventList = () => {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [paymentType, setPaymentType] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [organizerId, setOrganizerId] = useState("");

  const params = useMemo(() => {
    const queryParams = { page: pageIndex + 1, limit: 10 };
    if (paymentType) queryParams.payment_type = paymentType;
    if (categoryId) queryParams.category_id = categoryId;
    if (organizerId) queryParams.organizer_id = organizerId;
    return queryParams;
  }, [pageIndex, paymentType, categoryId, organizerId]);

  const { data, isLoading } = useEvents(params);

  const { data: categoriesData } = useListCategories();
  const categories = Array.isArray(categoriesData?.data)
    ? categoriesData.data
    : Array.isArray(categoriesData?.data?.categories)
    ? categoriesData.data.categories
    : [];

  const { data: studentsData } = useStudents({ limit: 1000 });
  const students = studentsData?.data?.students || [];

  useEffect(() => {
    setPageIndex(0);
  }, [paymentType, categoryId, organizerId]);

  const events = data?.data?.events || [];
  const pagination = data?.data?.pagination || null;
  const paginationData = pagination
    ? {
        total: pagination.total,
        per_page: pagination.limit,
        last_page: pagination.totalPages,
      }
    : null;

  const handleClearFilters = useCallback(() => {
    setPaymentType("");
    setCategoryId("");
    setOrganizerId("");
    setPageIndex(0);
  }, []);

  const hasActiveFilters = paymentType || categoryId || organizerId;

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Name",
        cell: ({ getValue }) => (
          <span style={{ fontWeight: 500 }}>{getValue() || "-"}</span>
        ),
      },
      {
        accessorKey: "user.full_name",
        header: "Organizer",
        cell: ({ row }) => row.original.user?.full_name || "-",
      },
      {
        accessorKey: "paymentRequired",
        header: "Type",
        cell: ({ getValue }) => {
          const isPaid = getValue();
          return (
            <span className={`badge-pill ${isPaid ? "badge-paid" : "badge-free"}`}>
              {isPaid ? "Paid" : "Free"}
            </span>
          );
        },
      },
      {
        accessorKey: "startAt",
        header: "Start Date",
        cell: ({ getValue }) => {
          const date = getValue();
          if (!date) return "-";
          return new Date(date).toLocaleDateString();
        },
      },
      {
        accessorKey: "total_attendees",
        header: "Attendees",
        cell: ({ getValue }) => getValue() || "-",
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ getValue }) => {
          const isActive = getValue();
          return (
            <span className={`badge-pill ${isActive ? "badge-active" : "badge-inactive"}`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="tn-table-action-btn tn-table-action-btn-primary"
              onClick={() => navigate(`/events/${row.original.id}`)}
              title="View Event Details"
            >
              <FontAwesomeIcon icon={faEye} />
              View
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  return (
    <div className="event-list-page">
      {/* Page Header */}
      <div className="page-header-block">
        <div>
          <h1 className="page-heading">Events</h1>
          <p className="page-heading-sub">Manage and monitor all campus events</p>
        </div>
      </div>

      {/* Filter Card */}
      <div className="filter-card">
        <div className="filter-card-header">
          <span className="filter-card-title">Filters</span>
          {hasActiveFilters && (
            <button className="filter-clear-btn" onClick={handleClearFilters}>
              <FontAwesomeIcon icon={faFilterCircleXmark} />
              Clear filters
            </button>
          )}
        </div>

        <Row className="g-3">
          <Col xs={12} md={4}>
            <label className="filter-label">Payment Type</label>
            <select
              className="filter-select"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="paid">Paid</option>
              <option value="free">Free</option>
            </select>
          </Col>
          <Col xs={12} md={4}>
            <label className="filter-label">Category</label>
            <select
              className="filter-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </Col>
          <Col xs={12} md={4}>
            <label className="filter-label">Organizer</label>
            <select
              className="filter-select"
              value={organizerId}
              onChange={(e) => setOrganizerId(e.target.value)}
            >
              <option value="">All Organizers</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.full_name || s.email}</option>
              ))}
            </select>
          </Col>
        </Row>
      </div>

      {/* Table */}
      {isLoading && events.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner
            animation="border"
            style={{ color: "#6366f1", width: "2rem", height: "2rem" }}
          />
        </div>
      ) : (
        <TNTable
          columns={columns}
          data={Array.isArray(events) ? events : []}
          paginationData={paginationData}
          onSelectPage={(p) => setPageIndex(p)}
          idName="admin-events-table"
          pageIndexGet={pageIndex}
        />
      )}
    </div>
  );
};

export default EventList;
