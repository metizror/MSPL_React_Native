import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import NoInternet from "../components/NoInternet";
import CreateAdsScreen from "../screens/Advertisment/CreateAdsScreen";
import ChatDetailsScreen from "../screens/ChatListScreen/ChatDetailsScreen";
import ContactUsScreen from "../screens/ContactUsScreen/ContactUsScreen";
import CreateListingScreen from "../screens/CreateListingScreen/CreateListingScreen";
import FAQScreen from "../screens/FAQScreen/FAQScreen";
import MapViewScreen from "../screens/MapViewScreen/MapViewScreen";
import NotificationScreen from "../screens/NotificationScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen/PrivacyPolicyScreen";
import CategoryScreen from "../screens/SearchScreen/CategoryScreen";
import SearchResultScreen from "../screens/SearchScreen/SearchResultScreen";
import SubCategoryScreen from "../screens/SearchScreen/SubCategoryScreen";
import Subscription from "../screens/Subscription/Subscription";
import TermsOfServiceScreen from "../screens/TermsOfServiceScreen/TermsOfServiceScreen";
import ViewItems from "../screens/ViewItems/ViewItems";
import ViewItemUser from "../screens/ViewItemUser/ViewItemUser";
import ViewUser from "../screens/ViewUser/ViewUser";


const Stack = createStackNavigator();
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>


      <Stack.Screen
        name="ViewItems"
        component={ViewItems}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NoInternet"
        component={NoInternet}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SubCategoryScreen"
        component={SubCategoryScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SearchResultScreen"
        component={SearchResultScreen}
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
        name="MapViewScreen"
        component={MapViewScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Subscription"
        component={Subscription}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ContactUsScreen"
        component={ContactUsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FAQScreen"
        component={FAQScreen}
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
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
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
        name="ChatDetailsScreen"
        component={ChatDetailsScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="CreateAdsScreen"
        component={CreateAdsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
