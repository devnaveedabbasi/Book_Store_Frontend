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
  GetUserBookRequest,
  PaginatedRequests,
  UpdateStatusRequest,
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
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Sorting and search are not implemented for API data yet
  // const [sortField, setSortField] = useState<keyof BookRequest>("requestTime");
  // const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  const [AllRequests, setAllRequests] = useState<BookRequest[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch paginated requests from API (with status filter)
  const fetchPaginated = async (
    page = 1,
    limit = requestsPerPage,
    status = ""
  ) => {
    setIsLoading(true);
    const params: any = { page, limit };
    if (status) params.status = status;
    const res = await dispatch(PaginatedRequests(params) as any);
    console.log("Paginated API response:", res);
    if (res?.payload?.data) {
      // Handle paginated response shape
      const books = res.payload.data.requests || [];
      setAllRequests(books);
      setTotalPages(res.payload.data.totalPages || 1);
      setTotalResults(res.payload.data.totalItems || books.length || 0);
    } else {
      setAllRequests([]);
      setTotalPages(1);
      setTotalResults(0);
    }
    setIsLoading(false);
  };

  // Fetch search results from API
  const fetchSearch = async (query: string) => {
    setIsLoading(true);
    const res = await dispatch(SearchAllRequests(query) as any);
    console.log("Search API response:", res);
    if (res?.payload?.data) {
      // Handle search response shape (array)
      setAllRequests(res.payload.data);
      setTotalPages(1);
      setTotalResults(res.payload.data.length);
    } else {
      setAllRequests([]);
      setTotalPages(1);
      setTotalResults(0);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchPaginated(currentPage, requestsPerPage, statusFilter);
    } else {
      fetchSearch(searchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, currentPage, statusFilter]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Sorting (client-side for now)
  const sortedRequests = [...AllRequests].sort((a, b) => {
    if (sortField === "createdAt") {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    if (sortField === "requester") {
      const nameA = a.requester?.fullName?.toLowerCase() || "";
      const nameB = b.requester?.fullName?.toLowerCase() || "";
      if (nameA < nameB) return sortDirection === "asc" ? -1 : 1;
      if (nameA > nameB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  // Status badge for API status
  const StatusBadge = ({ status }: { status: string }) => {
    const baseClasses =
      "px-2 py-1 rounded-full text-xs font-semibold flex items-center";
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </span>
        );
      case "completed":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle2 className="h-3 w-3 mr-1" />
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
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            Recived Requests
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            {/* Status Filter */}

            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400 h-4 w-4" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search books or authors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Book
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Requester Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Requester Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Condition
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Request Time
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : sortedRequests.length > 0 ? (
                sortedRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={
                          baseUrlImg + request?.book?.image[0] ||
                          "/placeholder.svg"
                        }
                        className="w-10 h-10 object-cover rounded-full"
                        alt=""
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request?.book.title || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {request.requester?.fullName || "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {request.requester?.email || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {" "}
                        {request.book?.condition || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {request.createdAt
                          ? new Date(request.createdAt).toLocaleDateString()
                          : "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <select
                        className={`border rounded-lg px-3 py-2 text-sm transition-all duration-200 
      focus:outline-none focus:ring-2 focus:ring-blue-500 
      disabled:opacity-60 disabled:cursor-not-allowed
      ${
        request.status === "approved"
          ? "bg-green-100 text-green-700 border-green-300"
          : request.status === "rejected"
          ? "bg-red-100 text-red-700 border-red-300"
          : "bg-yellow-100 text-yellow-700 border-yellow-300"
      }`}
                        value={request.status}
                        disabled={isLoading}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          const status = { status: newStatus };
                          setIsLoading(true);
                          await dispatch(
                            UpdateStatusRequest({
                              id: request._id,
                              status: status,
                            }) as any
                          );
                          if (searchTerm.trim() === "") {
                            fetchPaginated(
                              currentPage,
                              requestsPerPage,
                              statusFilter
                            );
                          } else {
                            fetchSearch(searchTerm);
                          }
                          setIsLoading(false);
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No book requests found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing {AllRequests.length > 0 ? 1 : 0} to {AllRequests.length}{" "}
                of {totalResults} results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">First</span>«
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>‹
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>›
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Last</span>»
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRequestsPage;
