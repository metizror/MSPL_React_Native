import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import FavouriteScreen from "../screens/FavouriteScreen/FavouriteScreen";
import NotificationScreen from "../screens/NotificationScreen";
import ViewItemUser from "../screens/ViewItemUser/ViewItemUser";

const Stack = createStackNavigator();
const FavoriteStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FavouriteScreen"
        component={FavouriteScreen}
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
      <Stack.Screen
        name="ViewItemUser"
        component={ViewItemUser}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default FavoriteStackNavigator;
