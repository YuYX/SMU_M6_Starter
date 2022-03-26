import React, { useState, useEffect } from 'react';
import { 
        Text, 
        View, 
        StyleSheet, 
        Button,
     } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { uploadMacAction } from '../redux/ducks/accountPref'; 

export default function ScanqrScreen({ navigation }) {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [content, setContent] = useState('');   
  
  const token = useSelector((state) => state.auth.token); 
  const macAddress = useSelector((state) => state.accountPref.macAddress);
  
  const dispatch = useDispatch(); 

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setContent(data);
    setScanned(true);
 
    dispatch({ ...dispatch(uploadMacAction()), payload: data });

    console.log({data});
    navigation.navigate("Add");
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}> 
      
       
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && 
        <Button 
            title={'Tap to Scan Again'} 
            onPress={() => setScanned(false)}
        />} 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  barCodeView: {
    width: '100%', 
    height: '50%', 
    marginBottom: 40
  },
});