import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-paper';

const LoginScreen = () => {
  const [secretKey, setSecretKey] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_APP_API_URL}/warehousemans`);
      const warehousemans = response.data;

      const user = warehousemans.find(w => w.secretKey === secretKey);

      if (user) {
        await AsyncStorage.setItem('@user_data', JSON.stringify(user));
        console.log('User data stored:', user);

        Alert.alert('Succès', `Bienvenue ${user.name} !`);
        navigation.navigate('(tabs)', { user });
      } else {
        Alert.alert('Erreur', 'Code secret incorrect');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur ' + error);
    }
  };

  return (
    <LinearGradient
      colors={['#C0C0C0','red',"#C8C8C8"]}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Connexion</Text>
        <TextInput
          value={secretKey}
          onChangeText={setSecretKey}
          placeholder="Code secret"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#ccc"
        />
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Se connecter
        </Button>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '90%',
    backgroundColor: 'rgba(237, 194, 194, 0.59)', 
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'rgba(40, 37, 37, 0.75)',

  },
});

export default LoginScreen;
