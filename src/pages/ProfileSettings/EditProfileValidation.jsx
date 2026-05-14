import Yup from "../../helpers/customValidation";

let validationSchema = Yup.object({
  full_name: Yup.string("admin.edit_user_profile_full_name_validation_required")
    .required("admin.edit_user_profile_full_name_validation_required")
    .trim("admin.edit_user_profile_full_name_validation_required"),

  phone_number: Yup.string("admin.edit_user_profile_phone_validation_required")
    .required("admin.edit_user_profile_phone_validation_required")
    .phoneCheck("admin.edit_user_profile_phone_validation_match"),

  country_code_id: Yup.number(
    "admin.edit_user_profile_country_code_validation_required",
  ).required("admin.edit_user_profile_country_code_validation_required"),

  email: Yup.string("admin.edit_user_profile_email_validation_required")
    .required("admin.edit_user_profile_email_validation_required")
    .trim("admin.edit_user_profile_email_validation_required")
    .email("admin.edit_user_profile_valid_email_validation"),
});

export { validationSchema };
