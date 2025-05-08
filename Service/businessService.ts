export interface Service {
  name: string;
  description: string;
  price: number;
  availability: boolean;
  duration: string;
  category: string;
  createdAt: Date;
  imageUrls: string[]; // Array of image URLs
}
