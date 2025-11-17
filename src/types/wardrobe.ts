export interface WardrobeItem {
  id: number;
  user_id: number;
  brand_id: number;
  image_url: string;
  size: string;
  name: string;
  type: "top" | "bottom" | "shoes";
  status: string;
  events: string[];
  favourite: boolean;
  season: string;
  color: string;
  category: string;
  notes: string | null;
  purchase_date?: string | null;
  price?: number | null;
  created_at?: string;
  updated_at?: string;
  brand: {
    id: number;
    name: string;
  };
}

export interface Filters {
  category: string;
  brand: string;
  size: string;
  color: string;
  season: string;
  status: string;
}