import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  TextInput,
  View, 
  TouchableOpacity, 
  Animated,
  TouchableWithoutFeedback,
 } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { commonStyles, darkStyles, lightStyles } from "../styles/commonStyles";
import axios from "axios";

import { API, API_POSTS } from "../constants/API";
import { Entypo } from "@expo/vector-icons";

import * as ImagePicker from 'expo-image-picker';
import { uploadPicAction } from "../redux/ducks/accountPref";

export default function EditScreen({ navigation, route }) {

  const isDark = useSelector((state) => state.accountPref.isDark); 
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); 
  const [base64image, setBase64image] = useState("");
  const token = useSelector((state) => state.auth.token)
  const profilePicture = useSelector((state) => state.accountPref.profilePicture);

  const dispatch = useDispatch();

  useEffect(() => {
    const post = route.params.post
    setTitle(post.title);
    setContent(post.content);
  }, [])

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

  async function editPost() {
    const post = {
      "title": title,
      "content": content, 
    }
    //const token = await AsyncStorage.getItem("token");
    
      
    const id = route.params.post.id
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
         
      <Text style={[additionalStyles.label, styles.text]}>Device MAC Address:</Text>
        <Text style={
          [additionalStyles.label], 
          { color:'magenta', 
            fontSize: 28,  
          }}>{ title }</Text>

        <Text style = {[ additionalStyles.label, styles.text]}>
          Device Information:
        </Text> 
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

      <TouchableOpacity style={[styles.button, {marginTop: 20}]} onPress={editPost}>
        <Text style={styles.buttonText}>
          Save
        </Text>
        </TouchableOpacity>
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
    marginLeft: 5
  },
});
