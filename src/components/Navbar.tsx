import { useEffect, useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  User,
  Book,
  Plus,
  Send,
  Inbox,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetUserDetails } from "../features/slicer/AuthSlice";
import Avatar from "./common/Avatar";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState<any>(null);

  const { UserData } = useSelector((state: RootState) => state.AuthSlice);

  useEffect(() => {
    dispatch(GetUserDetails() as any);
  }, []);

  useEffect(() => {
    if (UserData) setUser(UserData.data);
  }, [UserData]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Messages", path: "/messages" },
    {
      label: "Books",
      hasDropdown: true,
      dropdownItems: [
        { label: "My Listing", path: "/my-listing", icon: Book },
        {
          label: "Received Book Request",
          path: "/received-book-request",
          icon: Inbox,
        },
        { label: "Sent Book Request", path: "/send-book-request", icon: Send },
        { label: "Add Book", path: "/add-book", icon: Plus },
      ],
    },
  ];

  const isActivePath = (path: string) => location.pathname === path;
  const isBookSectionActive = () =>
    ["/mylisting", "/receivedbookrequest", "/sendbookrequest", "/addbook"].some(
      (path) => location.pathname.startsWith(path)
    );

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
          >
            BookStore
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4 items-center">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                {link.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsBookDropdownOpen(true)}
                    onMouseLeave={() => setIsBookDropdownOpen(false)}
                  >
                    <button
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                        isBookSectionActive()
                          ? "text-purple-600 font-semibold"
                          : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:text-purple-600"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isBookDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg transition-all duration-200 z-50 ${
                        isBookDropdownOpen
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-2"
                      }`}
                    >
                      <div className="py-2">
                        {link.dropdownItems.map(
                          ({ label, path, icon: Icon }) => (
                            <Link
                              to={path}
                              key={label}
                              className={`flex items-center px-4 py-2 text-sm transition-all ${
                                isActivePath(path)
                                  ? "text-purple-600 bg-purple-50"
                                  : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:text-purple-600 hover:bg-gray-50"
                              }`}
                            >
                              <Icon className="w-4 h-4 mr-2 text-purple-400" />
                              {label}
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      isActivePath(link.path)
                        ? "text-purple-600 font-semibold"
                        : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:text-purple-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Avatar or SignUp */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Avatar user={user} setUser={setUser} />
            ) : (
              <button
                onClick={() => navigate("/sign-up")}
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:text-purple-600 transition-all duration-300"
              >
                <User className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:text-purple-600 p-2 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden rounded-md bg-white/95 shadow-md px-4 py-6"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) =>
                  link.hasDropdown ? (
                    <div key={link.label} className="space-y-1">
                      <button
                        className={`flex items-center w-full justify-between px-2 py-2 rounded-md text-base font-medium ${
                          isBookSectionActive()
                            ? "text-purple-600 font-semibold"
                            : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:text-purple-600"
                        } transition`}
                        onClick={() => setIsBookDropdownOpen((prev) => !prev)}
                      >
                        <span className="flex items-center">
                          {link.label}
                          <ChevronDown
                            className={`w-4 h-4 ml-1 transition-transform ${
                              isBookDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </span>
                      </button>
                      <AnimatePresence>
                        {isBookDropdownOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pl-4"
                          >
                            <div className="flex flex-col space-y-1 mt-1">
                              {link.dropdownItems.map(
                                ({ label, path, icon: Icon }) => (
                                  <Link
                                    to={path}
                                    key={label}
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      setIsBookDropdownOpen(false);
                                    }}
                                    className={`flex items-center px-2 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                      isActivePath(path)
                                        ? "text-purple-600 bg-purple-50"
                                        : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:text-purple-600 hover:bg-gray-50"
                                    }`}
                                  >
                                    <Icon className="w-4 h-4 mr-2 text-purple-400" />
                                    {label}
                                  </Link>
                                )
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-2 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                        isActivePath(link.path)
                          ? "text-purple-600 font-semibold"
                          : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:text-purple-600"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                )}

                <div className="flex items-center space-x-6 pt-4 border-t border-gray-300 mt-2">
                  {user ? (
                    <Avatar user={user} setUser={setUser} />
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate("/sign-up");
                      }}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:text-purple-600 transition-all duration-300"
                    >
                      <User className="h-5 w-5" />
                    </button>
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
