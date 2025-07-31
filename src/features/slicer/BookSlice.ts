import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HandleApiError } from "../../utlis/HandleApiError.ts";
import toast from "react-hot-toast";
import {
  Add_Book_API,
  Filter_Books_Api,
  Get_All_Books_Api,
  Get_All_Books_By_User_Api,
  Get_All_Category_API,
  Update_Book_Api,
  Related_Books_Api,
  Get_Book_BY_Slug_ApI,
} from "../api/api.ts";
import { baseUrl, getConfig, getConfigFormData } from "./Slicer.ts";
import { getAllBooks } from "../../../../BookStore/src/controllers/book.controller.js";
// ✅ AddBook thunk
export const AddBookSlice = createAsyncThunk(
  "auth/AddBook",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + Add_Book_API,
        data,
        getConfigFormData()
      );

      toast.success("Book added successfully!");

      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);
export const UpdateBook = createAsyncThunk(
  "auth/UpdateBook",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${baseUrl + Update_Book_Api}/${id}`,
        data,
        getConfigFormData()
      );

      toast.success("Book updated successfully!");
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const GetAllBooksByUser = createAsyncThunk(
  "auth/GetAllBooksByUser",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + Get_All_Books_By_User_Api,
        getConfig()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const GetAllBooks = createAsyncThunk(
  "auth/GetAllBooks",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + Get_All_Books_Api,
        getConfig()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const GetAllCategory = createAsyncThunk(
  "auth/GetAllCategory",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + Get_All_Category_API,
        getConfig()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const GetRelatedBooks = createAsyncThunk(
  "auth/RelatedBooks",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + Related_Books_Api + "/" + id,
        getConfig()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const FilterAllBooks = createAsyncThunk(
  "auth/FilterAllBooks",
  async ({ params }: { params: Record<string, any> }, { rejectWithValue }) => {
    try {
      const queryString = params
        ? "?" +
          Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== "")
            .map(
              ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
            )
            .join("&")
        : "";
      const response = await axios.get(
        baseUrl + Filter_Books_Api + queryString,
        getConfig()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const GetBookBySlug = createAsyncThunk(
  "auth/GetBookBySlug",
  async (slug: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + Get_Book_BY_Slug_ApI + "/" + slug,
        getConfig()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

// ✅ Initial state
const initialState = {
  isLoading: false,
  isError: false,
  AllCategory: [],
  AllUserBooks: [],
  AllBooks: [],
  FilterBooks: [],
  AllReatedBooks: [],
  AllBookRequest: [],
};

// ✅ Slice
const BookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllCategory.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(GetAllCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllCategory = action.payload;
      })
      .addCase(GetAllCategory.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
    builder
      .addCase(GetAllBooksByUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(GetAllBooksByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllUserBooks = action.payload;
      })
      .addCase(GetAllBooksByUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
    builder
      .addCase(GetAllBooks.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(GetAllBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllBooks = action.payload;
      })
      .addCase(GetAllBooks.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
    builder
      .addCase(FilterAllBooks.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(FilterAllBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.FilterBooks = action.payload;
      })
      .addCase(FilterAllBooks.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
    builder
      .addCase(GetRelatedBooks.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(GetRelatedBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllReatedBooks = action.payload;
      })
      .addCase(GetRelatedBooks.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default BookSlice.reducer;
