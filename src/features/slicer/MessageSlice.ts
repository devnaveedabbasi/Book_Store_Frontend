import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HandleApiError } from "../../utlis/HandleApiError.ts";
import toast from "react-hot-toast";
import {
  Get_Chat_Users_API,
  Get_Messages_API,
  Edit_Message_API,
  Delete_Message_API,
  Image_Upload_API,
} from "../api/Api.ts";
import { baseUrl, getConfig, getConfigFormData, socket } from "./Slicer.ts";
import { sendMessage } from "../../../../BookStore/src/controllers/message.controller.js";

export const GetChatUsers = createAsyncThunk(
  "msg/GetCheckRequst",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + Get_Chat_Users_API,
        getConfig()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const GetMessages = createAsyncThunk(
  "msg/GetMessages",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + Get_Messages_API + "/" + id,
        getConfig()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const ImageUpload = createAsyncThunk(
  "msg/ImageUpload",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + Image_Upload_API,
        data,
        getConfigFormData() // No Content-Type
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const EditMessage = createAsyncThunk(
  "msg/EditMessage",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${baseUrl}${Edit_Message_API}/${id}`,
        data,
        getConfig()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const DeleteMessage = createAsyncThunk(
  "msg/DeleteMessage",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        baseUrl + Delete_Message_API + "/" + id,
        getConfig()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

const initialState = {
  isLoading: false,
  isChatLoading: false,
  isError: false,
  AllChatUsers: [],
  AllMessages: [],
};

// ✅ Slice
const BookRequestSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    addNewSocketMessage: (state, action) => {
      state.AllMessages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetChatUsers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(GetChatUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllChatUsers = action.payload;
      })
      .addCase(GetChatUsers.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
    builder
      .addCase(GetMessages.pending, (state) => {
        state.isChatLoading = true;
        state.isError = false;
      })
      .addCase(GetMessages.fulfilled, (state, action) => {
        state.isChatLoading = false;
        state.AllMessages = action.payload;
      })
      .addCase(GetMessages.rejected, (state) => {
        state.isChatLoading = false;
        state.isError = true;
      });
  },
});
export const { addNewSocketMessage } = BookRequestSlice.actions;

export default BookRequestSlice.reducer;
