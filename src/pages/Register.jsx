import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useUserRegister } from "../hooks/useRQauth";
import { useNavigate } from "react-router-dom";
import "../scss/LoginForm.scss";
import TNInput from "../../../frontend/src/component/TNInput";

const Register = () => {
  const navigate = useNavigate();

  const {
    mutate: register,
    isLoading,
    isSuccess,
  } = useUserRegister(() => {
    // Keep API calls unchanged; on success, route to login
    navigate("/login");
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm your password"),
    }),
    onSubmit: ({ name, email, password }) => {
      register({ name, email, password });
    },
  });

  return (
    <div className="login-form-container">
      <div className="login-card">
        <h3 className="mb-3">Create Account</h3>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <TNInput
            label="Name"
            type="text"
            name="name"
            placeholder="Your full name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            error={formik.errors}
            touched={formik.touched}
          />
          <TNInput
            label="Email"
            type="email"
            name="email"
            placeholder="name@example.com"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={formik.errors}
            touched={formik.touched}
          />
          <TNInput
            label="Password"
            type="password"
            name="password"
            placeholder="Create a password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            error={formik.errors}
            touched={formik.touched}
          />
          <TNInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            error={formik.errors}
            touched={formik.touched}
          />
          <Button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? <Spinner animation="border" size="sm" /> : "Register"}
          </Button>

          {isSuccess && (
            <Alert variant="success" className="alert">
              Registration successful! Redirecting to login...
            </Alert>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Register;
