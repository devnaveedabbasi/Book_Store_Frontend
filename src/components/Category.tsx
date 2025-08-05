import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { GetAllCategory } from "../features/slicer/BookSlice";
import { baseUrlImg } from "../features/slicer/Slicer";
import { useNavigate } from "react-router-dom";

// Random color sets for categories
const colors = [
  { text: "text-purple-600", bg: "bg-purple-50 hover:bg-purple-100" },
  { text: "text-blue-600", bg: "bg-blue-50 hover:bg-blue-100" },
  { text: "text-pink-600", bg: "bg-pink-50 hover:bg-pink-100" },
  { text: "text-green-600", bg: "bg-green-50 hover:bg-green-100" },
  { text: "text-red-600", bg: "bg-red-50 hover:bg-red-100" },
  { text: "text-yellow-600", bg: "bg-yellow-50 hover:bg-yellow-100" },
];

export default function Category() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { AllCategory } = useSelector((state: any) => state.BookSlice);

  useEffect(() => {
    dispatch(GetAllCategory({}) as any);
  }, [dispatch]);

  const categories = AllCategory?.data || [];

  const handleCategoryClick = (name: string) => {
    setSelectedCategory(name === selectedCategory ? null : name);
  };

  return (
    <div className="px-4 sm:px-8 lg:px-16 py-12 bg-white">
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="mx-auto p-4 w-fit text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 ">
          Browse by Category
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Find your favorite genres and explore new reads.
        </p>
      </motion.div>

      <motion.div
        className="flex justify-end mb-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <motion.button
          onClick={() => navigate("/shop")}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl font-medium text-sm hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          View All Categories →
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.slice(0, 5).map((category: any, index: number) => {
          const colorSet = colors[index % colors.length];
          const isSelected = selectedCategory === category.name;

          return (
            <motion.button
              key={category._id}
              onClick={() => handleCategoryClick(category.name)}
              className={`${colorSet.bg} ${
                isSelected ? "ring-2 ring-purple-500 ring-offset-2" : ""
              } rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-md group`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={`${baseUrlImg}${category.icon}`} // Adjust path if needed
                  alt={category.name}
                  className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className={`font-semibold text-gray-900 text-sm mb-1`}>
                  {category.name}
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  {category.description || "Explore top books"}
                </p>
                <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
                  100+ books
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
