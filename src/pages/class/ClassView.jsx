import React, { useMemo, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useGetClassById } from "../../hooks/useRQclass";
import ClassTabContainer from "../../components/class/ClassTabContainer";
import TabNav from "../../components/TabNav";

const ClassView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetClassById(id);
  const classroom = useMemo(
    () => (data && (data.data || data)) || null,
    [data]
  );

  const [active, setActive] = useState("assignment");

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Class Details</h5>
        <div className="d-flex gap-2">
          <button
            className="btn btn-light"
            onClick={() => navigate(`/classes`)}
          >
            Back
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/classes/${id}/edit`)}
          >
            Edit
          </button>
        </div>
      </div>

      <Card className="mb-3">
        <Card.Body>
          <Row className="g-3">
            <Col md={6} xs={12}>
              <div className="d-flex flex-column gap-2">
                <div>
                  <strong>Class Name:</strong> {classroom?.class_name || "-"}
                </div>
                <div>
                  <strong>Class Code:</strong> {classroom?.class_code || "-"}
                </div>
                <div>
                  <strong>Semester:</strong> {classroom?.semester || "-"}
                </div>
              </div>
            </Col>
            <Col md={6} xs={12}>
              <div className="d-flex flex-column gap-2">
                <div>
                  <strong>Instructor:</strong>{" "}
                  {classroom?.instructor_name || "-"}
                </div>
                <div>
                  <strong>Schedule:</strong> {classroom?.schedule || "-"}
                </div>
                <div>
                  <strong>Target Grade:</strong>{" "}
                  {classroom?.target_grade || "-"}
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header className="bg-gray-100">
          <TabNav
            items={[
              { label: "Assignment", eventKey: "assignment" },
              { label: "Chat", eventKey: "chat" },
              { label: "Classmates", eventKey: "classmates" },
            ]}
            activeKey={active}
            onSelect={(k) => setActive(k || "assignment")}
          />
        </Card.Header>
        <Card.Body>
          <ClassTabContainer
            classId={id}
            activeTab={active}
            className={classroom?.class_name}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default ClassView;
