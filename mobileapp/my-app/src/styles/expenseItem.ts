import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  entryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  entryInfoContainer: {
    flex: 1,
    marginRight: 10,
  },
  entryTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  entryText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  amountText: {
    fontSize: 16,
    color: "#4630EB",
    fontWeight: "bold",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 4,
    paddingLeft: 0
  },
  disabledCategoryButton: {
    opacity: 0.7,
  },
  suggestionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  suggestionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  confirmButton: {
    padding: 4,
  },
  dismissButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  categoryOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: "#4630EB20",
  },
  categoryOptionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedCategoryText: {
    color: "#4630EB",
    fontWeight: "bold",
  },
  disabledCategoryText: {
    color: "#999",
  },
  editingInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#4630EB",
    paddingVertical: 4,
  },
}); 