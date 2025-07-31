import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle, X } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PrimaryButton from "../../components/common/Button";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ResetPassword } from "../../features/slicer/AuthSlice";

// Define the form schema with Zod
const passwordResetSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const dispatch = useDispatch();

  console.log("Token from query param:", token);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (data: PasswordResetFormData) => {
    setIsSubmitting(true);

    const resetData = {
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
      token: token, // token from query param
    };

    try {
      const res = await dispatch(ResetPassword(resetData) as any); // 👈 dispatch asyncThunk
    } catch (error) {
      console.log("Reset error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    setIsPasswordReset(false);
    reset();
  };

  const checkPasswordRequirement = (regex: RegExp) => {
    return newPassword ? regex.test(newPassword) : false;
  };

  const passwordRequirements = [
    {
      text: "At least 8 characters",
      test: newPassword ? newPassword.length >= 8 : false,
    },
    {
      text: "One uppercase letter",
      test: checkPasswordRequirement(/[A-Z]/),
    },
    {
      text: "One lowercase letter",
      test: checkPasswordRequirement(/[a-z]/),
    },
    {
      text: "One number",
      test: checkPasswordRequirement(/\d/),
    },
    {
      text: "One special character",
      test: checkPasswordRequirement(/[!@#$%^&*(),.?":{}|<>]/),
    },
  ];

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-7">
      {!isPasswordReset ? (
        // Reset Password Form
        <>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-600 text-sm">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* New Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  {...register("newPassword")}
                  placeholder="Enter new password"
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.newPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword.newPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            {newPassword && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Password Requirements:
                </p>
                <div className="space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center text-sm">
                      {req.test ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span
                        className={req.test ? "text-green-600" : "text-red-600"}
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Confirm new password"
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword.confirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
              {confirmPassword && newPassword === confirmPassword && (
                <p className="mt-1 text-sm text-green-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <PrimaryButton
              type="submit"
              disabled={
                isSubmitting || passwordRequirements.some((req) => !req.test)
              }
              loading={isSubmitting}
            >
              Reset Password
            </PrimaryButton>
          </form>
        </>
      ) : (
        // Success Message
        <>
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Password Reset Successfully
            </h2>
            <p className="text-gray-600 text-sm">
              Your password has been reset successfully. You can now sign in
              with your new password.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>What's next?</strong>
                <br />
                • Use your new password to sign in
                <br />
                • Keep your password secure
                <br />• Consider enabling two-factor authentication
              </p>
            </div>

            {/* Back to Login Button */}
            <PrimaryButton onClick={handleBackToLogin}>
              Continue to Sign In
            </PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
};

export default ResetPasswordForm;
