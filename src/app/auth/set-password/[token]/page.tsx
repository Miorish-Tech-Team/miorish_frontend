"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { authAPI } from "@/services/authService";
import toast from "react-hot-toast";
import CandleLoader from "@/components/CandleLoader";
import Image from "next/image";
function SetPasswordForm() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        toast.error("Invalid reset link");
        router.push("/");
        return;
      }

      try {
        setIsValidating(true);
        // Assuming validation happens on the server or during submission
        setIsTokenValid(true);
      } catch (error) {
        toast.error("Invalid or expired reset link");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.resetPasswordFromUrl(token, formData.password);
      setIsReset(true);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error.response?.data?.message || "Failed to reset password";
      toast.error(errorMessage);

      if (
        errorMessage.toLowerCase().includes("expired") ||
        errorMessage.toLowerCase().includes("invalid")
      ) {
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isValidating) {
    return <CandleLoader />;
  }

  // Error State: Invalid Token UI
  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-12 relative">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Link
            </h1>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link
              href="/auth/forgot-password"
              className="inline-block bg-accent text-white px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-all font-medium"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen relative flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <Image
          src="/icon.jpg"
          alt="Background"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>
      {/* Dark Overlay with Blur */}

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10">
          {!isReset ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Set New Password
                </h1>
                <p className="text-sm md:text-base text-gray-500">
                  Create a strong password for your account
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password Input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 placeholder:text-gray-400"
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-400">
                    Must be at least 6 characters long
                  </p>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 placeholder:text-gray-400"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent text-white py-3 rounded-xl font-bold text-base hover:brightness-110 transition-all shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading && <Loader2 size={20} className="animate-spin" />}
                  {isLoading ? "Updating..." : "Reset Password"}
                </button>
              </form>

              {/* Back to Login */}
              <p className="mt-8 text-center text-sm text-gray-500">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="text-accent font-bold hover:underline transition-all"
                >
                  Sign In
                </Link>
              </p>
            </>
          ) : (
            /* Success Message View */
            <div className="text-center py-4">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle size={48} className="text-green-500" />
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Password Reset!
              </h1>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Your password has been successfully reset. <br />
                Now you can login with your new password.
              </p>
              <Link
                href="/"
                className="inline-block w-full bg-accent text-white py-3 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg"
              >
                Go to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<CandleLoader />}>
      <SetPasswordForm />
    </Suspense>
  );
}
