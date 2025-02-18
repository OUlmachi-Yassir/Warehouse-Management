import { View, Text, StyleSheet, ActivityIndicator, Button, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons'; 
import { printProductList } from '@/services/printService';
import { Product, Statistics, Stock } from '@/services/productService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs, useNavigation, useRouter } from 'expo-router';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';



export default function HomeScreen() {
  const [product, setProducts] = useState<Product[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); 

  

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_APP_API_URL}/products`);
      setProducts(response.data)
      const products = Array.isArray(response.data) ? response.data : []; 

      const totalProducts = products.length;
      const cities = new Set();
      let totalStockValue = 0;
      let outOfStock = 0;

      products.forEach(product => {
        let productStock = 0;
        if (Array.isArray(product.stocks)) {
          product.stocks.forEach((stock: Stock) => {
            totalStockValue += stock.quantity || 0;
            productStock += stock.quantity || 0;
            if (stock.localisation?.city) {
              cities.add(stock.localisation.city);
            }
          });
        }
        if (productStock === 0) outOfStock++;
      });

      setStatistics({
        totalProducts,
        totalCities: cities.size,
        outOfStock,
        totalStockValue
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
    const interval = setInterval(fetchStatistics, 10000);
    return () => clearInterval(interval);
  }, []);


  const handleLogout = async () => {
    await AsyncStorage.removeItem('@user_data'); 
    Alert.alert('Succès', 'Logout avec succès.', [
            { text: 'OK', onPress: () => navigation.popToTop() },
          ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Chargement des statistiques...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>📊 Statistiques du Stock</Text>
      {statistics ? (
        <>
          <View style={styles.statItem}>
            <FontAwesome5 name="boxes" size={24} color="#4A90E2" />
            <Text style={styles.statText}>Produits totaux : {statistics.totalProducts}</Text>
          </View>

          <View style={styles.statItem}>
            <MaterialIcons name="location-city" size={24} color="#E67E22" />
            <Text style={styles.statText}>Villes couvertes : {statistics.totalCities}</Text>
          </View>

          <View style={[styles.statItem, styles.outOfStock]}>
            <Ionicons name="warning" size={24} color="#E74C3C" />
            <Text style={styles.statText}>Rupture de stock : {statistics.outOfStock}</Text>
          </View>

          <View style={styles.statItem}>
            <Feather name="dollar-sign" size={24} color="#27AE60" />
            <Text style={styles.statText}>Valeur du stock : {statistics.totalStockValue} unités</Text>
          </View>
        </>
      ) : (
        <Text>Aucune donnée disponible</Text>
      )}
      <Button title="📄 Imprimer Liste Produits" onPress={() => printProductList(product)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F9FC',
    paddingTop:50,    
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2C3E50',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
    color: '#34495E',
  },
  outOfStock: {
    backgroundColor: '#FDEDEC', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A90E2',
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'red',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
