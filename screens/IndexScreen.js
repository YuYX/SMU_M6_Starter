import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API, API_POSTS } from "../constants/API";
import { darkStyles, lightStyles } from "../styles/commonStyles";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logOutAction } from "../redux/ducks/blogAuth"; 

export default function IndexScreen({ navigation, route }) {

  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPref.isDark);

  

  const styles = isDark ? darkStyles : lightStyles;
  
  const dispatch = useDispatch();

  function signOut() {
    dispatch(logOutAction())
    navigation.navigate("SignInSignUp");
  }

  // This is to set up the top right button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={signOut}>  
        <Text style={{color: "blue", marginRight: 5}}>Sign Out</Text>      
        <FontAwesome
            name="sign-out"
            size={24}
            style={{ color: styles.headerTint, marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  });

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

  async function getPosts() {
    
    try {
      const response = await axios.get(API + API_POSTS, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("getPosts Result:");
      console.log(response.data);
      console.log("getPosts Result.....END");
      setPosts(response.data);
      return "completed";
    } catch (error) {
      console.log(error.response.data);
      if ((error.response.data.error = "Invalid token")) {
        navigation.navigate("SignInSignUp");
      }
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    const response = await getPosts();
    setRefreshing(false);
  }

  function addPost() {
    navigation.navigate("Add")
  }

  async function deletePost(id) {
    
    console.log("Deleting " + id);
    try {
      const response = await axios.delete(API + API_POSTS + `/${id}`, {
        headers: { Authorization: `JWT ${token}` },
      })
      console.log(response);
      setPosts(posts.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error)
    } 
  }

  function selectPost(id){
    navigation.navigate("Details", {id: id});
  }

  // The function to render each row in our FlatList
  function renderItem({ item }) {
    return (
      // <TouchableOpacity onPress={() => navigation.navigate("Details", {id: item.id})}>
      <TouchableOpacity onPress={ () => selectPost( item.id ) }>
        <View
          style={{
            padding: 10,
            paddingTop: 20,
            paddingBottom: 20,
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.text}>{item.title}</Text>
          <TouchableOpacity onPress={() => deletePost(item.id)}>
            <FontAwesome name="trash" size={20} color="#a80000" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#9Bd35A", "#689F38"]}
          />
        }
      />
    </View>
  );
}

