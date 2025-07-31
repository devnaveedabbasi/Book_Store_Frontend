import { createSlice } from "@reduxjs/toolkit";

// export const baseUrl = "http://localhost:4000/api/v1";

export const baseUrl = "https://book-store-backend-awdm.onrender.com/api/v1";

export const baseUrlImg = "https://book-store-backend-awdm.onrender.com/";

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
