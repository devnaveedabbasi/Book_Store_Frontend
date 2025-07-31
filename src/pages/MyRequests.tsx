import { useState, useEffect } from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  Book,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetSendRequest,
  GetUserBookRequest,
  PaginatedRequests,
  SearchAllRequests,
} from "../features/slicer/BookRequestSlice";
import type { RootState } from "../features/store/Store";
import { baseUrlImg } from "../features/slicer/Slicer";

// API response structure:
// {
//   _id, book: { _id, title }, requester: { _id, fullName }, owner: { _id, fullName }, status, createdAt, updatedAt
// }

interface BookRequest {
  _id: string;
  book: {
    _id: string;
    title: string;
  };
  requester: {
    _id: string;
    fullName: string;
  };
  owner: {
    _id: string;
    fullName: string;
  };
  status: "pending" | "approved" | "rejected" | "completed" | string;
  createdAt: string;
  updatedAt: string;
}

const BookRequestsPage = () => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");

  // Sorting and search are not implemented for API data yet
  // const [sortField, setSortField] = useState<keyof BookRequest>("requestTime");
  // const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  const [AllRequests, setAllRequests] = useState<BookRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<BookRequest | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(GetSendRequest() as any);
  }, []);
  const { AllSendRequest, isLoading } = useSelector(
    (state: any) => state.BookRequestSlice
  );

  useEffect(() => {
    if (AllSendRequest?.data?.requests) {
      setAllRequests(AllSendRequest.data.requests);
    } else {
      setAllRequests([]);
    }
  }, [AllSendRequest]);

  // Search filter
  const filteredRequests = AllRequests.filter((request) => {
    const term = searchTerm.toLowerCase();
    return (
      request.book?.title?.toLowerCase().includes(term) ||
      request.book?.author?.fullName?.toLowerCase().includes(term) ||
      request.status?.toLowerCase().includes(term)
    );
  });

  // Status badge
  const StatusBadge = ({ status }: { status: string }) => {
    const baseClasses =
      "px-3 py-1 rounded-full text-xs text-center font-semibold flex items-center w-20";
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            Pending
          </span>
        );
      case "approved":
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            Rejected
          </span>
        );
      case "completed":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Completed
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            {status}
          </span>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        My Book Requests
      </h1>
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          className="w-full max-w-xs border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by title, author, or status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No requests found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={baseUrlImg + request.book.image?.[0]}
                      alt={request.book?.title}
                      className="h-12 w-10 object-contain rounded shadow"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {request.book?.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {request.book?.author?.fullName || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {request.book?.productType || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {StatusBadge({ status: request.status })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lefr">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold shadow"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowModal(true);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for request details */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2">
              {selectedRequest.book?.title}
            </h2>
            <div className="mb-2 text-gray-700">
              By {selectedRequest.book?.author?.fullName || "Unknown"}
            </div>
            <img
              src={baseUrlImg + selectedRequest.book.image?.[0]}
              alt={selectedRequest.book?.title}
              className="h-32 object-contain mx-auto mb-4"
            />
            <div className="mb-2 flex gap-2">
              <strong>Status:</strong>{" "}
              {StatusBadge({ status: selectedRequest.status })}
            </div>
            <div className="mb-2">
              <strong>Condition:</strong> {selectedRequest.book?.condition}
            </div>
            <div className="mb-2">
              <strong>Product Type:</strong> {selectedRequest.book?.productType}
            </div>
            <div className="mb-2">
              <strong>Location:</strong> {selectedRequest.book?.location}
            </div>
            <div className="mb-2">
              <strong>Category:</strong> {selectedRequest.book?.category?.name}
            </div>
            <div className="mb-2">
              <strong>Price:</strong> {selectedRequest.book?.price}
            </div>
            <div className="mb-2">
              <strong>Description:</strong> {selectedRequest.book?.description}
            </div>
            <div className="mb-2">
              <strong>Requested On:</strong>{" "}
              {new Date(selectedRequest.createdAt).toLocaleString()}
            </div>
            <div className="mb-2">
              <strong>Requester:</strong> {selectedRequest.requester?.fullName}
            </div>
            <div className="mb-2">
              <strong>Owner:</strong> {selectedRequest.owner?.fullName}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRequestsPage;
