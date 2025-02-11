import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  ProductList: undefined;
  AddProductScreen: undefined;
};

type AddProductScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddProductScreen'>;

interface Props {
  navigation: AddProductScreenNavigationProp;
}

const AddProductScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [barcode, setBarcode] = useState('');
  const [price, setPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [image, setImage] = useState('');
  const [quantity, setQuantity] = useState('');
  const [warehouseId, setWarehouseId] = useState('');

  const handleSubmit = async () => {
    if (!name || !type || !barcode || !price || !supplier || !quantity || !warehouseId) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const newProduct = {
      name,
      type,
      barcode,
      price: parseFloat(price),
      supplier,
      image,
      stocks: [
        {
          id: parseInt(warehouseId),
          quantity: parseInt(quantity),
        },
      ],
      editedBy: [
        {
          warehousemanId: 1, 
          at: new Date().toISOString().split('T')[0],
        },
      ],
    };

    try {
      await axios.post('http://10.0.2.2:3000/products', newProduct);
      Alert.alert('Succès', 'Produit ajouté avec succès.', [
        { text: 'OK', onPress: () => navigation.navigate('ProductList') },
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout du produit.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom du produit *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Type *</Text>
      <TextInput style={styles.input} value={type} onChangeText={setType} />

      <Text style={styles.label}>Code-barres *</Text>
      <TextInput style={styles.input} value={barcode} onChangeText={setBarcode} />

      <Text style={styles.label}>Prix *</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

      <Text style={styles.label}>Fournisseur *</Text>
      <TextInput style={styles.input} value={supplier} onChangeText={setSupplier} />

      <Text style={styles.label}>URL de l'image</Text>
      <TextInput style={styles.input} value={image} onChangeText={setImage} />

      <Text style={styles.label}>Quantité initiale *</Text>
      <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" />

      <Text style={styles.label}>ID de l'entrepôt *</Text>
      <TextInput style={styles.input} value={warehouseId} onChangeText={setWarehouseId} keyboardType="numeric" />

      <Button title="Ajouter le produit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 5,
    borderRadius: 5,
  },
});

export default AddProductScreen;
