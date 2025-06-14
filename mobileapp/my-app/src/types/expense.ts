export type EntryType = {
  _id: string;
  text: string;
  amount: number;
  category: string;
  suggestedCategory: string;
  isConfirmed: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const CATEGORIES = [
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Health",
  "Education",
  "Other"
] as const; 