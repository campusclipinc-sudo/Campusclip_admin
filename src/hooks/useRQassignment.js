import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AssignmentService from "../api/assignmentService";

const defaultError = (err) => {
  const message = err?.response?.data?.message || err?.message || "Request failed";
  toast.error(message);
};

export const useListAssignments = (classId, params, options = {}, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-assignments", classId, params],
    queryFn: () => AssignmentService.listAssignments(classId, params),
    enabled: options.enabled !== undefined ? options.enabled : !!classId,
    onSuccess,
    onError,
    keepPreviousData: true,
  });
};

export const useGetAssignmentById = (id, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-assignment", id],
    queryFn: () => AssignmentService.getAssignmentById(id),
    enabled: !!id,
    onSuccess,
    onError,
  });
};

export const useCreateAssignment = (classId = null, onSuccess = null, onError = defaultError) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload) => AssignmentService.createAssignment(payload),
    onSuccess: (data) => {
      // Invalidate assignment list query to refetch
      if (classId) {
        queryClient.invalidateQueries({ queryKey: ["admin-assignments", classId] });
      }
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError,
  });
};

export const useUpdateAssignment = (classId = null, assignmentId = null, onSuccess = null, onError = defaultError) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload) => AssignmentService.updateAssignment(payload),
    onSuccess: (data) => {
      // Invalidate assignment list query to refetch
      if (classId) {
        queryClient.invalidateQueries({ queryKey: ["admin-assignments", classId] });
      }
      // Invalidate the specific assignment query
      if (assignmentId) {
        queryClient.invalidateQueries({ queryKey: ["admin-assignment", assignmentId] });
      }
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError,
  });
};

export const useDeleteAssignment = (classId = null, onSuccess = null, onError = defaultError) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => AssignmentService.deleteAssignment(id),
    onSuccess: (data) => {
      // Invalidate assignment list query to refetch
      if (classId) {
        queryClient.invalidateQueries({ queryKey: ["admin-assignments", classId] });
      }
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError,
  });
};

