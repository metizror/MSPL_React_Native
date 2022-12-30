import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ChatDetailsScreen from "../screens/ChatListScreen/ChatDetailsScreen";
import ChatListScreen from "../screens/ChatListScreen/ChatListScreen";
import NotificationScreen from "../screens/NotificationScreen";
import ViewUser from "../screens/ViewUser/ViewUser";

const Stack = createStackNavigator();
const MessagesStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Message">
      <Stack.Screen
        name="Message"
        component={ChatListScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ChatDetailsScreen"
        component={ChatDetailsScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ViewUser"
        component={ViewUser}
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

export default MessagesStackNavigator;
