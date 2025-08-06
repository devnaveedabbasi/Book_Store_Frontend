import { useState, useEffect } from "react";
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
import { Images } from "../assets/img";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Avatar from "./common/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { GetUserDetails } from "../features/slicer/AuthSlice";
export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
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

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <Avatar user={user} setUser={setUser} />
              ) : (
                <button
                  onClick={() => navigate("/sign-up")}
                  className="text-purple-500 hover:text-purple-600 transition-all duration-300"
                >
                  <User className="h-5 w-5" />
                </button>
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
                        className="text-blue-600 hover:text-purple-600 transition-all duration-300"
                      >
                        sd
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
                className="text-4xl md:text-5xl lg:text-6xl font-bold  text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
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
