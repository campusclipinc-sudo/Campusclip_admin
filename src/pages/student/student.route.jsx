import { Routes, Route, Navigate } from "react-router-dom";
import StudentList from "./StudentList";
import StudentEdit from "./StudentEdit";
import StudentView from "./StudentView";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route index element={<StudentList />} />
      <Route path="new" element={<StudentEdit />} />
      <Route path=":id/edit" element={<StudentEdit />} />
      <Route path=":id/view" element={<StudentView />} />
      <Route path="*" element={<Navigate to="/students" replace />} />
    </Routes>
  );
};

export default StudentRoutes;
