"use client";

import React from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import type { Book } from "../../pages/Shop";

interface FilterSidebarProps {
  books: Book[];
  filters: {
    search: string;
    categories: string[];
    conditions: string[];
    minPages: number;
    maxPages: number;
    minPrice?: number;
    maxPrice?: number;
    productType?: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function FilterSidebar({
  books,
  filters,
  onFilterChange,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = React.useState({
    categories: true,
    conditions: true,
    pages: true,
  });

  // Unique categories by id
  const uniqueCategories = Array.from(
    new Map(
      books.map((book) => [book.category?._id, book.category?.name])
    ).entries()
  ).map(([id, name]) => ({ id, name }));
  // Unique conditions
  const uniqueConditions = Array.from(
    new Set(books.map((book) => book.condition?.toLowerCase()))
  ).filter(Boolean);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    onFilterChange({ categories: newCategories });
  };

  const handleConditionChange = (condition: string) => {
    const newConditions = filters.conditions.includes(condition)
      ? filters.conditions.filter((c) => c !== condition)
      : [...filters.conditions, condition];
    onFilterChange({ conditions: newConditions });
  };

  const clearAllFilters = () => {
    onFilterChange({
      categories: [],
      conditions: [],
      minPages: 0,
      maxPages: 1000,
      minPrice: 0,
      maxPrice: 1000000,
      productType: "",
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.conditions.length > 0 ||
    filters.minPages > 0 ||
    (filters.maxPages !== undefined && filters.maxPages < 1000) ||
    (filters.minPrice !== undefined && filters.minPrice > 0) ||
    (filters.maxPrice !== undefined && filters.maxPrice < 1000000) ||
    (filters.productType && filters.productType !== "");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="space-y-6">
        {/* Categories Filter */}
        <div>
          <button
            onClick={() => toggleSection("categories")}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="font-medium text-gray-900">Categories</h4>
            {expandedSections.categories ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.categories && (
            <div className="mt-3 space-y-2">
              {uniqueCategories.map((cat) => (
                <label key={cat.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat.id)}
                    onChange={() => handleCategoryChange(cat.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{cat.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        {/* Condition Filter */}
        <div>
          <button
            onClick={() => toggleSection("conditions")}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="font-medium text-gray-900">Condition</h4>
            {expandedSections.conditions ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.conditions && (
            <div className="mt-3 space-y-2">
              {uniqueConditions.map((condition) => (
                <label key={condition} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.conditions.includes(condition)}
                    onChange={() => handleConditionChange(condition)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {condition}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
        {/* Pages Filter */}
        <div>
          <button
            onClick={() => toggleSection("pages")}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="font-medium text-gray-900">Pages</h4>
            {expandedSections.pages ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.pages && (
            <div className="mt-3 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Pages: {filters.minPages}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={filters.minPages}
                  onChange={(e) =>
                    onFilterChange({
                      minPages: Number.parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Pages: {filters.maxPages}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={filters.maxPages}
                  onChange={(e) =>
                    onFilterChange({
                      maxPages: Number.parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h5 className="text-sm font-medium text-gray-900 mb-3">
            Active Filters
          </h5>
          <div className="flex flex-wrap gap-2">
            {filters.categories.map((catId) => {
              const cat = uniqueCategories.find((c) => c.id === catId);
              return cat ? (
                <span
                  key={catId}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {cat.name}
                  <button
                    onClick={() => handleCategoryChange(catId)}
                    className="ml-1 hover:text-green-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : null;
            })}
            {filters.conditions.map((condition) => (
              <span
                key={condition}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                {condition}
                <button
                  onClick={() => handleConditionChange(condition)}
                  className="ml-1 hover:text-purple-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
