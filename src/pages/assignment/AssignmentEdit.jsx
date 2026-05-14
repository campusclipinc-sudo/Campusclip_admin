import React from "react";
import { Button, Card, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TNInput from "../../component/TNInput";
import { useGetAssignmentById, useCreateAssignment, useUpdateAssignment } from "../../hooks/useRQassignment";

const AssignmentSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must not exceed 200 characters"),
  due_date: Yup.string()
    .required("Due date is required"),
  weight: Yup.number()
    .required("Weight is required")
    .min(0, "Weight must be 0 or greater")
    .max(999, "Weight must not exceed 3 digits"),
  points_possible: Yup.string()
    .required("Points possible is required")
    .min(0, "Points possible must be 0 or greater")
    .max(999, "Points possible must not exceed 3 digits"),
  marks_obtained: Yup.number()
    .max(999, "Marks obtained must not exceed 3 digits"),
});

const AssignmentEdit = () => {
  const navigate = useNavigate();
  const { id, classId } = useParams();
  const isCreate = !id || id === "new";

  const { data, isLoading } = useGetAssignmentById(isCreate ? undefined : id);
  const assignment = data?.data || {};

  const getInitialValues = () => {
    if (!isCreate && assignment && assignment.id) {
      return {
        title: assignment.title || "",
        type: assignment.type || "Assignment",
        due_date: assignment.due_date ? new Date(assignment.due_date).toISOString().split('T')[0] : "",
        weight: assignment.weight || "",
        points_possible: assignment.points_possible || "",
        description: assignment.description || "",
        marks_obtained: assignment.marks_obtained || "",
        status: assignment.status || "pending",
        class_id: assignment.class_id || classId || "",
      };
    }
    return {
      title: "",
      type: "Assignment",
      due_date: "",
      weight: "",
      points_possible: "",
      description: "",
      marks_obtained: "",
      status: "pending",
      class_id: classId || "",
    };
  };

  const handleBack = () => {
    if (classId) {
      navigate(`/classes/${classId}/view`, { replace: false });
    } else {
      navigate("/classes", { replace: false });
    }
  };

  const handleCreateSuccess = () => {
    // Navigate to class view
    if (classId) {
      navigate(`/classes/${classId}/view`);
    } else {
      navigate("/classes");
    }
  };

  const handleUpdateSuccess = () => {
    // Navigate to class view
    if (classId) {
      navigate(`/classes/${classId}/view`);
    } else {
      navigate("/classes");
    }
  };

  const { mutate: createAssignment, isPending: creating } = useCreateAssignment(classId, handleCreateSuccess);
  const { mutate: updateAssignment, isPending: updating } = useUpdateAssignment(classId, id, handleUpdateSuccess);

  const isPending = creating || updating;

  const handleSubmit = (values) => {
    console.log("=== Form Values ===", values);
    console.log("due_date type:", typeof values.due_date, "value:", values.due_date);
    console.log("weight type:", typeof values.weight, "value:", values.weight);
    console.log("points_possible type:", typeof values.points_possible, "value:", values.points_possible);
    
    if (!values.class_id) {
      alert("Class ID is required");
      return;
    }

    const payload = {
      ...values,
      due_date: values.due_date || null,
      weight: values.weight ? parseFloat(values.weight) : null,
      points_possible: values.points_possible ? parseInt(values.points_possible) : null,
      marks_obtained: values.marks_obtained ? parseFloat(values.marks_obtained) : null,
    };

    if (isCreate) {
      createAssignment(payload);
    } else {
      updateAssignment({ id, ...payload });
    }
  };

  if (isLoading && !isCreate) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!classId && isCreate) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Create Assignment</h5>
          <Button variant="light" onClick={handleBack}>Back</Button>
        </div>
        <Card>
          <Card.Body>
            <p className="text-danger">Class ID is required. Please navigate from a class page.</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{isCreate ? "Create Assignment" : "Edit Assignment"}</h5>
      </div>

      <Card>
        <Card.Body>
          <Formik
            enableReinitialize
            initialValues={getInitialValues()}
            validationSchema={AssignmentSchema}
            onSubmit={handleSubmit}
            validateOnBlur={true}
            validateOnChange={true}
          >
            {({
              errors,
              touched,
              isSubmitting,
              values,
              setFieldValue,
              handleChange,
              handleBlur,
            }) => (
              <Form>
                <Row className="g-3">
                  <Col md={6} xs={12}>
                    <TNInput
                      label="Title *"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors}
                      touched={touched}
                      placeholder="e.g., Midterm Exam"
                    />
                  </Col>
                  <Col md={6} xs={12}>
                    <TNInput
                      label="Type"
                      name="type"
                      type="select"
                      value={values.type}
                      onChange={(e) =>
                        setFieldValue("type", e.target.value)
                      }
                      onBlur={handleBlur}
                      error={errors}
                      touched={touched}
                      options={[
                        { value: "Assignment", label: "Assignment" },
                        { value: "Quiz", label: "Quiz" },
                        { value: "Project", label: "Project" },
                        { value: "Exam", label: "Exam" },
                        { value: "Homework", label: "Homework" },
                      ]}
                    />
                  </Col>
                  <Col md={6} xs={12}>
                    <TNInput
                      label="Due Date"
                      name="due_date"
                      type="date"
                      value={values.due_date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors}
                      touched={touched}
                    />
                  </Col>
                  <Col md={6} xs={12}>
                    <TNInput
                      label="Status"
                      name="status"
                      type="select"
                      value={values.status}
                      onChange={(e) =>
                        setFieldValue("status", e.target.value)
                      }
                      onBlur={handleBlur}
                      error={errors}
                      touched={touched}
                      options={[
                        { value: "pending", label: "Pending" },
                        { value: "submitted", label: "Submitted" },
                        { value: "graded", label: "Graded" },
                        { value: "overdue", label: "Overdue" },
                      ]}
                    />
                  </Col>
                  <Col md={6} xs={12}>
                    <TNInput
                      label="Weight (%)"
                      name="weight"
                      type="number"
                      value={values.weight}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors}
                      touched={touched}
                      placeholder="e.g., 15.00"
                      step="0.01"
                    />
                  </Col>
                  <Col md={6} xs={12}>
                    <TNInput
                      label="Points Possible"
                      name="points_possible"
                      type="number"
                      value={values.points_possible}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors}
                      touched={touched}
                      placeholder="e.g., 100"
                    />
                  </Col>
                  <Col md={6} xs={12}>
                    <TNInput
                      label="Marks Obtained"
                      name="marks_obtained"
                      type="number"
                      value={values.marks_obtained}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors}
                      touched={touched}
                      placeholder="e.g., 85.50"
                      step="0.01"
                    />
                  </Col>
                  <Col xs={12}>
                    <TNInput
                      label="Description"
                      name="description"
                      type="textarea"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors}
                      touched={touched}
                      placeholder="Assignment description..."
                      rows={4}
                    />
                  </Col>
                </Row>
                <div className="d-flex justify-content-end mt-3 gap-2">
                  <Button
                    variant="light"
                    type="button"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting || isPending}
                  >
                    {(isSubmitting || isPending) && (
                      <Spinner size="sm" className="me-2" />
                    )}
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AssignmentEdit;

