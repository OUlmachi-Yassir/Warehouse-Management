import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  type: string;
  barcode: string;
  price: number;
  solde?: number;
  supplier: string;
  image?: string;
  stocks: { quantity: number }[];
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
      <Text>Quantité en stock: {product.stocks.reduce((total, stock) => total + stock.quantity, 0)}</Text>
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
});

export default ProductDetailScreen;
