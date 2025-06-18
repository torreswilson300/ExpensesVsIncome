import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Image } from "expo-image";


export default function Index() {
  return (
    //View is same as a div in web
    //Text is same as a p tag in web
    <View
      style={
       styles.container
      }
    >
      <Text style={{color:"red"}}>Edit app/index.tsx to edit this screen.</Text>
     
  
    </View>

    
      
  
  );
}


const styles = StyleSheet.create({
  container:{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "yellow",
  }
      })