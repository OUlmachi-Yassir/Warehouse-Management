import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Alert, TextInput  } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import FloatingButtons from '@/components/FloatingButtons';
import { sortProducts, filterByCity,searchProducts } from '@/services/productService';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient';

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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortCriterion, setSortCriterion] = useState<'price' | 'name' | 'quantity'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
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

  const handleSearch = () => {
    let result = [...products];

    if (selectedCity) {
      result = filterByCity(result, selectedCity);
    }

    result = searchProducts(result, searchKeyword, 'name'); 

    result = sortProducts(result, sortCriterion, sortOrder);

    setFilteredProducts(result);
  };

  useEffect(() => {
    handleSearch();
  }, [searchKeyword, selectedCity, sortCriterion, sortOrder, products]);

  const getBorderColor = (quantity: number) => {
    if (quantity === 0) return 'rgba(255, 13, 0, 0.54)';
    if (quantity > 0 && quantity < 10) return 'rgba(242, 255, 0, 0.54)';
    return 'rgba(0, 255, 0, 0.54)';
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const productToDelete = products.find(product => product.id === productId);
  
      await axios.delete(`${process.env.EXPO_PUBLIC_APP_API_URL}/products/${productId}`);
  
      if (productToDelete) {
        const statestic = {
          mostRemovedProducts:[productToDelete]
        }; 
        console.log(statestic);
  
        try {
          const response = await axios.post(`${process.env.EXPO_PUBLIC_APP_API_URL}/statistics`, statestic);
          console.log(response.data);
        } catch (error) {
          console.log('Here is the error', error);
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
      <TouchableOpacity style={[styles.itemContainer, { borderLeftColor: getBorderColor(totalQuantity) }]}
      onPress={() => router.push({ pathname: '/ProductDetailScreen', params: { id: item.id } })}
      >
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.productImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.aligne}>
              <Text style={styles.itemStock}>Stock: {totalQuantity}</Text>
              <Text style={styles.itemStock}>Prise: {item.price}</Text>
          </View>
        </View>
       <View>
          <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} style={styles.deleteButton}>
            <FontAwesome name="trash" size={20} color="#fff" /> 
            </TouchableOpacity>
            
       </View>
        
      </TouchableOpacity>
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
    <LinearGradient
      colors={['#C0C0C0','red',"#C8C8C8"]}
      style={styles.container}
    >
    <View style={styles.innerContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un produit"
        value={searchKeyword}
        onChangeText={setSearchKeyword}
      />


      <View style={styles.sortingContainer}>
      <Text style={styles.SortBy} >SortBy</Text>

        <TouchableOpacity onPress={() => setSortCriterion('price')} style={styles.sortButton}>
          <Text style={styles.sortButtonText}>Price</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortCriterion('name')} style={styles.sortButton}>
          <Text style={styles.sortButtonText}>Name</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortCriterion('quantity')} style={styles.sortButton}>
          <Text style={styles.sortButtonText}>Quantity</Text>
        </TouchableOpacity>
      </View>
      <Picker
          selectedValue={selectedCity}
          style={styles.picker}
          onValueChange={(itemValue: string) => setSelectedCity(itemValue)}
        >
          <Picker.Item label="Sélectionner une ville" value="" />
          <Picker.Item label="Marrakech" value="Marrakech" />
          <Picker.Item label="Oujda" value="Oujda" />
        </Picker>

      <FlatList
        data={filteredProducts}
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  aligne:{
    flex:1,
    flexDirection:"row",
    gap:10
  },
  innerContainer: {
    flex: 1,
    marginTop: 50,
    backgroundColor: 'rgb(255, 247, 247)',
    paddingTop: 20,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingBottom:65,
  },
  searchInput: {
    margin:"auto",
    height: 40,
    width:"90%",
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  SortBy:{
    fontSize:20,
    fontFamily:'lucida grande, bold , tahoma, verdana, arial, sans-serif',
    marginRight: 10,
  },
  sortingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    margin:"auto",
  },
  sortButton: {
    marginRight: 10,
    width:"22%",
    paddingTop:2,
    backgroundColor: 'black',
    borderRadius: 20,
    alignItems:"center",
  },
  sortButtonText: {
    color: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin:"auto",
    width:"90%",
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    borderLeftWidth: 10,
    shadowColor: 'rgba(255, 255, 255, 0.7)',
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.5,
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
    backgroundColor: 'rgba(249, 6, 6, 0.6)',
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
  detailsButton: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
});

export default ProductListScreen;
