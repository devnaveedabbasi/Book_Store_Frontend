"use client";

import React from "react";
import { Heart, MapPin, BookOpen, Eye, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Book } from "../../pages/Shop";
import { baseUrlImg } from "../../features/slicer/Slicer";

interface BookCardProps {
  book: Book;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (bookId: string) => void;
  viewMode: "grid" | "list";
}

export default function BookCard({
  book,
  isFavorite,
  onToggleFavorite,
  viewMode,
}: BookCardProps) {
  const getCategoryColor = (category: string) => {
    // You can customize this mapping as needed
    return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
  };

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "new":
        return "bg-emerald-500 text-white";
      case "like new":
        return "bg-blue-500 text-white";
      case "used":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const navigate = useNavigate();
  const authorName = book.author || "";
  const uploaderName = book.uploader?.fullName || "";
  const categoryName = book.category?.name || "";
  const imageUrl =
    book.image && book.image.length > 0 ? book.image[0] : "/placeholder.svg";

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="flex">
          {/* Image */}
          <div className="relative w-32 h-48 flex-shrink-0">
            <img
              src={baseUrlImg + imageUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
                  categoryName
                )}`}
              >
                {categoryName}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {book.title}
                </h3>
                <p className="text-gray-600 mb-2">by {authorName}</p>

                {/* No rating/reviews in API, so skip */}

                <p className="text-gray-700 mb-3 line-clamp-2">
                  {book.description}
                </p>

                {/* Details */}
                <div className="flex items-center text-sm text-gray-500 gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{book.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{book.pages} pages</span>
                  </div>
                </div>
              </div>

              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  Rs {book.price}
                </div>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getConditionColor(
                    book.condition
                  )}`}
                >
                  {book.condition}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <button
                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => navigate(`/book/${book.slug}`)}
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden group hover:shadow-2xl hover:scale-[1.03] transition-all duration-300">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          onClick={() => navigate(`/book/${book.slug}`)}
          src={baseUrlImg + imageUrl}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full shadow ${getCategoryColor(
              categoryName
            )}`}
          >
            {categoryName}
          </span>
        </div>
        {/* Price badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 text-sm font-bold bg-white text-gray-900 rounded-full shadow">
            Rs {book.price}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Author */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4">Writer {authorName}</p>
          <p className="text-sm text-gray-600">Upload by {uploaderName}</p>
        </div>

        {/* Location + Pages */}
        <div className="flex items-center text-sm text-gray-500 gap-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{book.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{book.pages} pages</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-2">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${getConditionColor(
              book.condition
            )}`}
          >
            {book.condition}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/book/${book.slug}`)}
              className="flex items-center gap-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
