import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useStudent, useUpdateStudent } from "../../hooks/useRQStudent";
import TNInput from "../../component/TNInput";
import TabNav from "../../components/TabNav";

const StudentSchema = Yup.object().shape({
  full_name: Yup.string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  academic_year: Yup.string().required("Academic year is required"),
  major: Yup.string()
    .required("Major is required")
    .min(2, "Major must be at least 2 characters")
    .max(100, "Major must not exceed 100 characters"),
});

const StudentEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isCreate = !id || id === "new";
  const location = useLocation();
  const initialData = location.state?.student;

  const { data, isLoading } = useStudent(isCreate ? undefined : id);
  const student = initialData || data?.data || {};

  const { mutate: updateStudent, isPending: updating } = useUpdateStudent(
    (res) => {
      toast.success(res.message);
      navigate("/students");
    }
  );

  const handleSubmit = (values) => {
    updateStudent({ id, payload: values });
  };

  return (
    <div className="edit-profile-page">
      <h2 className="page-title mb-3">
        {isCreate ? "Create Student" : "Edit Student"}
      </h2>
      <TabNav items={[{ label: "Details", to: window.location.pathname }]} />
      <Row className="g-3">
        <Col>
          <Card className="profile-card">
            <Card.Body>
              {isLoading && !isCreate ? (
                <div className="text-center py-5">
                  <Spinner />
                </div>
              ) : (
                <Formik
                  enableReinitialize
                  initialValues={{
                    full_name: student.full_name || "",
                    email: student.email || "",
                    username: student.username || "",
                    phone_number: student.phone_number || "",
                    university: student.educational_institution.name || "",
                    academic_year: student.academic_year || "",
                    major: student.major || "",
                    account_privacy: student.account_privacy ?? 0,
                    user_status: student.user_status ?? 1,
                    grade_display_format:
                      student.grade_display_format || "percentage",
                  }}
                  validationSchema={StudentSchema}
                  onSubmit={handleSubmit}
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
                      <div className="mb-3 p-4">
                        <Row className="g-3">
                          <Col xs={12} lg={6} xl={6} md={6}>
                            <TNInput
                              label="Full Name"
                              name="full_name"
                              value={values.full_name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors}
                              touched={touched}
                              placeholder="Enter full name"
                            />
                          </Col>
                          <Col xs={12} lg={6} xl={6} md={6}>
                            <TNInput
                              label="Email"
                              name="email"
                              type="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors}
                              touched={touched}
                              placeholder="Enter email"
                              disabled={true}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} lg={6} xl={6} md={6}>
                            <TNInput
                              label="Username"
                              name="username"
                              value={values.username}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors}
                              touched={touched}
                              placeholder="Enter username"
                            />
                          </Col>
                          <Col xs={12} lg={6} xl={6} md={6}>
                            <TNInput
                              label="Phone"
                              name="phone_number"
                              value={values.phone_number}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors}
                              touched={touched}
                              placeholder="Enter phone number"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} lg={6} xl={6} md={6}>
                            <TNInput
                              label="University"
                              name="university"
                              value={values.university}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors}
                              touched={touched}
                              placeholder="Enter university"
                              disabled={true}
                            />
                          </Col>
                          <Col xs={12} lg={6} xl={6} md={6}>
                            <TNInput
                              label="Academic Year"
                              name="academic_year"
                              value={values.academic_year}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors}
                              touched={touched}
                              placeholder="Enter academic year"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} lg={6} xl={6} md={6}>
                            <TNInput
                              label="Major"
                              name="major"
                              value={values.major}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors}
                              touched={touched}
                              placeholder="Enter major"
                            />
                          </Col>
                          <Col xs={12} lg={6} xl={6} md={6}>
                            <TNInput
                              label="Privacy"
                              name="account_privacy"
                              type="select"
                              value={values.account_privacy}
                              onChange={(e) =>
                                setFieldValue("account_privacy", e.target.value)
                              }
                              onBlur={handleBlur}
                              error={errors}
                              touched={touched}
                              options={[
                                { value: 0, label: "Public" },
                                { value: 1, label: "Private" },
                              ]}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} lg={6} xl={6} md={6}>
                            <TNInput
                              label="Status"
                              name="user_status"
                              type="select"
                              value={values.user_status}
                              onChange={(e) =>
                                setFieldValue("user_status", e.target.value)
                              }
                              onBlur={handleBlur}
                              error={errors}
                              touched={touched}
                              options={[
                                { value: 1, label: "Active" },
                                { value: 2, label: "Inactive" },
                              ]}
                            />
                          </Col>
                          <Col xs={12} lg={6} xl={6} md={6}>
                            <TNInput
                              label="Grade Display"
                              name="grade_display_format"
                              type="select"
                              value={values.grade_display_format}
                              onChange={(e) =>
                                setFieldValue(
                                  "grade_display_format",
                                  e.target.value
                                )
                              }
                              onBlur={handleBlur}
                              error={errors}
                              touched={touched}
                              options={[
                                { value: "percentage", label: "Percentage" },
                                { value: "gpa", label: "GPA" },
                                { value: "letter_grade", label: "Letter" },
                              ]}
                            />
                          </Col>
                        </Row>
                        <div className="d-flex justify-content-end mt-3 gap-2">
                          <Button
                            variant="secondary"
                            type="button"
                            onClick={() => navigate(-1)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting || updating}
                          >
                            {(isSubmitting || updating) && (
                              <Spinner size="sm" className="me-2" />
                            )}
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentEdit;
