import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [secretKey, setSecretKey] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.get('http://192.168.9.32:3000/warehousemans');
      const warehousemans = await response.json();
      
      const user = warehousemans.find(w => w.secretKey === secretKey);
      
      if (user) {
        Alert.alert("Succès", `Bienvenue ${user.name} !`);
        navigation.navigate("Home", { user });
      } else {
        Alert.alert("Erreur", "Code secret incorrect");
      }
    } catch (error) {
    console.log(error)
      Alert.alert("Erreur", "Impossible de se connecter au serveur " + error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Entrez votre code secret :</Text>
      <TextInput
        value={secretKey}
        onChangeText={setSecretKey}
        placeholder="Code secret"
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Se connecter" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
