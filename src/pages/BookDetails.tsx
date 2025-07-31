import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  MessageSquare,
  BookText,
  Calendar,
  Tag,
  User,
  Layers,
  DollarSign,
  Hash,
} from "lucide-react";
// import { books, BookType } from "../constant/data";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import RelatedAds from "../components/RelatedAds";
import PrimaryButton from "../components/common/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAllBooks,
  GetBookBySlug,
  GetRelatedBooks,
} from "../features/slicer/BookSlice";
import {
  CancelBookRequest,
  GetCheckRequst,
  AddBookRequest,
} from "../features/slicer/BookRequestSlice";
import { baseUrlImg } from "../features/slicer/Slicer";
import { format } from "date-fns";
import Loading from "../components/Loading";

export default function BookDetailsPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [book, setBook] = useState<any | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [showLoading, setShowLoading] = useState(true);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const { isLoading, AllReatedBooks } = useSelector(
    (state: any) => state.BookSlice
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      setShowLoading(true);
      const res = await dispatch(GetBookBySlug(slug) as any);
      setBook(res.payload.data);
      setShowLoading(false);
    };
    fetchBook();
  }, [dispatch, slug]);

  useEffect(() => {
    if (book && book._id) {
      dispatch(GetRelatedBooks(book._id) as any);
    }
    // Set main image to first image if available
    if (book && book.image && book.image.length > 0) {
      setMainImage(book.image[0]);
    }
  }, [book]);

  console.log(book);

  useEffect(() => {
    if (AllReatedBooks) {
      setRelatedBooks(AllReatedBooks.data);
    }
  }, [AllReatedBooks]);

  const chatWithSeller = (bookId: number) => {
    console.log(`Chat with seller for book ID: ${bookId}`);
    navigate("/chat");
  };

  const [loading, setLoading] = useState<Boolean>(false);
  const [isRequested, setIsRequested] = useState(false);
  useEffect(() => {
    const checkRequest = async () => {
      if (book && book._id) {
        const res = await dispatch(GetCheckRequst(book._id) as any);
        console.log("Payload:", res.payload);

        // ✅ Set state from payload
        setIsRequested(res.payload?.alreadyRequested === true);
      }
    };

    checkRequest();
  }, [book, dispatch]);

  const BookRequest = async (id) => {
    console.log("Book ID:", id);
    try {
      setLoading(true);
      if (isRequested) {
        await dispatch(CancelBookRequest(id) as any);
        setIsRequested(false); // Update UI instantly
      } else {
        await dispatch(AddBookRequest({ bookId: id }) as any);
        setIsRequested(true); // Update UI instantly
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (showLoading) {
    return <Loading />;
  }
  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-lg text-gray-600">
        Book not found.
        <br />
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    // You can customize this mapping as needed
    return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
  };

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "new":
        return "bg-emerald-500 text-white";
      case "like new":
        return "bg-blue-500 text-white";
      case "used":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side: Images */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-full max-w-md lg:max-w-none overflow-hidden rounded-lg shadow-lg border border-gray-200 bg-white">
              <img
                src={mainImage ? baseUrlImg + mainImage : "/placeholder.svg"}
                alt={book.title}
                className="w-full h-96 object-contain p-3 bg-gray-50"
              />
            </div>
            {/* Carousel Thumbnails */}
            <div className="w-full pt-4">
              <Carousel
                additionalTransfrom={0}
                arrows
                autoPlaySpeed={3000}
                centerMode={false}
                className=""
                containerClass="carousel-container"
                draggable
                infinite={false}
                keyBoardControl
                minimumTouchDrag={80}
                responsive={{
                  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
                  tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
                  mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
                }}
                showDots={false}
                slidesToSlide={1}
                swipeable
              >
                {(book.image || []).map((img: string, index: number) => (
                  <div
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`w-20 h-20 cursor-pointer rounded-md overflow-hidden border-2 ${
                      mainImage === img
                        ? "border-blue-500"
                        : "border-transparent"
                    } hover:border-blue-500 transition-colors bg-white`}
                  >
                    <img
                      src={baseUrlImg + img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-20 object-contain p-2"
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-2">
              <BookText className="w-7 h-7 text-blue-500" />
              {book.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-5 h-5" />
              <span className="font-medium">
                {book.author?.fullName || "Unknown"}
              </span>
            </div>
            {/* Category & Icon */}
            <div className="flex items-center gap-2">
              {book.category?.icon && (
                <img
                  src={baseUrlImg + book.category.icon}
                  alt="cat"
                  className="w-7 h-7 rounded-full border bg-white"
                />
              )}
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${getCategoryColor(
                  book.category?.name || ""
                )}`}
              >
                {book.category?.name}
              </span>
            </div>
            {/* Genre Badges */}
            <div className="flex flex-wrap gap-2">
              {book.genre?.map((g: string) => (
                <span
                  key={g}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {g}
                </span>
              ))}
            </div>
            {/* Condition, ProductType, Price */}
            <div className="flex flex-wrap gap-2 items-center">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${getConditionColor(
                  book.condition
                )}`}
              >
                {book.condition}
              </span>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                {book.productType === "sale"
                  ? "For Sale"
                  : book.productType.charAt(0).toUpperCase() +
                    book.productType.slice(1)}
              </span>
              <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                <DollarSign className="w-3 h-3" />
                {book.productType === "sale"
                  ? `Rs ${book.price}`
                  : book.productType === "free"
                  ? "Free"
                  : "Exchange"}
              </span>
            </div>
            {/* Location, Pages, Slug, CreatedAt */}
            <div className="flex flex-wrap gap-4 items-center text-gray-600 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {book.location}
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-4 h-4" />
                {book.pages} pages
              </span>

              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {book.createdAt
                  ? format(new Date(book.createdAt), "dd MMM yyyy")
                  : ""}
              </span>
            </div>
            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <BookText className="w-5 h-5 text-blue-500" />
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed text-base bg-gray-50 rounded p-4 border border-gray-100">
                {book.description}
              </p>
            </div>
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
              <PrimaryButton Icon={MessageSquare} className="w-[80%]">
                Chat With Seller
              </PrimaryButton>
              <button
                onClick={() => BookRequest(book._id)}
                disabled={loading}
                className={`flex-1 py-3 whitespace-nowrap px-4 text-lg border rounded-md flex justify-center items-center gap-2 transition duration-200 ${
                  isRequested
                    ? "bg-red-100 text-red-600 border-red-300 hover:bg-red-200"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                } ${loading ? "cursor-wait opacity-50" : ""}`}
              >
                <BookText className="w-5 h-5" />
                {loading
                  ? "Loading..."
                  : isRequested
                  ? "Cancel Request"
                  : "Book Request"}
              </button>
            </div>
          </div>
        </div>
        <RelatedAds relatedBooks={relatedBooks} />
      </div>
    </>
  );
}
