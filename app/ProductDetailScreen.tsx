import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from "react-native-svg";

interface Stock {
  id: number;
  name: string;
  quantity: number;
  localisation: { city: string };
}

interface Product {
  id: number;
  name: string;
  type: string;
  barcode: string;
  price: number;
  solde?: number;
  supplier: string;
  image?: string;
  stocks: Stock[];
}

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newStock, setNewStock] = useState({ name: "", quantity: 0, city: "", latitude: "", longitude: "" });
  const [selectedCity, setSelectedCity] = useState("");

  const cities = [
    { name: "Marrakesh", latitude: "31.628674", longitude: "-7.992047" },
    { name: "Oujda", latitude: "34.689404", longitude: "-1.912823" },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      console.log(id)
      try {
        const response = await axios.get<Product>(`${process.env.EXPO_PUBLIC_APP_API_URL}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du produit:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const updateStock = async (stockId: number, newQuantity: number) => {
    if (!product) return;

    try {
      const updatedStocks = product.stocks.map((stock) =>
        stock.id === stockId ? { ...stock, quantity: newQuantity } : stock
      );

      await axios.patch(`${process.env.EXPO_PUBLIC_APP_API_URL}/products/${id}`, {
        stocks: updatedStocks
      });

      setProduct((prev) => {
        if (!prev) return null;
        return { ...prev, stocks: updatedStocks };
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du stock:", error);
    }
  };

  const addStock = async () => {
    if (!product || !newStock.name || newStock.quantity <= 0 || !newStock.city) return;

    try {
      const updatedProduct = {
        ...product,
        stocks: [
          ...product.stocks,
          {
            name: newStock.name,
            quantity: newStock.quantity,
            localisation: {
              city: newStock.city,
              latitude: newStock.latitude,
              longitude: newStock.longitude,
            },
          },
        ],
      };

      const response = await axios.put(`${process.env.EXPO_PUBLIC_APP_API_URL}/products/${id}`, updatedProduct);
      setProduct(response.data);
      setModalVisible(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du stock:", error);
    }
  };

  const removeStockFromProduct = async (productId: number, stockId: number) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL}/products/${productId}`);
      const product = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const updatedStocks = product.stocks.filter((stock: Stock) => stock.id !== stockId);

      const updateResponse = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...product, stocks: updatedStocks }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update product");
      }

      console.log("Stock removed successfully!");
      setProduct((prev) => {
        if (!prev) return null;
        return { ...prev, stocks: updatedStocks };
      });

    } catch (error) {
      console.error("Error:", error);
    }
  };

  const removeStock = (stockId: number) => {
    if (product) {
      removeStockFromProduct(product.id, stockId);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Produit introuvable.</Text>
      </View>
    );
  }

  return (
    <LinearGradient
          colors={['#C0C0C0','red',"#C8C8C8"]}
          style={styles.container}
        >

    <View style={styles.innerContainer}>
      <View style={styles.marge}>
        {product.image && <Image source={{ uri: product.image }} style={styles.productImage} />}
        <Text style={styles.productName}>{product.name}</Text>
        <View style={styles.prodType}>
        <Text style={[styles.prodStrong]}>{product.type}</Text>
        <Text style={styles.prodForn}>{product.supplier}</Text>
        </View>        
        <Text style={styles.prodCodeBar}>Code-barres: {product.barcode}</Text>
        <Text style={styles.prodPrice}>Prix: {product.price} MAD</Text>
        <View style={styles.prodType} >
          <Text style={styles.stockTitle}>Stocks </Text>
          <TouchableOpacity style={styles.button1} onPress={() => setModalVisible(true)}>
          <Svg width={30} height={30} viewBox="0 0 30 30" fill={"black"}>
          <Path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z" />
          </Svg>
            </TouchableOpacity>
        </View>
      </View>
      
     
      <FlatList
        data={product.stocks || []}
        keyExtractor={(stock) => stock.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.stockItem}>
            <Text> Name: {item.name}</Text>
            <Text>
              Location: {item.localisation.city} | Quantité: {item.quantity}
            </Text>
            <View style={styles.stockControls}>
              <TouchableOpacity style={styles.button} onPress={() => updateStock(item.id, Math.max(0, item.quantity - 1))}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => updateStock(item.id, item.quantity + 1)}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => removeStock(item.id)}>
                <Text style={styles.buttonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un stock</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom du stock"
              value={newStock.name}
              onChangeText={(text) => setNewStock((prev) => ({ ...prev, name: text }))} />
            <TextInput
              style={styles.input}
              placeholder="Quantité"
              keyboardType="numeric"
              value={String(newStock.quantity)}
              onChangeText={(text) => setNewStock((prev) => ({ ...prev, quantity: parseInt(text) }))} />
            <Text style={styles.inputLabel}>Ville</Text>
            <View style={styles.citySelector}>
              <Picker
                selectedValue={selectedCity}
                onValueChange={(itemValue) => {
                  setSelectedCity(itemValue);
                  setNewStock((prev) => ({
                    ...prev,
                    city: itemValue,
                  }));
                }}
              >
                <Picker.Item label="Sélectionner une ville" value="" />
                {cities.map((city, index) => (
                  <Picker.Item key={index} label={city.name} value={city.name} />
                ))}
              </Picker>
            </View>
            <View style={styles.flex}>
              <TouchableOpacity style={[styles.button, styles.addButton]} onPress={addStock}>
                <Text style={styles.buttonText}>Ajouter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    </LinearGradient>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    marginTop: 5,
    backgroundColor: 'rgb(255, 247, 247)',
    paddingTop: 20,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
  },
  prodStrong:{
    backgroundColor:'#f9e46c',
    borderRadius:10,
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal:10
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    margin:"auto"
  },
  prodType: {
    marginTop:5,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center"
  },
  prodType2:{
    color:"black",
    fontSize: 16,
    fontWeight: "bold",
  },
  prodCodeBar: {
    fontSize: 16,
    marginVertical: 5,
  },
  prodPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  prodForn: {
    fontSize: 16,
    textAlign: "center",
  },
  stockTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  marge:{
    marginBottom:5,
  },
  stockItem: {
    width: "100%",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  stockControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button1:{
    backgroundColor: "#eeaeca",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  flex:{
    flexDirection:"row",
    gap:40
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  addButton:{
    backgroundColor:'rgb(198, 185, 244)',
    width:"40%",
  },
  closeButton:{
    backgroundColor:'rgb(249, 94, 94)',
    width:"40%",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  citySelector: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginVertical: 5,
  },
});

export default ProductDetailScreen;
