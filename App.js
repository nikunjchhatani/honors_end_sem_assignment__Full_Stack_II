/*done by Nikunj*/
import React, { useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, Alert, Share } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Modal } from "react-native-paper";
import LottieView from "lottie-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const App = () => {
  const [shoppingList, setShoppingList] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [category, setCategory] = useState("General");
  const [customCategories, setCustomCategories] = useState(["General", "Vegetables", "Dairy", "Electronics"]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  /*done by Nikunj*/
  
  const addCategory = (newCategory) => {
    if (newCategory.trim() === "" || customCategories.includes(newCategory)) {
      Alert.alert("Error", "Please enter a unique category.");
      return;
    }
    setCustomCategories([...customCategories, newCategory]);
    setCategory(newCategory);
  };

  const addItem = () => {
    if (newItem.trim() === "") {
      Alert.alert("Error", "Please enter an item name.");
      return;
    }
    const newEntry = {
      id: Date.now().toString(),
      name: newItem,
      category,
      completed: false,
      reminder: selectedDate,
    };
    setShoppingList([...shoppingList, newEntry]);
    setNewItem("");
    setCategory("General");
    setModalVisible(false);
  };

  const toggleCompletion = (id) => {
    const updatedList = shoppingList.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setShoppingList(updatedList);
  };

  const removeItem = (id) => {
    const updatedList = shoppingList.filter((item) => item.id !== id);
    setShoppingList(updatedList);
  };

  const shareList = async () => {
    const listString = shoppingList
      .map((item) => `${item.name} (${item.category})`)
      .join("\n");
    try {
      await Share.share({
        message: `Shopping List:\n${listString}`,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share the list.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={[
          styles.checkbox,
          item.completed && { backgroundColor: "#4CAF50" },
        ]}
        onPress={() => toggleCompletion(item.id)}
      >
        {item.completed && <AntDesign name="check" size={20} color="white" />}
      </TouchableOpacity>
      <View style={styles.itemDetails}>
        <Text style={[styles.itemText, item.completed && styles.itemTextCompleted]}>
          {item.name}
        </Text>
        <Text style={styles.categoryText}>Category: {item.category}</Text>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <MaterialIcons name="delete" size={24} color="#F44336" />
      </TouchableOpacity>
    </View>
  );

// done by sahil
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping List</Text>
      <FlatList
        data={shoppingList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <LottieView
              source={require("./assets/empty.json")} // Path to your Lottie JSON file
              autoPlay
              loop
              style={{ width: 200, height: 300 }}
            />
            <Text style={styles.emptyText}>No items yet. Add some!</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.shareButton}
        onPress={shareList}
      >
        <MaterialIcons name="share" size={24} color="white" />
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Text style={styles.modalTitle}>Add a New Item</Text>
        <TextInput
          style={styles.input}
          placeholder="Item name"
          value={newItem}
          onChangeText={setNewItem}
        />
        <Text style={styles.modalSubtitle}>Add or Select Category:</Text>
        <View style={styles.categoryInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Category"
            value={category}
            onChangeText={setCategory}
          />
          <TouchableOpacity
            style={styles.addCategoryButton}
            onPress={() => addCategory(category)}
          >
            <Text style={styles.addCategoryText}>Add</Text>
          </TouchableOpacity>
        </View>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          {customCategories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
        <TouchableOpacity
          style={styles.reminderButton}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text style={styles.reminderText}>Set Reminder</Text>
        </TouchableOpacity>
        {isDatePickerVisible && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setDatePickerVisible(false);
              if (date) setSelectedDate(date);
            }}
          />
        )}
        <TouchableOpacity style={styles.modalButton} onPress={addItem}>
          <Text style={styles.modalButtonText}>Add Item</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default App;
//stylesheet done by aman
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  itemDetails: {
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#2196F3",
    borderRadius: 6,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
  },
  itemTextCompleted: {
    textDecorationLine: "line-through",
    color: "#757575",
  },
  categoryText: {
    fontSize: 14,
    color: "#757575",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#2196F3",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  shareButton: {
    position: "absolute",
    right: 90,
    bottom: 20,
    backgroundColor: "#4CAF50",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#757575",
    marginTop: 10,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  categoryInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addCategoryButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    marginLeft: 10,
    borderRadius: 6,
  },
  addCategoryText: {
    color: "white",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 10,
    borderRadius: 6,
    flex: 1,
  },
  picker: {
    marginVertical: 10,
  },
  reminderButton: {
    backgroundColor: "#FF9800",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginVertical: 10,
  },
  reminderText: {
    color: "white",
    fontWeight: "bold",
  },
  modalButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
