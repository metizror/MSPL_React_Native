import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ConvertBusinessAccount from "../screens/ConvertBusinessAccount/ConvertBusinessAccount";
import CreateListingScreen from "../screens/CreateListingScreen/CreateListingScreen";
import NotificationScreen from "../screens/NotificationScreen";

const Stack = createStackNavigator();
const CreateListingNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="CreateListingScreen">
      <Stack.Screen
        name="CreateListingScreen"
        component={CreateListingScreen}
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
        name="ConvertBusinessAccount"
        component={ConvertBusinessAccount}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default CreateListingNavigator;
