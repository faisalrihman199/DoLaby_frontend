export interface WardrobeItem {
  id: number;
  user_id: number;
  image_url: string;
  size: string;
  name: string;
  type: "top" | "bottom" | "shoes" | "outfit";
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
  // brand removed
}

export interface Filters {
  category: string;
  size: string;
  color: string;
  season: string;
  status: string;
}