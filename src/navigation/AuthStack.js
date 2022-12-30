import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import AccountTypeScreen from "../screens/AccountType/AccountTypeScreen";
import CreateAdsScreen from "../screens/Advertisment/CreateAdsScreen";
import CreateAccountScreen from "../screens/CreateAccountScreen/CreateAccountScreen";
import LaunchScreen from "../screens/LaunchScreen/LaunchScreen";
import OnboardingScreen from "../screens/OnboardingScreen/OnboardingScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen/PrivacyPolicyScreen";
import SignInScreen from "../screens/SignInScreen/SignInScreen";
import TermsOfServiceScreen from "../screens/TermsOfServiceScreen/TermsOfServiceScreen";

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>

      <Stack.Screen
        name="CreateAdsScreen"
        component={CreateAdsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        options={{
          headerShown: false,
        }}
      />



      <Stack.Screen
        name="LaunchScreen"
        component={LaunchScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SignInScreen"
        component={SignInScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AccountTypeScreen"
        component={AccountTypeScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="CreateAccountScreen"
        component={CreateAccountScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="TermsOfServiceScreen"
        component={TermsOfServiceScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
