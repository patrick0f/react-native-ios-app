import { EntryType } from '../types/expense';

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api` || 'http://localhost:5179';

export const api = {
  // Get AI category suggestion
  getCategorySuggestion: async (text: string, amount: number): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/ai/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, amount }),
      });
      if (!response.ok) {
        throw new Error('Failed to get category suggestion');
      }
      const data = await response.json();
      return data.category;
    } catch (error) {
      console.error('Error getting category suggestion:', error);
      return 'Other'; // Fallback category
    }
  },

  // Get all entries
  getEntries: async (): Promise<EntryType[]> => {
    try {
      const response = await fetch(`${API_URL}/entries`);
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching entries:', error);
      throw error;
    }
  },

  // Create a new entry
  createEntry: async (text: string, amount: number): Promise<EntryType> => {
    try {
      const suggestedCategory = await api.getCategorySuggestion(text, amount);
      const response = await fetch(`${API_URL}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          amount,
          category: "Uncategorized",
          suggestedCategory,
          isConfirmed: false,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create entry');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating entry:', error);
      throw error;
    }
  },

  // Update an entry
  updateEntry: async (id: string, text: string, amount: number, currentEntry: EntryType): Promise<EntryType> => {
    try {
      // Only get AI suggestion if text has changed
      const suggestedCategory = text !== currentEntry.text ? await api.getCategorySuggestion(text, amount) : undefined;
      
      const response = await fetch(`${API_URL}/entries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          amount,
          ...(suggestedCategory && { suggestedCategory, isConfirmed: false }),
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update entry');
      }
      return response.json();
    } catch (error) {
      console.error('Error updating entry:', error);
      throw error;
    }
  },

  // Update entry category
  updateCategory: async (id: string, category: string): Promise<EntryType> => {
    try {
      const response = await fetch(`${API_URL}/entries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          isConfirmed: true,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update category');
      }
      return response.json();
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete an entry
  deleteEntry: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/entries/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete entry');
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  },
}; 