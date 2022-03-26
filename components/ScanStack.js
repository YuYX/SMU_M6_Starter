import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
//import ScanScreen from "../screens/AccountScreen"; 
import ScanqrScreen from "../screens/ScanqrScreen";
import CameraScreen from "../screens/CameraScreen";
import { darkStyles, lightStyles } from "../styles/commonStyles";
import { useSelector } from "react-redux";

const Stack = createStackNavigator();

export default function ScanStack() {

  const isDark = useSelector((state) => state.accountPref.isDark);
  const styles = isDark ? darkStyles : lightStyles;

  return (
  <Stack.Navigator>
    <Stack.Screen component={ScanqrScreen} name="Scan" options={{
        title: "Scan QR Code",
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerLeft: null
      }} />
      <Stack.Screen component={CameraScreen} name="Camera" options={{
        title: "Take a photo",
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: styles.headerTint
      }}/> 
  </Stack.Navigator>
  )
}
