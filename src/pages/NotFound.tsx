import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Icon */}
      <div className="bg-red-100 text-red-600 p-4 rounded-full mb-6 animate-bounce">
        <AlertTriangle className="h-10 w-10" />
      </div>

      {/* Heading */}
      <h1 className="text-5xl font-extrabold text-gray-800 mb-4">404</h1>

      {/* Subheading */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-gray-500 text-center max-w-md mb-6">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* Back to Home Button */}
      <Link
        to="/"
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
