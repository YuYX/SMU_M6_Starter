import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { 
    Text, 
    TouchableOpacity, 
    Animated,
    TouchableWithoutFeedback,
    View } from "react-native";
import { useSelector } from "react-redux"; 
import { API, API_POSTS } from "../constants/API";


import { commonStyles, lightStyles, darkStyles } from "../styles/commonStyles";

export default function ShowScreen({ navigation, route }) {

  const [post, setPost] = useState({title: "", content: ""});
  
  const profilePicture = useSelector((state) => state.accountPref.profilePicture);

  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPref.isDark);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={editPost} style={{ marginRight: 10 }}>
          <FontAwesome
            name="pencil-square-o"
            size={30}
            color={styles.headerTint}
          />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    getPost();
  }, []);

  async function getPost() {
    
    const id = route.params.id
    console.log(id)
    try {
      const response = await axios.get(API + API_POSTS + "/" + id, {
        headers: { Authorization: `JWT ${token}` },
      })
      console.log(response.data);
      setPost(response.data);
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data.error = "Invalid token") {
        navigation.navigate("SignInSignUp");
      }
    }
  }

  function editPost() {
    navigation.navigate("Edit", { post: post }) 
    //navigation.navigate("Add", {post: post})
  }
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.text, { margin: 40 }]}>{post.title}</Text>
      <Text style={[styles.content, styles.text, { margin: 20 }]}>{post.content}</Text>

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
              marginLeft: 50,
               }} 
            source={{ uri: profilePicture }} />
        </TouchableWithoutFeedback>
      }
      </View>

    </View> 
  );
}
