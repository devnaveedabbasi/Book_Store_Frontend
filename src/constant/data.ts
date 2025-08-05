// Dummy book data
export interface BookType {
  id: number;
  title: string;
  author: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  condition: "New" | "Used" | "Like New";
  location: string;
  description: string;
  pages?: number;
  language: string;
}
