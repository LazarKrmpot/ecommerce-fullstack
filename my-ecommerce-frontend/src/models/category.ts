export interface Category {
  _id: string;
  name: string;
  description: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
}
