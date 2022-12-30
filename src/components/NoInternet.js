import React from "react";
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from "react-native";
import Icons from "../theme/Icons";
const { height, width } = Dimensions.get("window");

const NoInternet = ({ navigation, menu, onPress }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ImageBackground source={Icons.ic_onboarding1} style={styles.doorStyle}>
        <View style={styles.innerView}>
          <Pressable onPress={onPress}>
            <Image source={Icons.ic_call} />
          </Pressable>
          <Text style={styles.noInternetText}>No Internet Connection</Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  doorStyle: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  innerView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  noInternetText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
  },
});

export default NoInternet;
