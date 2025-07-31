import { BookOpen, Sparkles, Heart, Search, Zap } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";

// Type
interface Category {
  id: number;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
  count: number;
  description: string;
}

// Categories Data
const categories: Category[] = [
  {
    id: 1,
    name: "Fantasy Romance",
    icon: Sparkles,
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
    count: 245,
    description: "Magical love stories",
  },
  {
    id: 2,
    name: "Contemporary Fiction",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
    count: 189,
    description: "Modern literary works",
  },
  {
    id: 3,
    name: "Romance",
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-50 hover:bg-pink-100",
    count: 327,
    description: "Love and relationships",
  },
  {
    id: 4,
    name: "Mystery",
    icon: Search,
    color: "text-red-600",
    bgColor: "bg-red-50 hover:bg-red-100",
    count: 156,
    description: "Thrilling mysteries",
  },
  {
    id: 5,
    name: "Self-Help",
    icon: Zap,
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100",
    count: 198,
    description: "Personal development",
  },
];

export default function Category() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (name: string) => {
    setSelectedCategory(name === selectedCategory ? null : name);
  };

  return (
    <div className="px-4 sm:px-8 lg:px-16 py-12 bg-white">
      {/* Section Header Animation */}
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

      {/* View All Button Animation */}
      <motion.div
        className="flex justify-end mb-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <motion.button
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl font-medium text-sm hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          View All Categories →
        </motion.button>
      </motion.div>

      {/* Category Cards Animation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === category.name;

          return (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className={`${category.bgColor} ${
                isSelected ? "ring-2 ring-purple-500 ring-offset-2" : ""
              } rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-md group`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`${category.color} mb-3 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent size={32} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  {category.description}
                </p>
                <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
                  {category.count} books
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
