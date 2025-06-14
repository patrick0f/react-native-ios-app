import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ExpenseItem } from "../src/components/ExpenseItem";
import { useExpenses } from "../src/hooks/useExpenses";
import { styles } from "../src/styles";

export default function Index() {
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const { 
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
    onSearch 
  } = useExpenses();

  const handleAddEntry = async () => {
    if (description.trim() === "" || amount.trim() === "") {
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }
    const success = await addEntry(description, parsedAmount);
    if (success) {
      setDescription("");
      setAmount("");
      Keyboard.dismiss();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4630EB" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => window.location.reload()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={24} color={"#333"} />
        <TextInput
          placeholder="Search expenses"
          value={searchQuery}
          onChangeText={onSearch}
          style={styles.searchInput}
          clearButtonMode="always"
          autoCorrect={false}
        />
      </View>

      <FlatList
        data={[...entries].reverse()}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ExpenseItem
            entry={item}
            deleteEntry={deleteEntry}
            confirmCategory={confirmCategory}
            editEntry={editEntry}
            updateCategory={updateCategory}
            dismissSuggestion={dismissSuggestion}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No expenses found</Text>
          </View>
        }
      />

      <KeyboardAvoidingView
        style={styles.footer}
        behavior="padding"
        keyboardVerticalOffset={10}
      >
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.descriptionInput}
            autoCorrect={false}
          />
          <View style={styles.divider} />
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              placeholder=""
              value={amount}
              onChangeText={setAmount}
              style={styles.amountInput}
              keyboardType="decimal-pad"
              autoCorrect={false}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
          <Ionicons name="add" size={34} color={"#fff"} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export const options = {
  headerShown: false,
};
