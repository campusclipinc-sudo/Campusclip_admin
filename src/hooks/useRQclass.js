import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ClassService from "../api/classService";

const defaultError = (err) => {
  const message = err?.response?.data?.message || err?.message || "Request failed";
  toast.error(message);
};

export const useListClasses = (params, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-classes", params],
    queryFn: () => ClassService.listClasses(params),
    onSuccess,
    onError,
  });
};

export const useGetClassById = (id, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-class", id],
    queryFn: () => ClassService.getClassById(id),
    enabled: !!id,
    onSuccess,
    onError,
  });
};

export const useCreateClass = (onSuccess, onError = defaultError) => {
  return useMutation({
    mutationFn: (payload) => ClassService.createClass(payload),
    onSuccess,
    onError,
  });
};

export const useUpdateClass = (onSuccess, onError = defaultError) => {
  return useMutation({
    mutationFn: ({ id, payload }) => ClassService.updateClass(id, payload),
    onSuccess,
    onError,
  });
};

export const useDeleteClass = (onSuccess, onError = defaultError) => {
  return useMutation({
    mutationFn: (id) => ClassService.deleteClass(id),
    onSuccess,
    onError,
  });
};

export const useGetClassChatMessages = (id, params, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-class-chat-messages", id, params],
    queryFn: () => ClassService.getClassChatMessages(id, params),
    enabled: !!id,
    onSuccess,
    onError,
    keepPreviousData: true,
  });
};

export const useSendClassChatMessage = (id, onSuccess, onError = defaultError) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload) => ClassService.sendClassChatMessage(id, payload),
    onSuccess: (data, variables) => {
      // Invalidate chat messages query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["admin-class-chat-messages", id],
      });
      if (onSuccess) onSuccess(data, variables);
    },
    onError,
  });
};

export const useGetClassMembers = (id, params, options = {}, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-class-members", id, params],
    queryFn: () => ClassService.getClassMembers(id, params),
    enabled: options.enabled !== undefined ? options.enabled : !!id,
    onSuccess,
    onError,
    keepPreviousData: true,
  });
};
