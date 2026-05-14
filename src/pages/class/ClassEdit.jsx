import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import TNInput from "../../component/TNInput";
import { useGetClassById, useUpdateClass } from "../../hooks/useRQclass";

const ClassEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isCreate = !id || id === "new";

  const { data, isLoading } = useGetClassById(isCreate ? undefined : id);
  const classroom = data?.data || {};
  const [form, setForm] = useState({
    class_name: "",
    class_code: "",
    instructor_name: "",
    students_count: 0,
    university: "",
    semester: "",
    schedule: "",
    target_grade: "",
    status: "active",
  });

  useEffect(() => {
    if (classroom && !isCreate) {
      // Calculate students count from users (creator)
      const studentsCount = classroom.users ? 1 : 0;

      setForm({
        class_name: classroom.class_name || "",
        class_code: classroom.class_code || "",
        instructor_name: classroom.instructor_name || "",
        students_count: studentsCount,
        university: classroom.university || "",
        semester: classroom.semester || "",
        schedule: classroom.schedule || "",
        target_grade: classroom.target_grade || "",
        status: classroom.status || "active",
      });
    }
  }, [classroom, isCreate]);

  const { mutate: updateClass, isPending } = useUpdateClass(() =>
    navigate("/classes"),
  );

  const onSave = () => {
    updateClass({ id, payload: form });
  };

  if (isLoading && !isCreate) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{isCreate ? "Create Class" : "Edit Class"}</h5>
        <div className="d-flex gap-2">
          <Button variant="light" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button variant="primary" disabled={isPending} onClick={onSave}>
            Save
          </Button>
        </div>
      </div>

      <Card>
        <Card.Body>
          <Row className="g-3">
            <Col md={6} xs={12}>
              <TNInput
                label="Name"
                name="class_name"
                value={form.class_name}
                onChange={(e) =>
                  setForm({ ...form, class_name: e.target.value })
                }
                placeholder="e.g., Introduction to Business"
              />
            </Col>
            <Col md={6} xs={12}>
              <TNInput
                label="Class Code"
                name="class_code"
                value={form.class_code}
                onChange={(e) =>
                  setForm({ ...form, class_code: e.target.value })
                }
                placeholder="e.g., BUS 1220E"
              />
            </Col>
            <Col md={6} xs={12}>
              <TNInput
                label="Instructor"
                name="instructor_name"
                value={form.instructor_name}
                onChange={(e) =>
                  setForm({ ...form, instructor_name: e.target.value })
                }
                placeholder="e.g., Joe Gilvesy"
              />
            </Col>
            <Col md={6} xs={12}>
              <TNInput
                label="Students Count"
                name="students_count"
                type="number"
                value={form.students_count}
                onChange={(e) =>
                  setForm({
                    ...form,
                    students_count: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
                disabled={true}
              />
            </Col>
            <Col md={6} xs={12}>
              <TNInput
                label="University"
                name="university"
                value={form.university}
                onChange={(e) =>
                  setForm({ ...form, university: e.target.value })
                }
                placeholder="e.g., University of Toronto"
              />
            </Col>
            <Col md={6} xs={12}>
              <TNInput
                label="Semester"
                name="semester"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                placeholder="e.g., Fall 2025"
              />
            </Col>
            <Col md={6} xs={12}>
              <TNInput
                label="Schedule"
                name="schedule"
                value={form.schedule}
                onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                placeholder="e.g., Monday 15:30:00-17:30:00, Wednesday 14:30:00-15:30:00"
              />
            </Col>
            <Col md={6} xs={12}>
              <TNInput
                label="Target Grade"
                name="target_grade"
                value={form.target_grade}
                onChange={(e) =>
                  setForm({ ...form, target_grade: e.target.value })
                }
                placeholder="e.g., 8"
              />
            </Col>
            <Col md={6} xs={12}>
              <TNInput
                label="Status"
                name="status"
                type="select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                options={[
                  { value: "active", label: "Active" },
                  { value: "archived", label: "Archived" },
                ]}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ClassEdit;
