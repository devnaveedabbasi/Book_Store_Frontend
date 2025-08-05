"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookCard from "./common/BookCard";
import { useDispatch, useSelector } from "react-redux";
import { GetAllBooks } from "../features/slicer/BookSlice";
import type { Book } from "../pages/Shop";
import { GetUserDetails } from "../features/slicer/AuthSlice";
import { useNavigate } from "react-router-dom";

const BestsellingBooksCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(4);
  const [isHovered, setIsHovered] = useState(false);
  const [books, setBooks] = React.useState<Book[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<any>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { UserData } = useSelector((state: any) => state.AuthSlice);

  useEffect(() => {
    dispatch(GetUserDetails() as any);
  }, []);

  useEffect(() => {
    if (UserData) setCurrentUserId(UserData.data._id);
  }, [UserData]);

  useEffect(() => {
    dispatch(GetAllBooks({}) as any);
  }, [dispatch]);

  const { AllBooks, isBookAdded } = useSelector(
    (state: any) => state.BookSlice
  );

  useEffect(() => {
    if (AllBooks) {
      setBooks(AllBooks.data);
    }
  }, [AllBooks, isBookAdded]);

  const filteredBooks =
    books && Array.isArray(books)
      ? currentUserId
        ? books.filter((book) => book?.uploader?._id !== currentUserId)
        : books
      : [];

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(1);
      } else if (window.innerWidth < 768) {
        setItemsPerSlide(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(3);
      } else {
        setItemsPerSlide(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    if (!isHovered && filteredBooks.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          const maxSlides = Math.max(0, filteredBooks.length - itemsPerSlide);
          return prev >= maxSlides ? 0 : prev + 1;
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [itemsPerSlide, isHovered, filteredBooks]);

  const maxSlides = Math.max(0, filteredBooks.length - itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlides : prev - 1));
  };

  const toggleFavorite = async (bookId: string) => {
    setFavorites((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  if (filteredBooks.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-600">No Books Found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 ">
      {/* Header */}
      <motion.div
        className="text-center mb-12 px-4"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Heading */}
        <h1 className="mx-auto p-2 w-fit text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          Book Listing
        </h1>

        {/* Subheading */}
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          Discover captivating stories and life-changing books from passionate
          readers across Pakistan.
        </p>

        {/* Gradient Underline */}
        <motion.div
          className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </motion.div>

      {/* Carousel */}
      <motion.div
        className="relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="overflow-hidden">
          <motion.div
            className="flex transition-transform duration-800 ease-out"
            style={{
              transform: `translateX(-${
                currentSlide * (100 / itemsPerSlide)
              }%)`,
            }}
            layout
          >
            {filteredBooks.map((book, index) => (
              <div
                key={book._id}
                className="flex-shrink-0 px-4"
                style={{ width: `${100 / itemsPerSlide}%` }}
              >
                <BookCard
                  book={book}
                  index={index}
                  isFavorite={favorites.includes(book._id)}
                  onToggleFavorite={toggleFavorite}
                  viewMode="grid"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <motion.button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 text-gray-700 hover:text-blue-600 border border-gray-200 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <ChevronLeft size={28} />
        </motion.button>

        <motion.button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 text-gray-700 hover:text-blue-600 border border-gray-200 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <ChevronRight size={28} />
        </motion.button>
      </motion.div>

      {/* Slide Indicators */}
      <motion.div
        className="flex justify-center mt-10 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        {Array.from({ length: maxSlides + 1 }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-10 h-3 bg-gradient-to-r from-blue-500 to-purple-500"
                : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </motion.div>

      {/* View All Button */}
      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        <motion.button
          onClick={() => navigate("/shop")}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-xl hover:shadow-2xl"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          View All Books →
        </motion.button>
      </motion.div>
    </div>
  );
};

export default BestsellingBooksCarousel;
