import React from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faChalkboardTeacher,
  faUsersCog,
  faCalendarAlt,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useDashboardCounts } from "../hooks/useRQdashboard";
import { useNavigate } from "react-router-dom";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useDashboardCounts();
  const counts = data?.data || {};

  const cardData = [
    {
      title: "Students",
      value: counts.student_count || 0,
      icon: faUsers,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      shadow: "rgba(102, 126, 234, 0.45)",
      badge: "Total enrolled",
      navigateTo: "/students",
    },
    {
      title: "Classes",
      value: counts.class_count || 0,
      icon: faChalkboardTeacher,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      shadow: "rgba(240, 147, 251, 0.45)",
      badge: "Active classes",
      navigateTo: "/classes",
    },
    {
      title: "Clubs",
      value: counts.club_count || 0,
      icon: faUsersCog,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      shadow: "rgba(79, 172, 254, 0.45)",
      badge: "Campus clubs",
      navigateTo: "/clubs",
    },
  ];

  if (isLoading) {
    return (
      <Container fluid>
        <div className="d-flex align-items-center justify-content-center py-5">
          <div className="text-center">
            <Spinner
              animation="border"
              style={{ color: "#6366f1", width: "2.5rem", height: "2.5rem" }}
              role="status"
            />
            <p className="mt-3 text-muted" style={{ fontSize: "0.875rem" }}>
              Loading dashboard...
            </p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid>
        <div
          className="p-4 mt-4"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "16px",
            color: "#ef4444",
          }}
        >
          Failed to load dashboard data. Please try again.
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      {/* Page Header */}
      <div className="dashboard-page-header">
        <span className="greeting-time">{getGreeting()}</span>
        <h2 className="page-title">Dashboard Overview</h2>
        <p className="page-subtitle">
          Monitor your campus activity at a glance.
        </p>
      </div>

      {/* Stat Cards */}
      <Row className="g-4">
        {cardData.map((card, index) => (
          <Col key={index} xs={12} sm={6} lg={4}>
            <div
              className="dashboard-stat-card"
              style={{
                background: card.gradient,
                boxShadow: `0 16px 40px ${card.shadow}`,
              }}
              onClick={() => navigate(card.navigateTo)}
              role="button"
            >
              <div className="card-inner">
                <div className="stat-icon-wrapper">
                  <FontAwesomeIcon icon={card.icon} />
                </div>
                <div className="stat-title">{card.title}</div>
                <div className="stat-value">{card.value.toLocaleString()}</div>
                <span className="stat-badge">
                  {card.badge}
                  <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: "0.65rem" }} />
                </span>
              </div>
            </div>
          </Col>
        ))}

        {/* Events Card */}
        <Col xs={12} sm={6} lg={4}>
          <div
            className="dashboard-stat-card"
            style={{
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              boxShadow: "0 16px 40px rgba(67,233,123,0.4)",
            }}
            onClick={() => navigate("/events")}
            role="button"
          >
            <div className="card-inner">
              <div className="stat-icon-wrapper">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div className="stat-title">Total Events</div>
              <div className="stat-value">
                {(counts.event_count || 0).toLocaleString()}
              </div>
              <div className="event-breakdown">
                <div className="breakdown-item">
                  <div className="breakdown-label">Free</div>
                  <div className="breakdown-value">
                    {(counts.free_event_count || 0).toLocaleString()}
                  </div>
                </div>
                <div className="breakdown-item">
                  <div className="breakdown-label">Paid</div>
                  <div className="breakdown-value">
                    {(counts.paid_event_count || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
