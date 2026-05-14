import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DashboardService from "../api/dashboardService";

const defaultError = (err) => {
  const message =
    err?.response?.data?.message || err?.message || "Request failed";
  toast.error(message);
};

export const useDashboardCounts = (onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["admin-dashboard-counts"],
    queryFn: () => DashboardService.getDashboardCounts(),
    onSuccess,
    onError,
  });
};

