import { CameraType, useCameraPermissions } from "expo-camera";
import { useNavigation } from "expo-router";
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "@/app/types/types";

export default function useScanner() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScanned(true);
        console.log("Scanned Barcode Data:", data); 
        alert(`Barcode scanned! Type: ${type}, Data: ${data}`);
        
        if (data) {
            navigation.navigate("AddProductScreen", { scannedBarcode: data });
        } else {
            console.log("Barcode data is undefined.");
        }
    };

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    return {
        facing,
        permission,
        scanned,
        requestPermission,
        handleBarCodeScanned,
        toggleCameraFacing,
    }
}