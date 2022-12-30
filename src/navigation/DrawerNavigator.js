import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { BottomTabNavigator } from "../navigation/BottomTabNavigator";
import EditListingScreen from "../screens/EditListingScreen/EditListingScreen";
import DeactivateAccount from "../screens/MyProfileScreen/DeactivateAccount";
import { DrawerContent } from "./DrawerContent";


const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: { width: "100%" },
          headerShown: false,
        }}
        initialRouteName="BottomTabNavigator"
        drawerContent={(props) => <DrawerContent {...props} />}
      >
        <Drawer.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
        />
        <Drawer.Screen name="EditListingScreen" component={EditListingScreen} />
        <Drawer.Screen name="DeactivateAccount" component={DeactivateAccount} />
      </Drawer.Navigator>
    </>
  );
};

export default DrawerNavigator;
