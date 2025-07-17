// Re-export auth validations from the main validation file
export {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  changePasswordSchema,
  emailSchema,
  passwordSchema,
  usernameSchema,
} from "./index";

export type {
  LoginFormData,
  SignupFormData,
  ResetPasswordFormData,
  ChangePasswordFormData,
} from "./index";
