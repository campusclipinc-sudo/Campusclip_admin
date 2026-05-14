import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AssignmentTable from "../../components/assignment/AssignmentTable";

const AssignmentList = () => {
  const { classId } = useParams();
  const [searchParams] = useSearchParams();
  const classIdFromQuery = searchParams.get("classId") || classId;

  return <AssignmentTable classId={classIdFromQuery} showAddButton={true} />;
};

export default AssignmentList;

