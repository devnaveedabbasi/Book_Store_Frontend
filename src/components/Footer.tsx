import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 text-gray-800 pt-12 pb-6 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + About */}
          <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-2">
              BookStore
            </h2>
            <p className="text-sm text-gray-600">
              Discover your next great read from our curated collection of
              top-rated books. We bring stories to life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-purple-600 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-600 transition">
                  Books
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-600 transition">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-600 transition">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Contact Us
            </h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <Phone size={16} /> +92 300 1234567
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} /> support@bookstore.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} /> Karachi, Pakistan
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="text-gray-600 hover:text-purple-600 transition"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t mt-10 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} BookStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
