import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  TouchableWithoutFeedback,
  View,
} from "react-native"; 

import * as ImagePicker from 'expo-image-picker';
import { Entypo } from "@expo/vector-icons";
import { uploadPicAction } from "../redux/ducks/accountPref";

import { API, API_POSTS,  API_CREATE } from "../constants/API";
import { commonStyles, darkStyles, lightStyles } from "../styles/commonStyles"; 

import { useDispatch, useSelector } from "react-redux"; 
import { withDecay } from "react-native-reanimated";

export default function CreateScreen({ navigation }) {

  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPref.isDark);
  const macAddress = useSelector((state) => state.accountPref.macAddress);
  const profilePicture = useSelector((state) => state.accountPref.profilePicture);
  const dispatch = useDispatch();

  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };

  //const dispatch = useDispatch();
  console.log("MAC Address read:", { macAddress });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");   
  const [posts, setPosts] = useState([]);
  const [registered, setRegistered] = useState(false);
  const [registeredID, setRegisteredID] = useState(0);
  const [base64image, setBase64image] = useState("");


  // useEffect(() => {
  //   const post = route.params.post
  //   console.log("The post carried on: ", {post});
  //   setTitle(post.title);
  //   setContent(post.content);
  // }, [])

  // In order to check whether this MAC Address is already registered,
  // Need to search MAC address from all the exiting post.
  // If this MAC is not registered, use CREATE method,
  // If this MAC is registered already, use UPDATE method.
  //
  // I think this should be done on server side, imagining if the 
  // number of posts in the data base are big enough. 
  // I will explore how to implement this in Flask_app.py code.
  // 
  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    console.log("Setting up nav listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      getPosts();
    });
    getPosts();
    return removeListener;
  }, []);

 function findIdByTitle(data, title){ 
   try{
    const el = data.find(el => el.title === title); // Possibly returns `undefined` 
    setRegistered( el && el.id );
    setRegisteredID(el.id);
    console.log("Searching Result:", el.id)
   }catch(error){
     console.log(error.description)
   }
    //return el && el.id; // so check result is truthy and extract `id`
  } 

  async function getPosts() { 
    try {
      const response = await axios.get(API + API_POSTS, {
        headers: { Authorization: `JWT ${token}` },
      }); 
      //console.log(response.data); 
      setPosts(response.data);
      //console.log("Post list Read:", posts)
      
      // Cannot call findIdByTitle(posts, macAddress), since the setPosts() is just called,
      // most likely the posts variable has not been updated yet.
      findIdByTitle(response.data, macAddress)
      // "A8:63:7D:C8:37:55"

      return "completed";
    } catch (error) {
      console.log(error.response.data);
      if ((error.response.data.error = "Invalid token")) {
        navigation.navigate("SignInSignUp");
      }
    }
  }
  
  async function chooseFromGallery(){
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(permissionResult.granted == false)
    {
      alert("You are refused to allow this app to access your photos!")
      return;
    }

    // The only parameter 'options' in calling launchImageLibraryAsync(options) should
    // include 'includeBase64' in order to upload the image to Flask/SQLite in the 
    // form of Base64 string.
    //
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      includeBase64: 1,
    });

    console.log(result);

    if (!result.cancelled) {  
      setBase64image (result.base64);
      dispatch({ ...dispatch(uploadPicAction()), payload: result.uri }); 
    } 
  }  

  // function changePicSize() {
  //   Animated.loop(
  //     Animated.timing(picSize, {
  //       toValue: 1,
  //       duration: 2500,
  //       useNativeDriver: false
  //     }) 
  //   ).start()
  // }

  function setDefaultDeviceName()
  {
    if(content == "")  setContent("ATOM Premium Series 15\" Touch");
  }
  
  async function savePost() {
    const post = {
      title: macAddress,
      content: content,
      // image: base64image,
    };
     
    try {
      console.log(token);
      const response = await axios.post(API + API_CREATE, post, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response.data);
      navigation.navigate("Index", { post: post });
    } catch (error) {
      console.log(error);
    }
  }

  async function updatePost() {
    const post = {
      "title": macAddress,
      "content": content,
      // "image": base64image,
    } 
      
    const id = registeredID;
    try {
      
      console.log(token);
      const response = await axios.put(API + API_POSTS + "/" + id, post, {
        headers: { Authorization: `JWT ${token}` },
      })
      console.log(response.data)
      navigation.navigate("Index")
    } catch (error) { 
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ margin: 20 }}>
        <Text style={[additionalStyles.label, styles.text]}>MAC Address Read:</Text>
        <Text style={
          [additionalStyles.label], 
          { color:'magenta', 
            fontSize: 28,  
          }}>{ macAddress }</Text>
        {/* <TextInput
          style={additionalStyles.input}
          value={title}
          onChangeText={(text) => setTitle(text)}
        /> */} 
        <Text style = {[ additionalStyles.label, styles.text]}>
          Device Information:
        </Text>
        { setDefaultDeviceName() } 
        <TextInput
          style={additionalStyles.input}
          
          value = { content }
          onChangeText={(text) => setContent(text)}
        />    

        <View style={{flexDirection: "row"}}>
        <TouchableOpacity>        
          <Text style={[additionalStyles.label, styles.text]}>
            Choose Layout from Gallery:
          </Text>
        </TouchableOpacity> 

        <TouchableOpacity onPress={ chooseFromGallery } style={{marginLeft:10}}> 
          <Entypo
            name="image"
            size={30}
            color={styles.headerTint}   
          /> 
        </TouchableOpacity>
        </View>

        <View style={{
        height: profilePicture == null ? 0 : 260,
        justifyContent: "center",
        }}>
        {profilePicture == null ? <View /> :
          <TouchableWithoutFeedback>
            <Animated.Image 
              style={{ 
                width: 200, 
                height: 200,  
                }} 
              source={{ uri: profilePicture }} />
          </TouchableWithoutFeedback>
        }
      </View>

        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress ={ registered? updatePost : savePost}
        >
          <Text style={styles.buttonText}>
            { registered? "Update Device":" Register Device" }
          </Text> 

        </TouchableOpacity>

        { registered ?
        <TouchableOpacity>
         <Text style = {{color:'red', fontWeight:'bold'}}>* This device is already registered.</Text>
        </TouchableOpacity> : null
        }
      </View>
    </View>
  );
}

const additionalStyles = StyleSheet.create({
  input: {
    fontSize: 24,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 15,
    color: 'magenta',
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 5,
  },
});