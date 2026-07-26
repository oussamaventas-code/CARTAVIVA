export interface Dish {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  videoUrl: string;
}

export interface Category {
  id: string;
  name: string;
}
