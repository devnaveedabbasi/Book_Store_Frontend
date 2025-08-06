import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

// Local
// export const baseUrl = "http://localhost:4000/api/v1";
// export const baseUrlImg = "http://localhost:4000/";
// export const socket = io("http://localhost:4000", {
//   withCredentials: false,
// });

// Server
export const baseUrl = "https://book-store-backend-awdm.onrender.com/api/v1";
export const baseUrlImg = "https://book-store-backend-awdm.onrender.com/";
export const socket = io("https://book-store-backend-awdm.onrender.com", {
  withCredentials: false,
});

export const getConfig = () => ({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem(
      "token"
    )} || ${sessionStorage.getItem("token")}`,
  },
});

export const getConfigFormData = () => ({
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem(
      "token"
    )} || ${sessionStorage.getItem("token")}`,
  },
});

const initialState = {
  isLoading: false,
  isError: false,
};

const Slicer = createSlice({
  name: "slicer",

  initialState,
  reducers: {},
});
export const {} = Slicer.actions;
export default Slicer.reducer;
