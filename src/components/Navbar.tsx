import { useEffect, useState } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  User,
  Send,
  HandHelping,
  BookUser,
  BookPlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetUserDetails } from "../features/slicer/AuthSlice";
import Avatar from "./common/Avatar";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
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
  }, [UserData]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "My Requests", path: "/my-request" },
    { label: "My Listings", path: "/my-listings" },
    { label: "Messages", path: "/about" },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                BookStore
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                className={`text-sm font-medium transition-all duration-300 ${
                  location.pathname === path
                    ? "text-purple-600 font-semibold"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <BookPlus
              onClick={() => navigate("/add-book")}
              className="h-5 w-5 cursor-pointer text-purple-700 hover:text-purple-600 transition-all duration-300"
            />
            <BookUser
              onClick={() => navigate("/book-request")}
              className="h-5 w-5 cursor-pointer text-purple-700 hover:text-purple-600 transition-all duration-300"
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
              className="text-black p-2 transition-all"
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
                {navLinks.map(({ label, path }) => (
                  <Link
                    key={label}
                    to={path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-medium transition-all ${
                      location.pathname === path
                        ? "text-purple-600 font-semibold"
                        : "text-gray-800 hover:text-purple-600"
                    }`}
                  >
                    {label}
                  </Link>
                ))}

                {/* Mobile Icons */}
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
  );
}
