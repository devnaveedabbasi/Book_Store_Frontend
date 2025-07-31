// RelatedAds.tsx
import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import BookCard from "../components/common/BookCard";

export default function RelatedAds({ relatedBooks }) {
  if (!relatedBooks || relatedBooks.length === 0) return null; // 👈 ye line add karo

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Ads</h2>
      <Carousel
        responsive={responsive}
        infinite={false}
        arrows
        keyBoardControl
        autoPlay={false}
        containerClass="carousel-container"
        itemClass="px-3"
      >
        {relatedBooks?.map((book, index) => (
          <BookCard key={book.id} book={book} index={index} viewMode="grid" />
        ))}
      </Carousel>
    </div>
  );
}
