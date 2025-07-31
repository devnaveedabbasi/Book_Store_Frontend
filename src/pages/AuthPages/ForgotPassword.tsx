import React from "react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import PrimaryButton from "../../components/common/Button";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { email, z } from "zod";
import { useDispatch } from "react-redux";
import { ForgotPassword } from "../../features/slicer/AuthSlice";

// Define validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isEmailSent, setIsEmailSent] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState("");
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setSubmittedEmail(data.email);

    await dispatch(ForgotPassword({ email: data.email }) as any);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsEmailSent(true);
    setIsSubmitting(false);
  };

  const handleBackToLogin = () => {
    setIsEmailSent(false);
  };

  const handleResendEmail = async () => {
    setIsSubmitting(true);
    onSubmit(getValues());
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-14">
      {!isEmailSent ? (
        // Email Input Form
        <>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Forgot Password
            </h2>
            <p className="text-gray-600 text-sm">
              Enter your email address and we'll send you a link to reset your
              password
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-2.5 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <PrimaryButton
              disabled={isSubmitting}
              loading={isSubmitting}
              type="submit"
            >
              Send Reset Link
            </PrimaryButton>
          </form>

          {/* Back to Login Link */}
          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Sign In
            </Link>
          </div>
        </>
      ) : (
        // Success Message
        <>
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600 text-sm">
              We've sent a password reset link to
            </p>
            <p className="text-gray-800 font-medium text-sm mt-1">
              {submittedEmail}
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Didn't receive the email?</strong>
                <br />
                • Check your spam folder
                <br />
                • Make sure the email address is correct
                <br />• Try resending the email
              </p>
            </div>

            {/* Resend Email Button */}
            <PrimaryButton
              onClick={handleResendEmail}
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Resend Email
            </PrimaryButton>
          </div>

          {/* Back to Login Link */}
          <div className="mt-4 text-center">
            <Link
              to="/login"
              onClick={handleBackToLogin}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Sign In
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
