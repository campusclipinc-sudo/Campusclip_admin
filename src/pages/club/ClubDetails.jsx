import React, { useMemo, useState } from "react";
import { Card, Row, Col, Image } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useClub } from "../../hooks/useRQClub";
import ClubTabContainer from "../../components/club/ClubTabContainer";
import TabNav from "../../components/TabNav";

const ClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useClub(id);
  const club = useMemo(() => (data && (data.data || data)) || null, [data]);

  const [active, setActive] = useState("discussion");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Club Details</h5>
        <div className="d-flex gap-2">
          <button className="btn btn-light" onClick={() => navigate(-1)}>Back</button>
          <button className="btn btn-primary" onClick={() => navigate(`/clubs/${id}/edit`)}>Edit</button>
        </div>
      </div>

      <Card className="mb-3">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col md={1} xs={3}>
              <Image src={club?.club_profile_image || "https://via.placeholder.com/80"} rounded fluid />
            </Col>
            <Col md={11} xs={9}>
              <div className="d-flex flex-column gap-1">
                <div className="fw-semibold fs-5">{club?.name || "-"}</div>
                <div className="text-muted d-flex gap-3 flex-wrap">
                  <span>Total Members: {club?.total_members ?? "-"}</span>
                  <span>Followers: {club?.total_followers ?? "-"}</span>
                  <span>Created by: {club?.owner?.full_name ?? club?.full_name ?? "-"}</span>
                  <span>Category: {club?.category?.name ?? club?.category_id ?? "-"}</span>
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
              { label: "Discussion", eventKey: "discussion" },
              { label: "Chat", eventKey: "chat" },
              { label: "Events", eventKey: "events" },
              { label: "Members", eventKey: "members" },
            ]}
            activeKey={active}
            onSelect={(k) => setActive(k || "discussion")}
          />
        </Card.Header>
        <Card.Body>
          <ClubTabContainer clubId={id} activeTab={active} clubName={club?.name} />
        </Card.Body>
      </Card>
    </div>
  );
};

export default ClubDetails;
