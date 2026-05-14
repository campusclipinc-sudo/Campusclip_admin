import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserService } from "../api/authService";

/**
 * Default error handler to display error messages using react-toastify.
 * @param {object} err - The error object from the mutation.
 */
const defaultError = (err) => {
  toast.error(err.response.data.message);
};

export const useUserLogin = (onSuccess, onError = defaultError) => {
  return useMutation({
    mutationFn: (data) => {
      return UserService.login(data);
    },
    onSuccess,
    onError,
  });
};

export const useUserRegister = (onSuccess, onError = defaultError) => {
  return useMutation({
    mutationFn: (data) => {
      return UserService.register(data);
    },
    onSuccess,
    onError,
  });
};

export const useGetProfile = (onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["profile-data"], // Query key
    queryFn: () => UserService.getProfile(), // Query function
    onSuccess, // Success callback
    onError, // Error callback
  });
};

export const useChangePassword = (onSuccess, onError = defaultError) => {
  return useMutation({
    mutationFn: (data) => {
      return UserService.changePassword(data);
    },
    onSuccess,
    onError,
  });
};

export const useEditProfile = (onSuccess, onError = defaultError) => {
  return useMutation({
    mutationFn: (data) => {
      return UserService.editProfile(data);
    },
    onSuccess,
    onError,
  });
};

export const useCountryCodes = (onSuccess, onError = defaultError) => {
  return useQuery({
    queryKey: ["country-codes"], // Query key
    queryFn: () => UserService.countryCodes(), // Query function
    onSuccess, // Success callback
    onError, // Error callback
  });
};
