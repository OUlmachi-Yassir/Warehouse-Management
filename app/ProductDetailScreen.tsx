import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";


interface Stock {
  id: number;
  name:string;
  quantity: number;
  localisation:{city:string};
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product>(
          `${process.env.EXPO_PUBLIC_APP_API_URL}/products/${id}`
        );
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
    if (!product) return;

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_APP_API_URL}/products/${id}`, {
        productId: product.id,
        quantity: 1, 
      });

      setProduct((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          stocks: [...prev.stocks, response.data]
        };
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du stock:", error);
    }
  };

  const removeStock = async (stockId: number) => {
    if (!product) return;

    try {
      await axios.delete(`${process.env.EXPO_PUBLIC_APP_API_URL}/products/${id}`);

      setProduct((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          stocks: prev.stocks.filter((stock) => stock.id !== stockId)
        };
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du stock:", error);
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
    <View style={styles.container}>
      {product.image && <Image source={{ uri: product.image }} style={styles.productImage} />}
      <Text style={styles.productName}>{product.name}</Text>
      <Text>Type: {product.type}</Text>
      <Text>Code-barres: {product.barcode}</Text>
      <Text>Prix: {product.price} MAD</Text>
      <Text>Fournisseur: {product.supplier}</Text>

      <Text style={styles.stockTitle}>Stocks :</Text>
      <TouchableOpacity style={styles.button} onPress={addStock}>
        <Text style={styles.buttonText}>Ajouter un stock</Text>
      </TouchableOpacity>
      <FlatList
        data={product.stocks}
        keyExtractor={(stock) => stock.id.toString()}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
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
    marginBottom: 20,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  stockTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  stockItem: {
    width: "100%",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    marginVertical: 5,
  },
  stockControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
  }
});

export default ProductDetailScreen;