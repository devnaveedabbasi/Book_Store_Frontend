"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import BookCard from "../components/common/BookCard";
import FilterSidebar from "../components/common/FilterSidebar";
import Pagination from "../components/common/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { FilterAllBooks, GetAllBooks } from "../features/slicer/BookSlice";
import type { RootState, AppDispatch } from "../features/store/Store";
import Loading from "../components/Loading";

// Book type based on API response
export interface Book {
  _id: string;
  title: string;
  author: { _id: string; email: string } | null;
  genre?: string[];
  condition: string;
  productType?: string;
  price: number;
  description: string;
  pages: string;
  category: { _id: string; name: string; icon?: string };
  image: string[];
  location: string;
  createdAt: string;
  updatedAt: string;
  exchangeOrFree?: string;
  slug: string;
}

interface Filters {
  search: string;
  categories: string[]; // category ids
  conditions: string[];
  minPages: number;
  maxPages: number;
  minPrice: number;
  maxPrice: number;
  productType: string;
}

const defaultFilters: Filters = {
  search: "",
  categories: [],
  conditions: [],
  minPages: 0,
  maxPages: 1000,
  minPrice: 0,
  maxPrice: 1000000,
  productType: "",
};

// Fix debounce timer type for browser
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const booksPerPage = 6;

const BookShop: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { FilterBooks, isLoading, AllBooks } = useSelector(
    (state: RootState) => state.BookSlice
  );
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [total, setTotal] = useState(0);
  const [books, setBooks] = useState<Book[]>([]);

  // Only fetch filtered books, not all books
  // Remove GetAllBooks fetch

  // Debounced filter fetch
  const fetchBooks = useCallback(
    debounce((filters: Filters, page: number) => {
      const query: any = {
        search: filters.search,
        minPages: filters.minPages,
        maxPages: filters.maxPages,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        page,
        limit: booksPerPage,
      };
      if (filters.categories.length > 0) query.category = filters.categories[0];
      if (filters.conditions.length > 0)
        query.condition = filters.conditions[0];
      if (filters.productType) query.productType = filters.productType;
      dispatch(FilterAllBooks({ params: query }) as any);
    }, 400),
    [dispatch]
  );

  // Watch filters and page
  useEffect(() => {
    fetchBooks(filters, currentPage);
  }, [filters, currentPage, fetchBooks]);

  // Update books from redux
  useEffect(() => {
    // Defensive: support both array and object API responses
    if (FilterBooks && Array.isArray(FilterBooks)) {
      setBooks(FilterBooks as Book[]);
      setTotal((FilterBooks as Book[]).length);
    } else if (
      FilterBooks &&
      typeof FilterBooks === "object" &&
      "data" in FilterBooks &&
      FilterBooks.data
    ) {
      if (Array.isArray((FilterBooks as any).data)) {
        setBooks((FilterBooks as any).data);
        setTotal((FilterBooks as any).data.length);
      } else if (
        typeof (FilterBooks as any).data === "object" &&
        Array.isArray((FilterBooks as any).data.books)
      ) {
        setBooks((FilterBooks as any).data.books);
        setTotal(
          (FilterBooks as any).data.total ||
            (FilterBooks as any).data.books.length
        );
      }
    }
  }, [FilterBooks]);

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const toggleFavorite = (bookId: string) => {
    setFavorites((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const totalPages = Math.ceil(total / booksPerPage);

  return (
    <div className="min-h-screen">
      <header className="shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 py-4 sm:py-0">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">BookShop</h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full sm:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search books or authors..."
                  value={filters.search}
                  onChange={(e) =>
                    handleFilterChange({ search: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end sm:justify-start items-center">
              <div className="hidden sm:flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid" ? "bg-white shadow-sm" : ""
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list" ? "bg-white shadow-sm" : ""
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-full lg:w-80 flex-shrink-0`}
          >
            <FilterSidebar
              books={Array.isArray(books) ? books : []}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {total} Books Found
                </h2>
                <p className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * booksPerPage + 1}-
                  {Math.min(currentPage * booksPerPage, total)} of {total}{" "}
                  results
                </p>
              </div>
            </div>
            {isLoading ? (
              <Loading />
            ) : books.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-6"
                }
              >
                {books.map((book, index) => (
                  <div
                    key={book._id}
                    className={viewMode === "list" ? "w-full" : ""}
                  >
                    <BookCard
                      book={book}
                      index={index}
                      isFavorite={favorites.includes(book._id)}
                      onToggleFavorite={toggleFavorite}
                      viewMode={viewMode}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No books found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookShop;
