import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import FloatingButtons from '@/components/FloatingButtons';

interface Stock {
  id: number;
  name: string;
  quantity: number;
  localisation: {
    city: string;
    latitude: number;
    longitude: number;
  };
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
  editedBy: {
    warehousemanId: number;
    at: string;
  }[];
}



const ProductListScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>(`${process.env.EXPO_PUBLIC_APP_API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    const interval = setInterval(fetchProducts, 1000);

    return () => clearInterval(interval);
  }, []);

  const getBorderColor = (quantity: number) => {
    if (quantity === 0) return 'red';
    if (quantity > 0 && quantity < 10) return 'yellow';
    return 'green';
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const productToDelete = products.find(product => product.id === productId);
  
      await axios.delete(`${process.env.EXPO_PUBLIC_APP_API_URL}/products/${productId}`);
  
      if (productToDelete) {
        const statestic = {
          mostRemovedProducts:[productToDelete]
        }; 
        console.log(statestic)
  
       try{
        const response = await axios.post(`${process.env.EXPO_PUBLIC_APP_API_URL}/statistics`,statestic);
        console.log(response.data);
       }catch(error){
        console.log("Here is the error",error)
       } 
      }
  
      setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression du produit.');
    }
  };
  

  const renderItem = ({ item }: { item: Product }) => {
    const totalQuantity = item.stocks.reduce((total, stock) => total + stock.quantity, 0);
    return (
      <View style={[styles.itemContainer, { borderColor: getBorderColor(totalQuantity) }]}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.productImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemType}>{item.type}</Text>
          <Text style={styles.itemPrice}>{item.price} MAD</Text>
          <Text style={styles.itemStock}>Stock: {totalQuantity}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text>Aucun produit disponible.</Text>
          </View>
        )}
      />
      <FloatingButtons />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    padding: 20,
    backgroundColor: 'transparent',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  placeholderText: {
    color: '#666',
    fontSize: 12,
  },
  textContainer: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  itemType: {
    color: '#666',
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemStock: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  separator: {
    height: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductListScreen;
