import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../theme/colors";
import Icons from "../theme/Icons";
import CreateListingNavigator from "./CreateListingNavigator";
import FavoriteStackNavigator from "./FavoriteStackNavigator";
import HomeStackNavigator from "./HomeStackNavigator";
import MessagesStackNavigator from "./MessagesStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get("window");
export function BottomTabNavigator({ navigation, route }) {
 

  
  return (
    <>
      <Tab.Navigator
      
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          headerShown: false,
        }}
        tabBarOptions={{
          style: {
            backgroundColor: colors.primary,
            position: "absolute",
            bottom: 0,
            elevation: 2,
          },
          showLabel: false,
        }}
      >
        <Tab.Screen
          name="HomeStackNavigator"
          component={HomeStackNavigator}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size, focused }) => (
              <Image
                source={Icons.ic_home}
                style={{
                  resizeMode: "contain",
                  tintColor: focused ? colors.primary : "#CBCBCB",
                }}
              />
            ),
          }}
        />

        <Tab.Screen
          name="MessagesStackNavigator"
          component={MessagesStackNavigator}
          options={{
            tabBarLabel: "Message",
            tabBarIcon: ({ color, size, focused }) => (
              <Image
                source={Icons.ic_message}
                style={{
                  resizeMode: "contain",
                  tintColor: focused ? colors.primary : "#CBCBCB",
                }}
              />
            ),
          }}
        />

        <Tab.Screen
          name="CreateListingNavigator"
          component={CreateListingNavigator}
          options={{
            tabBarButton: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("CreateListingNavigator")}
              >
                <View style={styles.container_center} pointerEvents="box-none">
                  <Image source={Icons.ic_post} />
                </View>
              </TouchableOpacity>
            ),
          }}
        />


        <Tab.Screen
          name="FavoriteStackNavigator"
          component={FavoriteStackNavigator}
          options={{
            tabBarLabel: "Favorite",
            tabBarIcon: ({ color, size, focused }) => (
              <Image
                source={Icons.ic_wishlist}
                style={{
                  resizeMode: "contain",
                  tintColor: focused ? colors.primary : "#CBCBCB",
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="ProfileStackNavigator"
          component={ProfileStackNavigator}
          // component={AccountInfoScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size, focused }) => (
              <Image
                source={Icons.ic_user}
                style={{
                  resizeMode: "contain",
                  tintColor: focused ? colors.primary : "#CBCBCB",
                }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container_center: {
    position: "relative",
    //width: 75,
    alignItems: "center",
    marginTop: -35,
  },
  buttonIcon: {
    fontSize: 16,
    color: "#F6F7EB",
  },
  navigatorContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  navigator: {
    borderTopWidth: 0,
    backgroundColor: "transparent",
    elevation: 30,
  },
  xFillLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 34,
  },
});
