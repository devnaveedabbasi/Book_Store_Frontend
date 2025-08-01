import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HandleApiError } from "../../utlis/HandleApiError.ts";
import toast from "react-hot-toast";
import {
  Forgot_Password_API,
  RESEND_OTP_API,
  SIGNUP_API,
  VERIFY_OTP_API,
  Reset_Password_API,
  SignIn_API,
  Get_User_Details_API,
  SignOut_API,
} from "../api/Api.ts";
import { baseUrl, getConfig } from "./Slicer.ts";
// ✅ SignUp thunk
export const SignUp = createAsyncThunk(
  "auth/SignUp",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + SIGNUP_API,
        data,
        getConfig()
      );

      toast.success("Otp Send successful!");
      const user = response.data.data.user;
      localStorage.setItem("user", JSON.stringify(user));

      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const VerifyOtp = createAsyncThunk(
  "auth/VerifyOtp",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + VERIFY_OTP_API,
        data,
        getConfig()
      );
      toast.success("OTP verification successful!");
      const token = response.data.data.token;
      localStorage.setItem("token", token);
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const ResendOtp = createAsyncThunk(
  "auth/ResendOtp",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + RESEND_OTP_API,
        data,
        getConfig()
      );
      toast.success("OTP resent successfully!");
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const ForgotPassword = createAsyncThunk(
  "auth/ForgotPassword",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + Forgot_Password_API,
        data,
        getConfig()
      );
      toast.success("Password reset link sent");
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const ResetPassword = createAsyncThunk(
  "auth/ResetPassword",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + Reset_Password_API,
        data,
        getConfig()
      );
      toast.success("Password reset Successfully!");
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const SignIn = createAsyncThunk(
  "auth/SignIn",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + SignIn_API,
        data,
        getConfig()
      );
      toast.success("SignIn successful!");
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const SignOut = createAsyncThunk(
  "auth/SignOut",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + SignOut_API,
        data,
        getConfig()
      );
      toast.success("SignOut successful!");
      return response.data;
    } catch (err) {
      return rejectWithValue(HandleApiError(err));
    }
  }
);

export const GetUserDetails = createAsyncThunk(
  "auth/GetUserDetails",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + Get_User_Details_API,
        data,
        getConfig()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(console.log(err));
    }
  }
);

// ✅ Initial state
const initialState = {
  isLoading: false,
  isError: false,
  UserData: null,
};

// ✅ Slice
const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.UserData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetUserDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(GetUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.UserData = action.payload;
      })
      .addCase(GetUserDetails.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { clearUserData } = AuthSlice.actions;

export default AuthSlice.reducer;
