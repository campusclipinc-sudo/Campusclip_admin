import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import FeedService from "../api/feedService";

const defaultError = (err) => {
  const message =
    err?.response?.data?.message || err?.message || "Request failed";
  toast.error(message);
};

const defaultSuccess = (message) => {
  toast.success(message || "Operation completed successfully");
};

export const useFeed = (params, enabled = true, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-feed", params],
    queryFn: () => FeedService.listFeed(params),
    enabled,
    onSuccess,
    onError,
    keepPreviousData: true,
  });
};

export const useUpdatePostStatus = (onSuccess, onError = defaultError) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, status }) => FeedService.updatePostStatus(postId, status),
    onSuccess: (data, variables) => {
      const { status } = variables;
      const message = status === "approved" 
        ? "Post approved successfully" 
        : status === "rejected" 
        ? "Post removed successfully" 
        : "Post status updated successfully";
      defaultSuccess(message);
      queryClient.invalidateQueries({ queryKey: ["admin-feed"] });
      if (onSuccess) onSuccess(data, variables);
    },
    onError,
  });
};

export const useWarnUser = (onSuccess, onError = defaultError) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId, ...payload }) =>
      FeedService.warnUser(postId, userId, payload),
    onSuccess: (data, variables) => {
      defaultSuccess("User warned successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-feed"] });
      if (onSuccess) onSuccess(data, variables);
    },
    onError,
  });
};

export const useBlockUser = (onSuccess, onError = defaultError) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => FeedService.blockUser(userId),
    onSuccess: (data, userId) => {
      defaultSuccess("User blocked successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-feed"] });
      if (onSuccess) onSuccess(data, userId);
    },
    onError,
  });
};

