import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HandleApiError } from "../../utlis/HandleApiError.ts";
import toast from "react-hot-toast";
import {
  Add_BOOK_REQUEST_API,
  CHECK_BOOK_REQUEST_API,
  Get_USER_Book_Request_API,
  Cancel_Book_Request_API,
  Search_All_Request_API,
  Paginated_Request_API,
  Update_Status_Request_API,
  Get_Send_Request_API,
} from "../api/Api.ts";
import { baseUrl, getConfig } from "./Slicer.ts";
import { data } from "react-router-dom";

export const AddBookRequest = createAsyncThunk(
  "book/AddBookRequest",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + Add_BOOK_REQUEST_API,
        data,
        getConfig()
      );

      toast.success("Book added successfully!");

      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const GetCheckRequst = createAsyncThunk(
  "book/GetCheckRequst",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + CHECK_BOOK_REQUEST_API + "/" + id,
        getConfig()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const CancelBookRequest = createAsyncThunk(
  "book/CancelBookRequest",
  async (bookId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}${Cancel_Book_Request_API}/${bookId}`,
        {}, // 👈 Empty body (since it's a POST)
        getConfig()
      );
      toast.success("Book request cancelled successfully!");

      return response.data;
    } catch (err: any) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const GetUserBookRequest = createAsyncThunk(
  "book/GetUserBookRequest",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + Get_USER_Book_Request_API,
        getConfig()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const SearchAllRequests = createAsyncThunk(
  "book/SearchRequests",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseUrl + Search_All_Request_API}?query=${query}`,
        getConfig()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const PaginatedRequests = createAsyncThunk(
  "book/PaginatedRequests",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${baseUrl + Paginated_Request_API}?page=${page}&limit=${limit}`,
        getConfig()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const UpdateStatusRequest = createAsyncThunk(
  "book/UpdateStatusRequest",
  async ({ id, status }: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + Update_Status_Request_API + "/" + id,
        status,
        getConfig()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const GetSendRequest = createAsyncThunk(
  "book/GetSendRequest",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + Get_Send_Request_API,
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
  AllBookRequest: [],
  AllSendRequest: [],
};

// ✅ Slice
const BookRequestSlice = createSlice({
  name: "book",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetUserBookRequest.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(GetUserBookRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllBookRequest = action.payload;
      })
      .addCase(GetUserBookRequest.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
    builder
      .addCase(GetSendRequest.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(GetSendRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllSendRequest = action.payload;
      })
      .addCase(GetSendRequest.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default BookRequestSlice.reducer;
