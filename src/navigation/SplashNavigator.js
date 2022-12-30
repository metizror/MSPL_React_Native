import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import SplashScreen from "../screens/SplashScreen/SplashScreen";

const Stack = createStackNavigator();

const SplashNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default SplashNavigator;
