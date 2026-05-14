import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LoginForm from "../pages/Login";
import { useSelector } from "react-redux";
import Dashboard from "../pages/Dashboard";
import { isUserLoggedIn } from "../store/userSlice";
import Layout from "../layout/Layout";
import EditProfile from "../pages/ProfileSettings/EditProfile";
import ChangePassword from "../pages/ProfileSettings/ChangePassword";
import Settings from "../pages/Settings";
import ClassEdit from "../pages/class/ClassEdit";
import ClassList from "../pages/class/ClassList";
import ClassView from "../pages/class/ClassView";
import ClubList from "../pages/club/ClubList";
import ClubEdit from "../pages/club/ClubEdit";
import ClubDetails from "../pages/club/ClubDetails";
import StudentRoutes from "../pages/student/student.route";
import AssignmentList from "../pages/assignment/AssignmentList";
import AssignmentEdit from "../pages/assignment/AssignmentEdit";
import EventList from "../pages/events/EventList";
import EventDetails from "../pages/events/EventDetails";
import FeedList from "../pages/feed/FeedList.jsx";
import EventTransactions from "../pages/events/EventTransactionList";

const PagesRoutes = () => {
  const isLoggedIn = useSelector(isUserLoggedIn);

  return (
    <Routes>
      {/* Public Routes */}

      <>
        {!isLoggedIn && (
          <>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<Home />} />
          </>
        )}
        {isLoggedIn && (
          <>
            {/* Private Route */}
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/feed"
              element={
                <Layout>
                  <FeedList />
                </Layout>
              }
            />
            <Route
              path="/settings"
              element={
                <Layout>
                  <Settings />
                </Layout>
              }
            />
            <Route
              path="/classes"
              element={
                <Layout>
                  <ClassList />
                </Layout>
              }
            />
            <Route
              path="/classes/:id/edit"
              element={
                <Layout>
                  <ClassEdit />
                </Layout>
              }
            />
            <Route
              path="/classes/:id/view"
              element={
                <Layout>
                  <ClassView />
                </Layout>
              }
            />
            <Route
              path="/classes/:classId/assignments/:id/edit"
              element={
                <Layout>
                  <AssignmentEdit />
                </Layout>
              }
            />
            <Route
              path="/classes/:classId/assignments/new"
              element={
                <Layout>
                  <AssignmentEdit />
                </Layout>
              }
            />
            <Route
              path="/assignments"
              element={
                <Layout>
                  <AssignmentList />
                </Layout>
              }
            />
            <Route
              path="/clubs"
              element={
                <Layout>
                  <ClubList />
                </Layout>
              }
            />
            <Route
              path="/clubs/:id"
              element={
                <Layout>
                  <ClubDetails />
                </Layout>
              }
            />
            <Route
              path="/clubs/:id/edit"
              element={
                <Layout>
                  <ClubEdit />
                </Layout>
              }
            />
            <Route
              path="/clubs/new"
              element={
                <Layout>
                  <ClubEdit />
                </Layout>
              }
            />
            <Route
              path="/students/*"
              element={
                <Layout>
                  <StudentRoutes />
                </Layout>
              }
            />
            <Route
              path="/events"
              element={
                <Layout>
                  <EventList />
                </Layout>
              }
            />
            <Route
              path="/events/:id"
              element={
                <Layout>
                  <EventDetails />
                </Layout>
              }
            />
            <Route
              path="/transactions"
              element={
                <Layout>
                  <EventTransactions />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <EditProfile />
                </Layout>
              }
            />
            <Route
              path="/profile/password"
              element={
                <Layout>
                  <ChangePassword />
                </Layout>
              }
            />
            <Route
              path="/"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
          </>
        )}
      </>
    </Routes>
  );
};

export default PagesRoutes;
