import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import EditListingScreen from "../screens/EditListingScreen/EditListingScreen";
import DeactivateAccount from "../screens/MyProfileScreen/DeactivateAccount";
import NotificationScreen from "../screens/NotificationScreen";
import ViewItemUser from "../screens/ViewItemUser/ViewItemUser";
import TopTabNavigator from "./TopTabNavigator";
import MyProfileTabScreen from "../screens/MyProfileScreen/MyProfileTabScreen";

const Stack = createStackNavigator();
const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator>
     
      <Stack.Screen
        name="Profile"
        component={MyProfileTabScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ViewItemUser"
        component={ViewItemUser}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
