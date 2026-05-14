import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { SettingsService } from "../api/settingsService";

const defaultError = (err) => {
  const msg = err?.response?.data?.message || "Something went wrong";
  toast.error(msg);
};

export const useGetSettings = (onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => SettingsService.getSettings(),
    onSuccess,
    onError,
  });
};

export const useUpdateSettings = (onSuccess, onError = defaultError) => {
  return useMutation({
    mutationFn: (payload) => SettingsService.updateSettings(payload),
    onSuccess,
    onError,
  });
};

// export const useGetFrontLogo = (onSuccess, onError = defaultError) => {
//   return useQuery({
//     queryKey: ["front-logo"],
//     queryFn: () => SettingsService.getFrontLogo(),
//     onSuccess,
//     onError,
//   });
// };

// export const useUpdateFrontLogo = (callbacks = {}) => {
//   const { onSuccess, onError = defaultError } = callbacks;
//   return useMutation({
//     mutationFn: (file) => SettingsService.updateFrontLogo(file),
//     onSuccess: (...args) => {
//       toast.success("Logo updated");
//       // Invalidate and refetch
//       import("@tanstack/react-query").then(({ QueryClient }) => {
//         // no-op; App already has a single client; rely on component to refetch via query key revalidation on success if configured globally
//       });
//       onSuccess && onSuccess(...args);
//     },
//     onError,
//   });
// };
