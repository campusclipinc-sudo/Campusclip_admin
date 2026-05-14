import React from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import TNInput from "../../component/TNInput";
import "../../scss/profile.scss";
import TabNav from "../../components/TabNav";
import { useGetProfile, useEditProfile } from "../../hooks/useRQauth";
import { validationSchema } from "./EditProfileValidation";

const EditProfile = () => {
  const formik = useFormik({
    initialValues: {
      full_name: "",
      phone_number: "",
      email: "",
    },
    validationSchema,
    onSubmit: (values) => {
      doEditProfile(values);
      refetch();
    },
  });
  const {
    refetch,
    isLoading: isProfileLoading,
    data: profileData,
  } = useGetProfile();

  if (!isProfileLoading && profileData && profileData.data) {
    formik.values.full_name = profileData.data.full_name;
    formik.values.phone_number = profileData.data.phone_number;
    formik.values.email = profileData.data.email;
  }

  const { mutate: doEditProfile, isPending } = useEditProfile();

  return (
    <div className="edit-profile-page">
      <h2 className="page-title mb-3">Edit Profile</h2>
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
                  label="Full Name"
                  name="full_name"
                  placeholder="Enter full name"
                  value={formik.values.full_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors}
                  touched={formik.touched}
                />
              </Col>

              <Col xs={12} md={6}>
                <Row className="g-2 align-items-end">
                  <Col xs={12}>
                    <TNInput
                      label="phone_number"
                      name="phone_number"
                      placeholder="Enter phone_number"
                      value={formik.values.phone_number}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.errors}
                      touched={formik.touched}
                    />
                  </Col>
                </Row>
              </Col>

              <Col xs={12} md={6}>
                <TNInput
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors}
                  touched={formik.touched}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-3 gap-2">
              <Button
                variant="secondary"
                type="button"
                disabled={isPending || isProfileLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isPending || isProfileLoading}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditProfile;
