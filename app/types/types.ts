import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
    CameraScanner: undefined;
    AddProductScreen: { scannedBarcode: string };
  };
  

  
  export type AddProductScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'AddProductScreen'
  >;
  
 export type AddProductScreenRouteProp = RouteProp<RootStackParamList, 'AddProductScreen'>;