import React, { useState, useEffect } from "react";
import { 
  ActivityIndicator, 
  TouchableOpacity, 
  Text, 
  View, 
  Switch, 
  Image, 
  Animated, 
  TouchableWithoutFeedback,
} from "react-native";
import { commonStyles, lightStyles, darkStyles } from "../styles/commonStyles";
import axios from "axios";
import { API, API_WHOAMI } from "../constants/API";
import { useDispatch, useSelector } from "react-redux";
import { changeModeAction } from '../redux/ducks/accountPref';
import { logOutAction } from "../redux/ducks/blogAuth";
export default function AccountScreen({ navigation }) {
  const [username, setUsername] = useState(null);
  
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPref.isDark);
  const profilePicture = useSelector((state) => state.accountPref.profilePicture);
  const dispatch = useDispatch();

  const picSize = new Animated.Value(200);
  const sizeInterpolation = {
    inputRange: [0, 0.5, 1],
    outputRange: [200, 300, 200]
  }  

  const styles = { ...commonStyles, ...isDark ? darkStyles : lightStyles };

  async function getUsername() {
    console.log("---- Getting user name ----");
    console.log(`Token is ${token}`);
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got user name!");
      setUsername(response.data.username);
    } catch (error) {
      console.log("Error getting user name");
      if (error.response) {
        console.log(error.response.data);
        if (error.response.data.status_code === 401) {
          signOut();
          navigation.navigate("SignInSignUp")
        }
      } else {
        console.log(error);
      }
      // We should probably go back to the login screen???
    }
  }
  function signOut() {
    dispatch(logOutAction())
    navigation.navigate("SignInSignUp");
  }
  function switchMode() {
    dispatch(changeModeAction())
  }

  function changePicSize() {
    Animated.loop(
      Animated.timing(picSize, {
        toValue: 300,
        duration: 2500,
        useNativeDriver: false
      }),
    ).start()
  }

  useEffect(() => {
    console.log("Setting up nav listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      setUsername(<ActivityIndicator />);
      getUsername();
    });
    getUsername();
    return removeListener;
  }, []);
  return (
    <View style={[styles.container, { alignItems: "center" }]}>
      <Text style={[styles.title, styles.text, { margin: 30 }]}> Hello {username} !</Text>
      {profilePicture == null ? <View /> :
        <TouchableWithoutFeedback onPress={changePicSize}>
          <Animated.Image 
            style={{ width: picSize, height: picSize, borderRadius: 200 }} 
            source={{ uri: profilePicture }} />
        </TouchableWithoutFeedback>
      }
      <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
          <Text style={{ marginTop: 10, fontSize: 20, color: "#0000EE" }}> No profile picture. Click to take one. </Text>
          </TouchableOpacity>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 20}}>
        <Text style={[styles.content, styles.text]}> Dark Mode? </Text>
        <Switch
          value={isDark}
          onChange={switchMode}/>
      </View>
      <TouchableOpacity style={[styles.button]} onPress={signOut}>
        <Text style={styles.buttonText}>
          Sign Out
        </Text>
        </TouchableOpacity>
    </View>
  );
}