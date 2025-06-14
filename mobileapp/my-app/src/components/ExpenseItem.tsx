import { View, Text, TouchableOpacity, Alert, Modal, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EntryType, CATEGORIES } from "../types/expense";
import { styles } from "../styles/expenseItem";
import { useState, useEffect } from "react";

type ExpenseItemProps = {
  entry: EntryType;
  deleteEntry: (id: string) => void;
  confirmCategory: (id: string) => void;
  editEntry: (id: string, description: string, amount: number, entry: EntryType) => Promise<boolean>;
  updateCategory: (id: string, category: string) => Promise<boolean>;
  dismissSuggestion: (id: string) => Promise<boolean>;
};

export const ExpenseItem = ({
  entry,
  deleteEntry,
  confirmCategory,
  editEntry,
  updateCategory,
  dismissSuggestion,
}: ExpenseItemProps) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [description, setDescription] = useState(entry.text);
  const [amount, setAmount] = useState(entry.amount.toString());

  // Update local state when entry changes
  useEffect(() => {
    setDescription(entry.text);
    setAmount(entry.amount.toString());
  }, [entry]);

  const handleDescriptionSubmit = async () => {
    if (description.trim() !== "") {
      const success = await editEntry(entry._id, description, entry.amount, entry);
      if (!success) {
        // Reset to original value if update failed
        setDescription(entry.text);
      }
    } else {
      // Reset to original value if empty
      setDescription(entry.text);
    }
    setIsEditingDescription(false);
  };

  const handleAmountSubmit = async () => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      const success = await editEntry(entry._id, entry.text, parsedAmount, entry);
      if (!success) {
        // Reset to original value if update failed
        setAmount(entry.amount.toString());
      }
    } else {
      // Reset to original value if invalid
      setAmount(entry.amount.toString());
    }
    setIsEditingAmount(false);
  };

  const handleCategorySelect = async (category: string) => {
    await updateCategory(entry._id, category);
    setShowCategoryModal(false);
  };

  const handleClearSuggestion = async () => {
    await updateCategory(entry._id, "Other");
    await dismissSuggestion(entry._id);
  };

  return (
    <View style={styles.entryContainer}>
      <View style={styles.entryInfoContainer}>
        <View style={styles.entryTextContainer}>
          {isEditingDescription ? (
            <TextInput
              style={[styles.entryText, styles.editingInput]}
              value={description}
              onChangeText={setDescription}
              onBlur={handleDescriptionSubmit}
              onSubmitEditing={handleDescriptionSubmit}
              autoFocus
            />
          ) : (
            <TouchableOpacity onPress={() => setIsEditingDescription(true)}>
              <Text style={styles.entryText}>{entry.text}</Text>
            </TouchableOpacity>
          )}
          {isEditingAmount ? (
            <TextInput
              style={[styles.amountText, styles.editingInput]}
              value={amount}
              onChangeText={setAmount}
              onBlur={handleAmountSubmit}
              onSubmitEditing={handleAmountSubmit}
              keyboardType="decimal-pad"
              autoFocus
            />
          ) : (
            <TouchableOpacity onPress={() => setIsEditingAmount(true)}>
              <Text style={styles.amountText}>${entry.amount.toFixed(2)}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.categoryContainer}>
          <TouchableOpacity 
            style={[
              styles.categoryButton,
              !entry.isConfirmed && styles.disabledCategoryButton
            ]}
            onPress={() => setShowCategoryModal(true)}
            disabled={!entry.isConfirmed}
          >
            <Text style={[
              styles.categoryText,
              !entry.isConfirmed && styles.disabledCategoryText
            ]}>
              {entry.isConfirmed ? entry.category : `Suggested: ${entry.suggestedCategory}`}
            </Text>
            <Ionicons 
              name="chevron-down" 
              size={16} 
              color={entry.isConfirmed ? "#666" : "#999"} 
            />
          </TouchableOpacity>
          {!entry.isConfirmed && (
            <View style={styles.suggestionButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => confirmCategory(entry._id)}
              >
                <Ionicons name="checkmark-circle" size={24} color={"#4630EB"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dismissButton}
                onPress={handleClearSuggestion}
              >
                <Ionicons name="close-circle" size={24} color={"#FF3B30"} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          deleteEntry(entry._id);
        }}
      >
        <Ionicons name="trash" size={24} color={"red"} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showCategoryModal}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color={"#333"} />
              </TouchableOpacity>
            </View>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryOption,
                  entry.category === category && styles.selectedCategory
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={[
                  styles.categoryOptionText,
                  entry.category === category && styles.selectedCategoryText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}; 