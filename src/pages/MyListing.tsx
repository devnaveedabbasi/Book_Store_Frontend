import React, { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Star,
  MapPin,
  BookOpen,
  Globe,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/common/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteBookById,
  GetAllBooksByUser,
} from "../features/slicer/BookSlice";
import { baseUrlImg } from "../features/slicer/Slicer";

export default function BookListingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetAllBooksByUser() as any);
  }, [dispatch]);

  const { AllUserBooks, isLoading } = useSelector(
    (state: any) => state.BookSlice
  );

  useEffect(() => {
    if (AllUserBooks) {
      setBooks(AllUserBooks.data);
    }
  }, [AllUserBooks]);

  const handleDelete = async (book: any) => {
    await dispatch(DeleteBookById({ id: book._id }) as any);
    await dispatch(GetAllBooksByUser() as any);
  };

  const navigate = useNavigate();
  const handleEdit = (book: any) => {
    console.log("Edit book:", book);
    navigate(`/update-book/${book.slug}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Book Listings</h1>

      {isLoading ? (
        <div className="text-center text-gray-600">Loading books...</div>
      ) : books?.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No books listed yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books?.map((book: any) => (
            <div
              key={book._id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <img
                src={
                  book?.image?.[0]
                    ? baseUrlImg + book.image[0]
                    : "/placeholder.jpg"
                }
                alt={book.title}
                className="w-full h-52 object-contain"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1">{book.title}</h2>
                <p className="text-gray-600 text-sm mb-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />{" "}
                  {book.location || "Unknown Location"}
                </p>
                <p className="text-gray-600 text-sm mb-2 flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> {book.pages || 0} pages
                </p>

                <div className="flex flex-wrap gap-1 mb-2">
                  {book.genre?.map((g: string, i: number) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <div className="text-sm text-gray-700 mb-3">
                  {book.description?.slice(0, 80)}...
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-600 capitalize">
                    {book.productType}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(book)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
