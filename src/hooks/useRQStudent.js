import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import StudentService from "../api/studentService";

const defaultError = (err) => {
  const message =
    err?.response?.data?.message || err?.message || "Request failed";
  toast.error(message);
};

export const useStudents = (params, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-students", params],
    queryFn: () => StudentService.listStudents(params),
    onSuccess,
    onError,
    keepPreviousData: true,
  });
};

export const useStudent = (id, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-student", id],
    queryFn: () => StudentService.getStudent(id),
    enabled: !!id,
    onSuccess,
    onError,
  });
};

export const useCreateStudent = (onSuccess, onError = defaultError) => {
  return useMutation({
    mutationFn: (payload) => StudentService.createStudent(payload),
    onSuccess,

    onError,
  });
};

export const useUpdateStudent = (onSuccess, onError = defaultError) => {
  return useMutation({
    mutationFn: ({ id, payload }) => StudentService.updateStudent(id, payload),
    onSuccess,
    onError,
  });
};

export const useDeleteStudent = (onSuccess, onError = defaultError) => {
  return useMutation({
    mutationFn: (id) => StudentService.deleteStudent(id),
    onSuccess,
    onError,
  });
};

export const useToggleAdminStatus = (onSuccess, onError = defaultError) => {
  return useMutation({
    mutationFn: ({ id, nextStatus }) =>
      StudentService.toggleAdminStatus(id, nextStatus),
    onError,
    onSuccess,
  });
};

export const useBulkDeleteStudents = (onSuccess, onError = defaultError) => {
  return useMutation({
    mutationFn: (ids) => StudentService.bulkDeleteStudents(ids),
    onSuccess,
    onError,
  });
};

export const useStudentPosts = (id, params, enabled = true, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-student-posts", id, params],
    queryFn: () => StudentService.getStudentPosts(id, params),
    enabled: !!id && enabled,
    onSuccess,
    onError,
    keepPreviousData: true,
  });
};

export const useStudentClasses = (id, params, enabled = true, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-student-classes", id, params],
    queryFn: () => StudentService.getStudentClasses(id, params),
    enabled: !!id && enabled,
    onSuccess,
    onError,
    keepPreviousData: true,
  });
};

export const useStudentClubs = (id, params, enabled = true, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-student-clubs", id, params],
    queryFn: () => StudentService.getStudentClubs(id, params),
    enabled: !!id && enabled,
    onSuccess,
    onError,
    keepPreviousData: true,
  });
};
