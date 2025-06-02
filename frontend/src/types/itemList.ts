export interface Item {
  id: number;
  name: string;
  description: string;
  location: string;
  type: string;
  [key: string]: any;
}

export interface ItemsState {
  items: Item[];
  currentPage: number;
  itemsPerPage: number;
  error?: string | null;
}
