import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Input } from "../components/common/Input";
import { SelectDropdown } from "../components/common/DropdownSelect";
import { Plus, Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  AddBooks,
  GetAllBooks,
  GetAllBooksByUser,
  GetAllCategory,
  UpdateBook,
} from "../features/slicer/BookSlice";
import { useParams } from "react-router-dom";
import { baseUrlImg } from "../features/slicer/Slicer";

// Define the form schema using Zod
const bookSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(100),
    genre: z.array(z.string()).min(1, "At least one genre is required").max(5),
    author: z.string().min(1, "Author is required").max(100),
    condition: z.string().min(1, "Please select condition"),
    pages: z.string(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    location: z.string().min(1, "Location is required"),
    productType: z.enum(["exchange", "free", "sale"]),
    categoryId: z.string().min(1, "Please select category"),
    price: z.string(),
  })
  .refine((data) => data.productType !== "sale" || data.price, {
    message: "Price is required for sale items",
    path: ["price"],
  });

type FormData = z.infer<typeof bookSchema>;

interface DropdownOption {
  id: string;
  name: string;
  icon?: string;
}

interface ImageFile {
  file: File | undefined;
  preview: string;
  id: string;
}

const conditions = [
  { id: "new", name: "New" },
  { id: "used", name: "Used" },
];

const productTypes = [
  { id: "exchange", name: "exchange" },
  { id: "free", name: "free" },
  { id: "sale", name: "For Sale" },
];

const popularGenres = [
  "Fantasy",
  "Mystery",
  "Romance",
  "Thriller",
  "Biography",
  "Self-Help",
  "Science Fiction",
];

