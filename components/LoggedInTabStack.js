import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BlogStack from "../components/BlogStack";
import AccountStack from "../components/AccountStack";
import ScanStack from "../components/ScanStack";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator();

export default function LoggedInTabStack() {
  const isDark = useSelector((state) => state.accountPref.isDark);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: isDark ? "#181818" : "white",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Device') {
            iconName = "desktop"
          } else if (route.name === 'Settings') {
            iconName = "cog"
          } else if (route.name === 'Scan'){
            iconName = "qrcode"
          }
          // You can return any component that you like here!
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
        <Tab.Screen name="Device" component={BlogStack} />
        <Tab.Screen name="Scan" component={ScanStack} />
        {/*<Tab.Screen name="Settings" component={AccountStack} />*/}
      </Tab.Navigator>
  )
} 