import Entry from "../models/entry.model.js";

export const createEntry = async (req, res) => {
  try {
    const { text, amount } = req.body;
    const broadcastToAll = req.app.get('broadcastToAll');

    if (!text || amount === undefined) {
      return res.status(400).json({ message: "Text and amount are required" });
    }

    const newEntry = new Entry({
      text,
      amount,
      category: req.body.category || "Uncategorized",
      suggestedCategory: req.body.suggestedCategory || "Food"
    });

    await newEntry.save();

    // Broadcast the new entry to all clients
    broadcastToAll("entry:added", newEntry);

    res.status(201).json(newEntry);
  } catch (error) {
    console.log("Error in createEntry controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getEntries = async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    console.log("Error in getEntries controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, amount, category, isConfirmed } = req.body;
    const broadcastToAll = req.app.get('broadcastToAll');

    // Build update object based on provided fields
    const updateData = {};
    if (text !== undefined) updateData.text = text;
    if (amount !== undefined) updateData.amount = amount;
    if (category !== undefined) updateData.category = category;
    if (isConfirmed !== undefined) updateData.isConfirmed = isConfirmed;

    const updatedEntry = await Entry.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // Broadcast the updated entry to all clients
    broadcastToAll("entry:updated", updatedEntry);

    res.status(200).json(updatedEntry);
  } catch (error) {
    console.log("Error in updateEntry controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const broadcastToAll = req.app.get('broadcastToAll');

    const deletedEntry = await Entry.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // Broadcast the deleted entry ID to all clients
    broadcastToAll("entry:deleted", id);

    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.log("Error in deleteEntry controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}; 