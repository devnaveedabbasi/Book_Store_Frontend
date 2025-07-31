import React from "react";
import HeroSection from "../components/HeroSection";
import BookListing from "../components/BookListing";
import Category from "../components/Category";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <div>
      <HeroSection />
      <Category />
      <BookListing />
      <Footer />
    </div>
  );
}
