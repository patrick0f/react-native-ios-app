import { useState, useEffect } from "react";
import { EntryType } from "../types/expense";
import { api } from "../services/api";
import { useSocket } from "./useSocket";

export const useExpenses = () => {
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [oldEntries, setOldEntries] = useState<EntryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set up socket connection
  useSocket({
    onEntryAdded: (newEntry: EntryType) => {
      setEntries(prev => [...prev, newEntry]);
      setOldEntries(prev => [...prev, newEntry]);
    },
    onEntryUpdated: (updatedEntry: EntryType) => {
      setEntries(prev => prev.map(entry => 
        entry._id === updatedEntry._id ? updatedEntry : entry
      ));
      setOldEntries(prev => prev.map(entry => 
        entry._id === updatedEntry._id ? updatedEntry : entry
      ));
    },
    onEntryDeleted: (deletedEntryId: string) => {
      setEntries(prev => prev.filter(entry => entry._id !== deletedEntryId));
      setOldEntries(prev => prev.filter(entry => entry._id !== deletedEntryId));
    },
  });

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setIsLoading(true);
        const fetchedEntries = await api.getEntries();
        setEntries(fetchedEntries);
        setOldEntries(fetchedEntries);
        setError(null);
      } catch (err) {
        setError('Failed to fetch entries');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const addEntry = async (description: string, amount: number) => {
    try {
      const newEntry = await api.createEntry(description, amount);
      // Socket will handle the update
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const editEntry = async (id: string, description: string, amount: number) => {
    try {
      const currentEntry = entries.find(e => e._id === id);
      if (!currentEntry) return false;
      
      await api.updateEntry(id, description, amount, currentEntry);
      // Socket will handle the update
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateCategory = async (id: string, category: string) => {
    try {
      await api.updateCategory(id, category);
      // Socket will handle the update
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const dismissSuggestion = async (id: string) => {
    try {
      await api.updateCategory(id, "Other");
      // Socket will handle the update
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await api.deleteEntry(id);
      // Socket will handle the update
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const confirmCategory = async (id: string) => {
    try {
      const entry = entries.find(e => e._id === id);
      if (!entry) return false;
      
      await api.updateCategory(id, entry.suggestedCategory);
      // Socket will handle the update
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const onSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setEntries(oldEntries);
    } else {
      const filteredEntries = oldEntries.filter((entry) =>
        entry.text.toLowerCase().includes(query.toLowerCase())
      );
      setEntries(filteredEntries);
    }
  };

  return {
    entries,
    searchQuery,
    isLoading,
    error,
    addEntry,
    editEntry,
    updateCategory,
    dismissSuggestion,
    deleteEntry,
    confirmCategory,
    onSearch,
  };
}; 