import { useLocation } from "react-router-dom";

export default function PageHeader() {
  const location = useLocation();
  const pathname = location.pathname;

  const pathParts = pathname.split("/").filter(Boolean);

  const formattedPath = pathParts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" / ");

  return (
    <div className="px-4 sm:px-6 lg:px-16 py-4 shadow-sm bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b mt-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 break-words">
          {formattedPath || "Home"}
        </h2>
        <p className="text-sm text-gray-500 break-all">
          /{pathParts.join("/")}
        </p>
      </div>
    </div>
  );
}
