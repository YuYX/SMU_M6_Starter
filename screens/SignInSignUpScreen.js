import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Keyboard,
  LayoutAnimation,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
  Image,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { API, API_LOGIN, API_SIGNUP } from "../constants/API";
import { logInAction } from "../redux/ducks/blogAuth";
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
} //Needs to be manually enabled for android

export default function SignInSignUpScreen({ navigation }) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState('') 

  const [isLogIn, setIsLogIn] = useState(true) 

  const [confirmPassword, setConfirmPassword] = useState('')
  const [authpass, setAuthpass] = useState(false)

  const dispatch = useDispatch();  

  useEffect( ()=>{
    if( authpass == true) 
    {
       getToken();    
    }
  })

  useEffect( () =>{
    if(authpass == true  && username != "" && password !="" )
    {
      login();
      setAuthpass(false);
    }
  })

  async function authenticate() {
    if (loading) {
      return;
    } 
    setLoading(true);
 
    try{
      const results = await LocalAuthentication.authenticateAsync(); 

      if (results.success) {   
  
        console.log('SUCCESS');  

        //This is a hard-coding for demo purpose.
        //Needed to save them to local device so next time user don't need to key-in again.
        //setUsername('yuyx');
        //setPassword('12345678');  
        getToken(); 
        setAuthpass(true); 

        console.log("Authenticate-Username:", {username});  
        console.log("Authenticate-Password:", {password});  

      } else{
        setAuthpass(false); 
        console.log(results.error);
      }  
    }catch(error)
    {
      setAuthpass(false); 
      setLoading(false);
      console.log(error.description);
    }

    setLoading(false);
  };  

  async function storeToken() {
    try {
       await AsyncStorage.setItem("userData", JSON.stringify({username, password}));
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }

  async function getToken() {
    try {
      let userData = await AsyncStorage.getItem("userData");
      let data = JSON.parse(userData);
      setUsername(data.username);
      setPassword(data.password);
      console.log("AsyncStorage-username:", {username});
      console.log("AsyncStorage-password:", {password});
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }

  async function login() {
    console.log("---- Login time ----");
    Keyboard.dismiss();

    try {
      setLoading(true);
      const response = await axios.post(API + API_LOGIN, {
        username,
        password,
      });
      console.log("Success logging in!");
      console.log(response.data.access_token);
      dispatch({ ...logInAction(), payload: response.data.access_token });

      storeToken();

      setLoading(false);
      setUsername("");
      setPassword("");
      navigation.navigate("Logged In");
    } catch (error) {
      setLoading(false);
      console.log("Error logging in!");
      console.log(error);
      setErrorText(error.response.data.description);
      if (error.response.status = 404) {
        setErrorText("User does not exist")
      }
    }
  }

  async function signUp() {
    if (password != confirmPassword) {
      setErrorText("Your passwords don't match. Check and try again.")
    } else {
      try {
        setLoading(true);
        const response = await axios.post(API + API_SIGNUP, {
          username,
          password,
        });
        if (response.data.Error) {
          // We have an error message for if the user already exists
          setErrorText(response.data.Error);
          setLoading(false);
        } else {
          console.log("Success signing up!");
          setLoading(false);
          login();
        }
      } catch (error) {
        setLoading(false);
        console.log("Error logging in!");
        console.log(error.response);
        setErrorText(error.response.data.description);
      }
    }
  } 

  function returnComponents()
  {
    return(
    <View style={styles.container}>
      <Image source= { require("../assets/avire-logo.png") }/>

      <Text style={styles.title}>
        {isLogIn ? 'login' : 'signUp'}
      </Text> 

      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Username:"
          placeholderTextColor="#003f5c"
          value={username}
          onChangeText={(username) => setUsername(username)}
        />
      </View>
  
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Password:"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          value={password}
          onChangeText={(pw) => setPassword(pw)}
        />
      </View>

      {isLogIn ? <View/> :
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Confirm Password:"
            placeholderTextColor="#003f5c"
            secureTextEntry={true} 
            onChangeText={(pw) => setConfirmPassword(pw)}
          />
        </View>}

      <View/>
      <View>
        <View style={{flexDirection: "row"}}>
          <TouchableOpacity style={styles.button} onPress={ isLogIn ? login : signUp}>
            <Text style={styles.buttonText}> {isLogIn ? "Log In" : "Sign Up"} </Text>
          </TouchableOpacity>

          {loading ? <ActivityIndicator style={{ marginLeft: 10 }}/> : <View/>}

          {isLogIn ?
          <TouchableOpacity onPress={authenticate}   style={{ marginRight: 10 }}>
            <Entypo
              name="fingerprint"
              size={60}
              color={styles.headerTint} 
            /> 
          </TouchableOpacity> : null}

        </View>
      </View>
      <Text style={styles.errorText}>
        {errorText}
      </Text>
      <TouchableOpacity
        onPress={() => {
        
          LayoutAnimation.configureNext({
            duration: 700,
            create: { type: 'linear', property: 'opacity' },
            update: { type: 'spring', springDamping: 0.4 }
          });
         
          setIsLogIn(!isLogIn);
          setErrorText("");
        }}>
          <Text style={styles.switchText}> {isLogIn ? "No account? Sign up now." : "Already have an account? Log in here."}</Text>
      </TouchableOpacity>
    </View>
    )
  } 

  return (
    returnComponents() 
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 40, 
    margin: 20
  },
  switchText: {
    color: 'blue',
    fontWeight: '400',
    fontSize: 20, 
    marginTop: 20
  },
  inputView: {
    backgroundColor: "#CCF0CB",
    borderRadius: 10,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },
  button: {
    backgroundColor: "rgb(112,146,190)",
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: '400',
    fontSize: 20, 
    margin: 20,
    color: 'white'
  },
  errorText: {
    fontSize: 15,
    color: 'red',
    marginTop: 20
  }
});
