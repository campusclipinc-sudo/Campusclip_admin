import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ClubService from "../api/clubService";

const defaultError = (err) => {
  const message =
    err?.response?.data?.message || err?.message || "Request failed";
  toast.error(message);
};

export const useListClubs = (params, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-clubs", params],
    queryFn: () => ClubService.listClubs(params),
    onSuccess,
    onError,
    keepPreviousData: true,
  });
};

export const useClub = (id, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-club", id],
    queryFn: () => ClubService.viewClub(id),
    enabled: !!id,
    onSuccess,
    onError,
  });
};

export const useEditClub = (onSuccess, onError = defaultError) => {
  return useMutation({
    mutationFn: ({ id, payload }) => ClubService.editClub(id, payload),
    onSuccess,
    onError,
  });
};

export const useDeleteClub = (onSuccess, onError = defaultError) => {
  return useMutation({
    mutationFn: (id) => ClubService.deleteClub(id),
    onSuccess,
    onError,
  });
};

export const useListCategories = (onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => ClubService.listCategories(),
    onSuccess,
    onError,
    keepPreviousData: true,
  });
};

export const useGetClubPosts = (id, params, options = {}, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-club-posts", id, params],
    queryFn: () => ClubService.getClubPosts(id, params),
    enabled: options.enabled !== undefined ? options.enabled : !!id,
    onSuccess,
    onError,
    keepPreviousData: true,
  });
};

export const useGetClubMembers = (id, params, options = {}, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-club-members", id, params],
    queryFn: () => ClubService.getClubMembers(id, params),
    enabled: options.enabled !== undefined ? options.enabled : !!id,
    onSuccess,
    onError,
    keepPreviousData: true,
  });
};

export const useGetClubEvents = (id, params, options = {}, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-club-events", id, params],
    queryFn: () => ClubService.getClubEvents(id, params),
    enabled: options.enabled !== undefined ? options.enabled : !!id,
    onSuccess,
    onError,
    keepPreviousData: true,
  });
};

export const useGetClubChatMessages = (id, params, onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-club-chat-messages", id, params],
    queryFn: () => ClubService.getClubChatMessages(id, params),
    onSuccess,
    onError,
    keepPreviousData: true,
  });
};

export const useSendClubChatMessage = (id, onSuccess, onError = defaultError) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload) => ClubService.sendClubChatMessage(id, payload),
    onSuccess: (data, variables) => {
      // Invalidate chat messages query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["admin-club-chat-messages", id],
      });
      if (onSuccess) onSuccess(data, variables);
    },
    onError,
  });
};