export default function AddBook() {
  const [categories, setCategories] = useState<any[]>([]);
  const [genreInput, setGenreInput] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    author: "",
    genre: [],
    condition: "",
    description: ".",
    location: "Karachi, Pakistan",
    productType: "sale",
    categoryId: "",
    price: "",
    pages: "",
  });

  const { slug } = useParams(); // Use slug instead of id

  const { AllUserBooks, isLoading } = useSelector(
    (state: any) => state.BookSlice
  );

  useEffect(() => {
    dispatch(GetAllBooksByUser({}) as any);
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && AllUserBooks?.data?.length > 0 && slug) {
      const foundBook = AllUserBooks.data.find(
        (book: any) => book.slug === slug
      );
      if (foundBook) {
        // Prepare images for preview
        const backendImages = (foundBook.image || []).map((imgUrl: string) => ({
          file: undefined,
          preview: baseUrlImg + imgUrl,
          id: imgUrl,
        }));
        setFormData({
          title: foundBook.title || "",
          genre: foundBook.genre || [],
          author: foundBook.author || "",
          condition: foundBook.condition || "",
          description: foundBook.description || "",
          location: foundBook.location || "",
          productType: foundBook.productType || "exchange",
          categoryId: foundBook.category?._id || "",
          price: foundBook.price ? String(foundBook.price) : "",
          pages: foundBook.pages || "",
        });
        setImages(backendImages);
      } else {
        console.log("❌ Book not found with slug:", slug);
      }
    }
  }, [AllUserBooks, isLoading, slug]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    dispatch(GetAllCategory({}) as any);
  }, [dispatch]);

  const { AllCategory } = useSelector((state: any) => state.BookSlice);
  useEffect(() => {
    if (AllCategory) {
      setCategories(AllCategory.data);
    }
  }, [AllCategory]);

  const handleAddGenre = () => {
    if (genreInput.trim() && !formData.genre.includes(genreInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        genre: [...prev.genre, genreInput.trim()],
      }));
      setGenreInput("");
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.filter((genre) => genre !== genreToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submits

    // Image required validation
    if (images.length === 0) {
      setErrors((prev) => ({
        ...prev,
        images: "At least one image is required",
      }));
      return;
    }

    const result = bookSchema.safeParse(formData);
    if (!result.success) {
      const errorMap: Partial<typeof formData> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof FormData;
        errorMap[path] = issue.message as any;
      });
      setErrors(errorMap);
      return;
    }

    setErrors({});
    console.log("Form data to submit:", formData);

    const data = new FormData();

    // Append all fields
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("condition", formData.condition);
    data.append("location", formData.location);
    data.append("productType", formData.productType);
    data.append("categoryId", formData.categoryId);

    if (formData.pages) data.append("pages", formData.pages);
    if (formData.description) data.append("description", formData.description);
    if (formData.productType === "sale" && formData.price)
      data.append("price", formData.price.toString());

    // ✅ Append genre (array)
    formData.genre.forEach((g) => data.append("genre", g));

    // images append karo binary mein
    images.forEach((img) => {
      if (img.file) data.append("images", img.file);
    });

    try {
      setLoading(true);
      if (slug) {
        // Find book by slug and get its id for update
        const foundBook = AllUserBooks?.data?.find(
          (book: any) => book.slug === slug
        );
        if (foundBook) {
          await dispatch(UpdateBook({ id: foundBook._id, data }) as any);
          await dispatch(GetAllBooks({}) as any);
        } else {
          throw new Error("Book not found for update");
        }
      } else {
        await dispatch(AddBooks(data) as any);
        await dispatch(GetAllBooks({}) as any);
      }
    } catch (error) {
      console.error("Error while submitting book:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationCheckbox = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.checked) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            // OPTIONAL: Use a reverse geocoding API to convert to address
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();

            const address = data?.display_name || `${latitude}, ${longitude}`;

            setFormData((prev) => ({
              ...prev,
              location: address,
            }));
          },
          (error) => {
            console.error("Geolocation error:", error);
            alert("Unable to fetch location");
          }
        );
      } else {
        alert("Geolocation not supported");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) handleFiles(Array.from(files));
  };
  const handleFiles = (files: File[]) => {
    const newImages: ImageFile[] = [];
    files.forEach((file) => {
      if (
        file.type.startsWith("image/") &&
        images.length + newImages.length < 5
      ) {
        const preview = URL.createObjectURL(file);
        newImages.push({
          file,
          preview,
          id: Math.random().toString(36).substr(2, 9),
        });
      }
    });
    setImages((prev) => [...prev, ...newImages]);
  };
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      handleFiles(Array.from(e.dataTransfer.files));
  };
  const removeImage = (id: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return updated;
    });
  };
  return (
    <div className="container  px-4 py-8 ">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-indigo-900">List Your Book</h2>
        <p className="text-gray-600 mt-2">
          Share your book with our community of readers
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Book Title */}
          <div className="col-span-2">
            <Input
              name="title"
              label="Book Title*"
              placeholder="Enter book title"
              value={formData.title}
              onChange={handleInputChange}
              error={errors.title}
            />
          </div>

          {/* Genres */}
          <div className="col-span-2">
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genres* (Max 5)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.genre.map((g) => (
                  <span
                    key={g}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium"
                  >
                    {g}
                    <button
                      type="button"
                      onClick={() => handleRemoveGenre(g)}
                      className="ml-2 text-indigo-600 hover:text-indigo-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddGenre())
                  }
                  placeholder="Add genre"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddGenre}
                  disabled={!genreInput.trim() || formData.genre.length >= 5}
                  className={`px-4 py-2 rounded-md ${
                    !genreInput.trim() || formData.genre.length >= 5
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  Add
                </button>
              </div>
              {errors.genre && (
                <p className="mt-2 text-sm text-red-600">{errors.genre}</p>
              )}

              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Popular genres:</p>
                <div className="flex flex-wrap gap-2">
                  {popularGenres.map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() =>
                        !formData.genre.includes(g) &&
                        formData.genre.length < 5 &&
                        setFormData((prev) => ({
                          ...prev,
                          genre: [...prev.genre, g],
                        }))
                      }
                      disabled={
                        formData.genre.includes(g) || formData.genre.length >= 5
                      }
                      className={`px-3 py-1 text-sm rounded-md ${
                        formData.genre.includes(g) || formData.genre.length >= 5
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Category and Condition */}
          <div>
            <SelectDropdown
              data={categories}
              label="Category*"
              icon={true}
              onChange={(id) => handleSelectChange("categoryId", id)}
              selectedId={formData.categoryId}
            />
            {errors.categoryId && (
              <p className="mt-2 text-sm text-red-600">{errors.categoryId}</p>
            )}
          </div>

          <div>
            <SelectDropdown
              data={conditions}
              label="Condition*"
              onChange={(id) => handleSelectChange("condition", id)}
              selectedId={formData.condition}
            />
            {errors.condition && (
              <p className="mt-2 text-sm text-red-600">{errors.condition}</p>
            )}
          </div>

          {/* Product Type */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Type*
            </label>
            <div className="flex gap-6">
              {productTypes.map((type) => (
                <label
                  key={type.id}
                  className="inline-flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="productType"
                    checked={formData.productType === type.id}
                    onChange={() => handleSelectChange("productType", type.id)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">{type.name}</span>
                </label>
              ))}
            </div>
            {errors.productType && (
              <p className="mt-2 text-sm text-red-600">{errors.productType}</p>
            )}
          </div>

          {/* Price (conditional) */}
          {formData.productType === "sale" && (
            <div className="col-span-2 md:col-span-1">
              <Input
                name="price"
                label="Price*"
                placeholder="Enter price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                error={errors.price}
              />
            </div>
          )}

          {/* Location */}
          <div className="col-span-2 md:col-span-1">
            <Input
              name="location"
              label="Location*"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleInputChange}
              error={errors.location}
            />

            <div className="col-span-2 flex items-center mt-3">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                onChange={handleLocationCheckbox}
              />
              <label className="ml-2 block text-sm text-gray-700">
                Current Location
              </label>
            </div>
          </div>

          {/* Pages */}
          <div className="col-span-2 md:col-span-1">
            <Input
              name="pages"
              label="Pages*"
              placeholder="Enter number of pages"
              value={formData.pages}
              onChange={handleInputChange}
              error={errors.pages}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <Input
              name="author"
              label="author*"
              placeholder="Enter name of author"
              value={formData.author}
              onChange={handleInputChange}
              error={errors.author}
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description*
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter book description (min 10 characters)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 h-32"
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="flex items-center text-lg font-semibold text-gray-700 mt-3">
            <Upload className="h-5 w-5 mr-2" />
            Book Images (Max 5)
          </label>
          <div
            className={`cursor-pointer border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-300 hover:border-indigo-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Plus className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Drag & drop images here, or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.preview}
                    alt="Preview"
                    className="w-full h-32 object-contain rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.images && (
            <p className="mt-2 text-sm text-red-600">{errors.images}</p>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            disabled={loading}
          >
            {loading ? "Loading" : slug ? "Update Book" : "Submit Book"}
          </button>
        </div>
      </form>
    </div>
  );
}
