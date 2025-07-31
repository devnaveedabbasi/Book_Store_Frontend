import React, { useState, useRef, useEffect, use } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PrimaryButton from "../../components/common/Button";
import { ResendOtp, VerifyOtp } from "../../features/slicer/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState<number>(0);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<Boolean>(false);
  const [countdown, setCountdown] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  const dispatch = useDispatch();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      const parsed = JSON.parse(data);
      setUserData(parsed);
      console.log(parsed, "userData");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      setActiveOtpIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Key handling
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveOtpIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveOtpIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      setActiveOtpIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Paste OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (pastedData.length === 6 && !isNaN(Number(pastedData))) {
      const pastedOtp = pastedData.split("");
      setOtp(pastedOtp);
      setActiveOtpIndex(5);
      inputRefs.current[5]?.focus();
    }
  };

  // ✅ API Call

  const handleSubmit = async () => {
    setIsLoading(true);
    const data = {
      email: userData?.email,
      otp: otp.join(""),
    };
    console.log(data);
    try {
      const result = await dispatch(VerifyOtp(data) as any);

      if (VerifyOtp.fulfilled.match(result)) {
        setIsVerified(true);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP simulation

  // 🟢 States

  // 🟢 Resend OTP Handler
  const handleResendOtp = async () => {
    if (!canResend || isSending) return;

    try {
      setIsSending(true);
      await dispatch(ResendOtp({ email: userData?.email }) as any);
      setCountdown(30);
      setCanResend(false);
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP");
    } finally {
      setIsSending(false);
    }
  };

  // 🟢 Countdown Effect
  useEffect(() => {
    let interval: any;

    if (!canResend && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    if (countdown === 0) {
      setCanResend(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [countdown, canResend]);
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="max-w-md w-full mx-auto mt-14 px-4 sm:px-6">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        {!isVerified ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                OTP Verification
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We've sent a 6-digit code to your email
                <span className="font-medium"> {userData?.email}</span>. Please
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((_, index) => (
                <input
                  key={index}
                  type="text"
                  ref={(el) => el && (inputRefs.current[index] = el)}
                  value={otp[index]}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  onClick={() => setActiveOtpIndex(index)}
                  className={`w-10 h-12 sm:w-12 sm:h-12 text-xl sm:text-2xl text-center border rounded-lg focus:outline-none transition-all ${
                    activeOtpIndex === index
                      ? "border-blue-500 ring-2 ring-blue-300"
                      : "border-gray-300"
                  }`}
                  maxLength={1}
                />
              ))}
            </div>

            {/* Verify Button */}
            <PrimaryButton
              onClick={handleSubmit}
              disabled={otp.join("").length !== 6 || isLoading}
              loading={isLoading}
              className="w-full"
            >
              Verify OTP
            </PrimaryButton>

            {/* Resend OTP */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Didn't receive code?{" "}
                {canResend ? (
                  <button
                    onClick={handleResendOtp}
                    className="text-blue-600 hover:underline font-medium"
                    disabled={isSending}
                  >
                    {isSending ? "Sending..." : "Resend OTP"}
                  </button>
                ) : (
                  <span className="text-gray-500">Resend in {countdown}s</span>
                )}
              </p>
            </div>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-blue-600 hover:underline font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </>
        ) : (
          // ✅ Success State
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Verification Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your email has been verified. You can now continue.
            </p>

            <PrimaryButton as={Link} to="/" className="w-full">
              Continue to Home Page
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpVerificationPage;
