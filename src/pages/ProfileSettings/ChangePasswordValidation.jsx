import * as Yup from "yup";
let validationSchema = Yup.object({
  old_password: Yup.string(
    "admin.edit_password_validation_old_password_required"
  ).required("admin.edit_password_validation_old_password_required"),
  new_password: Yup.string("admin.edit_password_validation_password_required")
    .required("admin.edit_password_validation_password_required")
    .matches(
      /^(?=.*[A-Z])(?=.*?[a-z])(?=.*\d)(?=.*[#?!@$%^&*-])[A-Za-z\d#?!@$%^&*-]{8,}$/,
      "admin.edit_password_validation_password_valid"
    ),
  confirm_password: Yup.string(
    "admin.edit_password_validation_confirm_password_required"
  )
    .required("admin.edit_password_validation_confirm_password_required")
    .matches(
      /^(?=.*[A-Z])(?=.*?[a-z])(?=.*\d)(?=.*[#?!@$%^&*-])[A-Za-z\d#?!@$%^&*-]{8,}$/,
      "admin.edit_password_validation_confirm_password_valid"
    )
    .oneOf(
      [Yup.ref("new_password"), null],
      "admin.edit_password_validation_confirm_password_match"
    ),
});

export default validationSchema;
