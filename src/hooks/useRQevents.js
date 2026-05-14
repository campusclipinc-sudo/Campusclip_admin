import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import EventsService from "../api/eventsService";

const defaultError = (err) => {
    const message =
      err?.response?.data?.message || err?.message || "Request failed";
    toast.error(message);
  };

export const useEvents = (params, onSuccess, onError = defaultError) => {
    return useQuery({
        queryKey: ["admin-events", params],
        queryFn: () => EventsService.list(params),
        onSuccess,
        onError,
        keepPreviousData: true,
    });
};

export const useEventDetails = (id, options = {}) => {
    return useQuery({
        queryKey: ["admin-event-details", id],
        queryFn: () => EventsService.view(id),
        enabled: !!id && (options.enabled !== false),
        ...options,
    });
};

export const useEventAttendees = (id, params, options = {}) => {
    return useQuery({
        queryKey: ["admin-event-attendees", id, params],
        queryFn: () => EventsService.getAttendees(id, params),
        enabled: !!id && (options.enabled !== false),
        keepPreviousData: true,
        ...options,
    });
};

export const useAttendEvent = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id) => EventsService.attend(id),
        onSuccess: (data, id) => {
            toast.success(data?.message || "Successfully registered for event");
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ["admin-event-attendees", id] });
            queryClient.invalidateQueries({ queryKey: ["admin-event-details", id] });
        },
        onError: (err) => {
            const message = err?.response?.data?.message || err?.message || "Failed to attend event";
            toast.error(message);
        },
    });
};

export const useEventTransactionHistory = (params, onSuccess, onError = defaultError) => {
    return useQuery({
        queryKey: ["admin-event-transaction-history", params],
        queryFn: () => EventsService.getTransactionHistory(params),
        onSuccess,
        onError,
        keepPreviousData: true,
    });
};