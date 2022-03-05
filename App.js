import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StyleSheet } from "react-native";
import { Provider, useSelector } from "react-redux";
import LoggedInTabStack from "./components/LoggedInTabStack";
import store from "./redux/ConfigureStore";
import SignInSignUpScreen from "./screens/SignInSignUpScreen";

const Stack = createStackNavigator();

function App() {
  const token = useSelector((state) => state.auth.token);
  console.log(token);
  return (
    <NavigationContainer>
      <Stack.Navigator
          initialRouteName={token != null ? "Logged In" : "SignInSignUp"}
          animationEnabled={false}
        screenOptions={{
          headerShown: false,
          headerMode: "none",
        }}
      > 
      <Stack.Screen component={SignInSignUpScreen} name="SignInSignUp" />
      <Stack.Screen component={LoggedInTabStack} name="Logged In" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
