import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./layout/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Loading from "./components/Loading";

// Lazy Loaded Pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Shop = lazy(() => import("./pages/Shop"));
const Book = lazy(() => import("./pages/BookDetails"));
const AddBook = lazy(() => import("./pages/AddBook"));
const MyListing = lazy(() => import("./pages/MyListing"));
const Chat = lazy(() => import("./pages/Chat"));
const BookRequest = lazy(() => import("./pages/BookRequest"));
const MyRequests = lazy(() => import("./pages/MyRequests"));
const SignUp = lazy(() => import("./pages/AuthPages/SignUp"));
const Login = lazy(() => import("./pages/AuthPages/SingIn"));
const ForgotPassword = lazy(() => import("./pages/AuthPages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/AuthPages/ResetPassword"));
const OtpVerification = lazy(() => import("./pages/AuthPages/OtpVerification"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Home Page without Layout */}
          <Route path="/" element={<Home />} />

          {/* Pages with Layout */}
          <Route element={<Layout />}>
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/book/:slug" element={<Book />} />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-book"
              element={
                <PrivateRoute>
                  <AddBook />
                </PrivateRoute>
              }
            />

            <Route
              path="/update-book/:slug"
              element={
                <PrivateRoute>
                  <AddBook />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-listings"
              element={
                <PrivateRoute>
                  <MyListing />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-request"
              element={
                <PrivateRoute>
                  <MyRequests />
                </PrivateRoute>
              }
            />
            <Route path="/book-request" element={<BookRequest />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/otp-verification" element={<OtpVerification />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
