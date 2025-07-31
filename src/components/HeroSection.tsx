import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  User,
  BookPlus,
  BookUser,
} from "lucide-react";
import { Images } from "../assets/img";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "./common/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { GetUserDetails } from "../features/slicer/AuthSlice";
export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetUserDetails() as any);
  }, []);

  const { UserData, isLoading } = useSelector(
    (state: RootState) => state.AuthSlice
  );
  useEffect(() => {
    if (UserData) {
      setUser(UserData.data);
    }
    console.log(UserData);
  }, [UserData]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "My Requests", path: "/my-request" },
    { name: "My Listings", path: "/my-listings" },
    { name: "Messages", path: "/about" },
  ];
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                className={`text-2xl font-extrabold transition-all duration-300 ${
                  isScrolled
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                }`}
              >
                BookStore
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              {navLinks.map(({ name, path }) => (
                <Link
                  key={name}
                  to={path}
                  className={`text-sm font-medium transition-all duration-300 ${
                    isScrolled
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                      : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                  }`}
                >
                  {name}
                </Link>
              ))}
            </div>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <BookPlus
                onClick={() => navigate("/add-book")}
                className="h-5 w-5 cursor-pointer text-purple-600 hover:text-purple-600 transition-all duration-300"
              />
              <BookUser
                onClick={() => navigate("/book-request")}
                className="h-5 w-5 cursor-pointer text-purple-600 hover:text-purple-600 transition-all duration-300"
              />
              {user ? (
                <Avatar user={user} setUser={setUser} />
              ) : (
                <User
                  onClick={() => navigate("/sign-up")}
                  className="h-5 w-5 cursor-pointer text-purple-700  hover:text-purple-400 transition-all duration-300"
                />
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 transition duration-300 ${
                  isScrolled
                    ? "text-black"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                }`}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation with animation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="md:hidden rounded-md bg-white/95 backdrop-blur-md shadow-md px-4 py-6"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col space-y-4">
                  {navLinks.map(({ name, path }) => (
                    <Link
                      key={name}
                      to={path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-800 text-sm font-medium hover:text-purple-600 transition-all"
                    >
                      {name}
                    </Link>
                  ))}
                  <div className="flex items-center space-x-6 pt-4 border-t border-gray-300 mt-2">
                    <BookPlus
                      onClick={() => navigate("/add-book")}
                      className="h-5 w-5 cursor-pointer text-gray-800 hover:text-purple-600 transition-all duration-300"
                    />
                    <BookUser
                      onClick={() => navigate("/book-request")}
                      className="h-5 w-5 cursor-pointer text-gray-800 hover:text-purple-600 transition-all duration-300"
                    />
                    {user ? (
                      <Avatar user={user} setUser={setUser} />
                    ) : (
                      <User
                        onClick={() => navigate("/sign-up")}
                        className="h-5 w-5 cursor-pointer text-purple-700  hover:text-purple-400 transition-all duration-300"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-4">
            {/* Left Content */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold 
              "
              >
                Selection of the World's Best Sellers
              </h1>
              <p className="text-lg text-gray-700 max-w-md">
                Dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                sit aspernatur aut odit aut fugit, sed quia.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-xl"
              >
                Shop Now
              </motion.button>
            </motion.div>

            {/* Right Content */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <img
                src={Images.Decorimage01}
                alt=""
                className="absolute -top-4 -left-3 z-0"
              />
              <div className="relative z-10 top-10 left-10">
                <img
                  src={Images.BookHeroSection}
                  alt="Stack of bestselling books"
                  className="w-[80%] h-auto object-contain"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
