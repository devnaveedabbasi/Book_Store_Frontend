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

export const books: BookType[] = [
  {
    id: 1,
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    rating: 4.8,
    reviews: 2847,
    image:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1701980900i/61431922.jpg",
    category: "Fantasy Romance",
    condition: "New",
    location: "Karachi, Pakistan",
    description:
      "A thrilling fantasy romance about dragon riders and war college. Violet Sorrengail thought she'd live a quiet life among the scribes, but now she must survive the brutal war college.",
    pages: 512,
    language: "English",
  },
  {
    id: 2,
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    rating: 4.7,
    reviews: 1923,
    image:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1663805647i/32620332.jpg",
    category: "Contemporary Fiction",
    condition: "Used",
    location: "Lahore, Pakistan",
    description:
      "Reclusive Hollywood icon Evelyn Hugo finally decides to tell her life story—but only to unknown journalist Monique Grant. A captivating tale of ambition, love, and sacrifice.",
    pages: 400,
    language: "English",
  },
  {
    id: 3,
    title: "It Ends with Us",
    author: "Colleen Hoover",
    rating: 4.6,
    reviews: 3156,
    image:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1470427482i/18692431.jpg",
    category: "Romance",
    condition: "Like New",
    location: "Islamabad, Pakistan",
    description:
      "A powerful story about love, resilience, and the courage it takes to break the cycle. Lily's journey of self-discovery will stay with you long after the last page.",
    pages: 384,
    language: "English",
  },
  {
    id: 4,
    title: "The Atlas Six",
    author: "Olivie Blake",
    rating: 4.2,
    reviews: 1567,
    image:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1619741648i/50520939.jpg",
    category: "Dark Academia",
    condition: "New",
    location: "Hyderabad, Pakistan",
    description:
      "Six young magicians compete for a place in an exclusive society. Dark academia meets magical realism in this atmospheric tale of power, knowledge, and betrayal.",
    pages: 448,
    language: "English",
  },
  {
    id: 5,
    title: "Atomic Habits",
    author: "James Clear",
    rating: 4.9,
    reviews: 4521,
    image:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
    category: "Self-Help",
    condition: "Used",
    location: "Faisalabad, Pakistan",
    description:
      "Transform your life with tiny changes that deliver remarkable results. A practical guide to building good habits and breaking bad ones through proven strategies.",
    pages: 320,
    language: "English",
  },
  {
    id: 6,
    title: "The Midnight Library",
    author: "Matt Haig",
    rating: 4.5,
    reviews: 2834,
    image:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg",
    category: "Philosophical Fiction",
    condition: "New",
    location: "Multan, Pakistan",
    description:
      "Between life and death lies the Midnight Library. A magical place where Nora Seed gets to explore the infinite possibilities of what her life could have been.",
    pages: 288,
    language: "English",
  },
  {
    id: 7,
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    rating: 4.7,
    reviews: 3892,
    image:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1582135294i/36809135.jpg",
    category: "Mystery",
    condition: "Like New",
    location: "Peshawar, Pakistan",
    description:
      "A haunting tale of nature, isolation, and resilience. Follow Kya, the 'Marsh Girl,' as she grows up alone in the dangerous marshlands of North Carolina.",
    pages: 384,
    language: "English",
  },
  {
    id: 8,
    title: "Educated",
    author: "Tara Westover",
    rating: 4.8,
    reviews: 2156,
    image:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1506026635i/35133922.jpg",
    category: "Memoir",
    condition: "Used",
    location: "Rawalpindi, Pakistan",
    description:
      "A powerful memoir about education, family, and the struggle between loyalty and independence. Tara's journey from survivalist family to PhD is truly inspiring.",
    pages: 334,
    language: "English",
  },
];
