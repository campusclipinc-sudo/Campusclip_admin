import React, { useMemo, useState } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
  useEventDetails,
  useEventAttendees,
  useAttendEvent,
} from "../../hooks/useRQevents";
import TabNav from "../../components/TabNav";
import DetailField from "../../components/DetailField";
import TNTable from "../../component/TNTable";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useEventDetails(id);
  const event = useMemo(() => (data && (data.data || data)) || null, [data]);
  const attendEventMutation = useAttendEvent();

  const [active, setActive] = useState("detail");
  const [attendeesPageIndex, setAttendeesPageIndex] = useState(0);

  // Fetch attendees when attendees tab is active
  const attendeesParams = useMemo(
    () => ({
      page: attendeesPageIndex + 1,
      limit: 10,
    }),
    [attendeesPageIndex]
  );

  const { data: attendeesData, isLoading: attendeesLoading } =
    useEventAttendees(id, attendeesParams, {
      enabled: active === "attendees" && !!id,
    });

  // Define attendees table columns (must be before early returns to follow Rules of Hooks)
  const attendeesColumns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "joinedAt",
        header: "Joined At",
        cell: ({ getValue }) => {
          const date = getValue();
          if (!date) return "-";
          return new Date(date).toLocaleDateString();
        },
      },
      {
        accessorKey: "paymentStatus",
        header: "Payment Status",
        cell: ({ getValue }) => {
          const status = getValue();
          const statusColors = {
            completed: "bg-success-subtle text-success",
            free: "bg-info-subtle text-info",
            pending: "bg-warning-subtle text-warning",
            failed: "bg-danger-subtle text-danger",
          };
          return (
            <span
              className={`badge rounded-pill ${
                statusColors[status] || "bg-secondary-subtle text-secondary"
              }`}
            >
              {status || "-"}
            </span>
          );
        },
      },
    ],
    []
  );

  const handleAttendEvent = () => {
    if (id) {
      attendEventMutation.mutate(id);
    }
  };

  // Format date/time for display
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format fee display
  const formatFee = () => {
    if (event?.paymentRequired && event?.fee) {
      return `$${parseFloat(event.fee).toFixed(2)}`;
    }
    return "Free";
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-5">
        <p>Event not found</p>
        <Button variant="primary" onClick={() => navigate("/events")}>
          Back to Events
        </Button>
      </div>
    );
  }

  const attendees = attendeesData?.data?.attendees || [];
  const attendeesPagination = attendeesData?.data?.pagination || null;
  const attendeesPaginationData = attendeesPagination
    ? {
        total: attendeesPagination.total,
        per_page: attendeesPagination.limit,
        last_page: attendeesPagination.totalPages,
      }
    : null;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Event Details</h5>
        <div className="d-flex gap-2">
          <Button variant="light" onClick={() => navigate("/events")}>
            Back
          </Button>
          <Button
            variant="primary"
            onClick={handleAttendEvent}
            disabled={attendEventMutation.isPending}
          >
            {attendEventMutation.isPending ? "Attending..." : "Attend Event"}
          </Button>
        </div>
      </div>

      {/* Event Summary Card */}
      <Card className="mb-3">
        <Card.Body>
          <Row className="g-3">
            <Col xs={12}>
              <h4 className="mb-3">{event.eventName || event.title || "-"}</h4>
            </Col>
          </Row>
          <Row className="g-3">
            <DetailField
              label="Organizer"
              value={event.user?.full_name || "-"}
              span={6}
            />
            <DetailField
              label="Club"
              value={event.club?.name || "-"}
              span={6}
            />
          </Row>
        </Card.Body>
      </Card>

      {/* Tabs Card */}
      <Card>
        <Card.Header className="bg-gray-100">
          <TabNav
            items={[
              { label: "Detail", eventKey: "detail" },
              { label: "Attendees", eventKey: "attendees" },
            ]}
            activeKey={active}
            onSelect={(k) => setActive(k || "detail")}
          />
        </Card.Header>
        <Card.Body>
          {/* Detail Tab */}
          {active === "detail" && (
            <Row className="g-3">
              <DetailField
                label="Event Name"
                value={event.eventName || event.title || "-"}
                span={12}
              />
              <DetailField
                label="Description"
                value={event.description || "-"}
                span={12}
              />
              <DetailField
                label="Agenda"
                value={event.agenda || "-"}
                span={12}
              />
              <DetailField
                label="Date/Time"
                value={formatDateTime(event.dateTime || event.startAt)}
                span={6}
              />
              <DetailField
                label="Location"
                value={event.location || "-"}
                span={6}
              />
              <DetailField label="Fee" value={formatFee()} span={6} />
              <DetailField
                label="Status"
                value={
                  <span
                    className={`badge ${
                      event.isActive ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {event.isActive ? "Active" : "Inactive"}
                  </span>
                }
                span={6}
              />
            </Row>
          )}

          {/* Attendees Tab */}
          {active === "attendees" && (
            <>
              {attendeesLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" />
                  <p className="mt-2">Loading attendees...</p>
                </div>
              ) : attendees.length === 0 ? (
                <div className="text-center py-4">
                  <p>No attendees yet.</p>
                </div>
              ) : (
                <TNTable
                  columns={attendeesColumns}
                  data={Array.isArray(attendees) ? attendees : []}
                  paginationData={attendeesPaginationData}
                  onSelectPage={(p) => setAttendeesPageIndex(p)}
                  pageIndexGet={attendeesPageIndex}
                  idName="admin-event-attendees-table"
                />
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default EventDetails;
