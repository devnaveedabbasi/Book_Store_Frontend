import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../slicer/AuthSlice";
import BookSlice from "../slicer/BookSlice";
import BookRequestSlice from "../slicer/BookRequestSlice";
import MessageSlice from "../slicer/MessageSlice";
export const store = configureStore({
  reducer: {
    AuthSlice,
    BookSlice,
    BookRequestSlice,
    MessageSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
