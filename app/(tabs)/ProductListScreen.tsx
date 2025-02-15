import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import FloatingButtons from '@/components/FloatingButtons';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { sortProducts, filterByCity, searchProducts, Product } from '@/services/productService';
import { deleteProduct, fetchProducts } from '@/services/redux/productSlice';
import { AppDispatch, RootState } from '@/services/redux/store';

const ProductListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();  const router = useRouter();
  const { products, loading } = useSelector((state:RootState) => state.products);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortCriterion, setSortCriterion] = useState<"name" | "price" | "quantity">("name");


  useEffect(() => {
    dispatch(fetchProducts());
    const interval = setInterval(() => fetchProducts, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let result = [...products];
    if (selectedCity) result = filterByCity(result, selectedCity);
    result = searchProducts(result, searchKeyword, 'name');
    result = sortProducts(result, sortCriterion, sortOrder);
    setFilteredProducts(result);
  }, [searchKeyword, selectedCity, sortCriterion, sortOrder, products]);

  const handleDeleteProduct = (productId:number) => {
    dispatch(deleteProduct(productId));
  };

  const getBorderColor = (quantity: number) => {
    if (quantity === 0) return 'rgba(255, 13, 0, 0.54)';
    if (quantity > 0 && quantity < 10) return 'rgba(242, 255, 0, 0.54)';
    return 'rgba(0, 255, 0, 0.54)';
  };

  const renderItem = ({ item }: { item: Product }) => {
    const totalQuantity = item.stocks.reduce((total, stock) => total + stock.quantity, 0);
    return (
      <TouchableOpacity style={[styles.itemContainer, { borderLeftColor: getBorderColor(totalQuantity) }]} onPress={() => router.push({ pathname: '/ProductDetailScreen', params: { id: item.id } })}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.productImage} />
        ) : (
          <View style={styles.placeholderImage}><Text style={styles.placeholderText}>No Image</Text></View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text>Stock: {totalQuantity}</Text>
          <Text>Price: {item.price}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} style={styles.deleteButton}>
          <FontAwesome name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

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
          <Picker.Item label="Marrakesh" value="Marrakesh" />
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
