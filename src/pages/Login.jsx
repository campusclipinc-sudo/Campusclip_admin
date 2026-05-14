import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useUserLogin } from "../hooks/useRQauth";
import { setAuthToken } from "../libs/HttpClients";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import "../scss/LoginForm.scss";
import TNInput from "../component/TNInput";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    mutate: login,
    isLoading,
    isSuccess,
  } = useUserLogin((res) => {
    const dataStore = {
      userData: res.data.userInfo,
      isLogin: res.data.isLogin,
      accessToken: res.data.accessToken,
    };
    dispatch(loginSuccess(dataStore));
    setAuthToken(res.data.accessToken);
    navigate("/dashboard");
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      login(values);
    },
  });

  return (
    <div className="login-form-container">
      <div className="login-card">
        <h3 className="mb-3">Admin Login</h3>
        <Form noValidate onSubmit={formik.handleSubmit}>
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
            placeholder="Enter your password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            error={formik.errors}
            touched={formik.touched}
          />
          <Button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? <Spinner animation="border" size="sm" /> : "Login"}
          </Button>

          {isSuccess && (
            <Alert variant="success" className="alert">
              Login successful!
            </Alert>
          )}
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
