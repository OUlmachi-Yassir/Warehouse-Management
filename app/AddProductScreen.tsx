import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Switch, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from 'expo-router';
import { RouteProp, useRoute } from '@react-navigation/native';


type RootStackParamList = {
  ProductList: undefined;
  AddProductScreen: { scannedBarcode?: string };
};

type AddProductScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AddProductScreen'
>;

type AddProductScreenRouteProp = RouteProp<RootStackParamList, 'AddProductScreen'>;


interface Props {
  route:any;
}


const AddProductScreen: React.FC<Props> = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); 
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [barcode, setBarcode] = useState('');
  const [price, setPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [image, setImage] = useState('');
  const [quantity, setQuantity] = useState('');
  const [warehouseId, setWarehouseId] = useState(null);
  const [warehouseLocation, setWarehouseLocation] = useState(null);
  const [isStockAvailable, setIsStockAvailable] = useState(true);
  const route = useRoute<AddProductScreenRouteProp>();
  useEffect(() => {
    console.log("Route params:", route.params);
    console.log("Received scannedBarcode:", route?.params?.scannedBarcode);
    if (route?.params?.scannedBarcode) {
      setBarcode(route.params.scannedBarcode);
    }

    const getUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@user_data');
        if (jsonValue != null) {
          const user = JSON.parse(jsonValue);
          setWarehouseId(user.warehouseId);
          setWarehouseLocation(user.localisation);
        }
      } catch (e) {
        console.error('Error retrieving user data:', e);
      }
    };

    getUserData();
  }, [route?.params?.scannedBarcode]);

  const handleSubmit = async () => {
    if (!name || !type || !barcode || !price || !supplier) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (isStockAvailable && !quantity) {
      Alert.alert('Erreur', 'Veuillez spécifier une quantité en stock.');
      return;
    }

    const newProduct = {
      name,
      type,
      barcode,
      price: parseFloat(price),
      supplier,
      image,
      stocks: isStockAvailable
        ? [
            {
              id: warehouseId,
              name: `Entrepôt ${warehouseId}`,
              quantity: parseInt(quantity),
              localisation: warehouseLocation,
            },
          ]
        : [],
      editedBy: [
        {
          warehousemanId: warehouseId,
          at: new Date().toISOString().split('T')[0],
        },
      ],
    };

    try {
      await axios.post(`${process.env.EXPO_PUBLIC_APP_API_URL}/products`, newProduct);
      Alert.alert('Succès', 'Produit ajouté avec succès.', [
        { text: 'OK', onPress: () => navigation.popToTop() },
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout du produit.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nom du produit *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Type *</Text>
      <TextInput style={styles.input} value={type} onChangeText={setType} />

      <Text style={styles.label}>Code-barres *</Text>
      <TextInput style={styles.input} value={barcode} onChangeText={setBarcode} />

      <Text style={styles.label}>Prix *</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Fournisseur *</Text>
      <TextInput style={styles.input} value={supplier} onChangeText={setSupplier} />

      <Text style={styles.label}>URL de l'image</Text>
      <TextInput style={styles.input} value={image} onChangeText={setImage} />

      <Text style={styles.label}>Quantité initiale *</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        editable={isStockAvailable}
      />

      <Text style={styles.label}>Stock disponible</Text>
      <View style={styles.switchContainer}>
        <Text>Oui</Text>
        <Switch
          value={isStockAvailable}
          onValueChange={setIsStockAvailable}
        />
        <Text>Non</Text>
      </View>

      <Text style={styles.label}>Localisation de l'entrepôt *</Text>
      <RNPickerSelect
        onValueChange={(value) => setWarehouseLocation(value)}
        items={[
          { label: 'Marrakech', value: { city: 'Marrakech', latitude: 31.628674, longitude: -7.992047 } },
          { label: 'Oujda', value: { city: 'Oujda', latitude: 34.689404, longitude: -1.912823 } },
        ]}
      />

      <Button title="Ajouter le produit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal:20,
    paddingBottom:10
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  button:{

  }
});

export default AddProductScreen;
