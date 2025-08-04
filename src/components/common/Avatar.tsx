import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearUserData, SignOut } from "../../features/slicer/AuthSlice";
import { useNavigate } from "react-router-dom";

interface User {
  fullName: string;
  email: string;
}

interface AvatarDropdownProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

export default function Avatar({ user, setUser }: AvatarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(SignOut() as any).unwrap();
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsOpen(false);
      dispatch(clearUserData());

      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className="w-10 h-10 rounded-full border-2 border-gray-300 hover:scale-105 transition-transform duration-200 bg-purple-400 text-white flex items-center justify-center cursor-pointer select-none"
      >
        {user?.fullName?.charAt(0).toUpperCase()}
      </div>

      {isOpen && (
        <div className="absolute md:right-0  mt-3 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 animate-fade-in">
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.fullName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300">
              {user.email}
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700"></div>
          <button
            onClick={() => handleLogout()}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 dark:text-red-400 transition"
          >
            🔒 Log out
          </button>
        </div>
      )}
    </div>
  );
}
