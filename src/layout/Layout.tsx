import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Navbar />
      <PageHeader />
      <div className=" min-h-[70vh]">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
