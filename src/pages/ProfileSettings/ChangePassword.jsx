import React from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import TNInput from "../../component/TNInput";
import TabNav from "../../components/TabNav";
import validationSchema from "./ChangePasswordValidation";
import { useChangePassword } from "../../hooks/useRQauth";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { mutate: doChangePassword, isPending } = useChangePassword((res) => {
    navigate("/dashboard");
  });

  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      doChangePassword(values);
    },
  });

  return (
    <div className="edit-profile-page">
      <h2 className="page-title mb-3">Account Settings</h2>
      <TabNav
        items={[
          { label: "Edit Profile", to: "/profile" },
          { label: "Change Password", to: "/profile/password" },
        ]}
      />
      <Card className="profile-card shadow-sm">
        <Card.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Row className="g-3">
              <Col xs={12} md={6}>
                <TNInput
                  label="Old Password"
                  type="password"
                  name="old_password"
                  placeholder="Enter old password"
                  value={formik.values.old_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors}
                  touched={formik.touched}
                />
              </Col>
              <Col xs={12} md={6}>
                <TNInput
                  label="New Password"
                  type="password"
                  name="new_password"
                  placeholder="Enter new password"
                  value={formik.values.new_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors}
                  touched={formik.touched}
                />
              </Col>
              <Col xs={12} md={6}>
                <TNInput
                  label="Confirm Password"
                  type="password"
                  name="confirm_password"
                  placeholder="Re-enter new password"
                  value={formik.values.confirm_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors}
                  touched={formik.touched}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-3 gap-2">
              <Button variant="secondary" type="button" disabled={isPending}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isPending}>
                Update Password
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChangePassword;
