import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  LogBox,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomText from "../../components/CustomText";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ViewHeader } from "../../components/ViewHeader";
import Localization from "../../Localization/Localization";
import colors from "../../theme/colors";
import Icons from "../../theme/Icons";
import { StaticData } from "../ViewItems/StaticData";
const { width, height } = Dimensions.get("window");

LogBox.ignoreAllLogs();
const ViewVendorService = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <ViewHeader
          mainStyle={{ marginBottom: -15, marginTop: -10 }}
        ></ViewHeader>

        <View
          style={{
            paddingHorizontal: 20,
            borderRadius: 20,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: -60,
            }}
          >
            <Image
              style={{
                height: 120,
                width: 120,
                borderColor: "#FFFFFF",
                borderWidth: 3,
                borderRadius: 60,
              }}
              source={Icons.ic_demo}
            ></Image>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 5,
              }}
            >
              <Image
                style={{
                  height: 12,
                  width: 12,
                }}
                source={Icons.ic_like}
                resizeMode={"contain"}
              ></Image>
              <CustomText style={{ fontSize: 14, marginTop: 0, marginLeft: 5 }}>
                {"11"}
              </CustomText>
            </View>
          </View>

          <CustomText
            style={{
              fontWeight: "700",
              fontSize: 18,
              textAlign: "center",
              marginTop: 0,
            }}
          >
            {"Rachel Riley"}
          </CustomText>
          <CustomText
            style={{
              fontWeight: "400",
              fontSize: 12,
              textAlign: "center",
              marginTop: 0,
            }}
          >
            {"152 University Lane Austin, TX 78749"}
          </CustomText>
          <CustomText
            style={{
              fontWeight: "400",
              fontSize: 12,
              textAlign: "center",
              marginTop: 0,
              marginLeft: 30,
              marginRight: 30,
            }}
          >
            {Localization.common_text}
          </CustomText>

          <PrimaryButton
            onPress={() => alert("hello")}
            title={"Visit Site"}
          ></PrimaryButton>

          <PrimaryButton
            onPress={() => navigation.navigate("DrawerNavigator")}
            title={"Start Chat"}
          ></PrimaryButton>

          <PrimaryButton
            onPress={() => navigation.navigate("DrawerNavigator")}
            title={"Get Directions"}
          ></PrimaryButton>

          <CustomText
            style={{
              fontWeight: "700",
              fontSize: 16,
              marginBottom: 5,
              marginTop: 15,
            }}
          >
            {"Listings By This User"}
          </CustomText>
        </View>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <FlatList
            data={StaticData.accountTransactionData}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => navigation.navigate("InventoryDetails")}
                style={{
                  backgroundColor: "white",
                  borderRadius: 10,
                  overflow: "hidden",

                  shadowColor:
                    Platform.OS == "ios" ? "#00000029" : "rgba(0, 0, 0, 0.6)",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  elevation: Platform.OS === "ios" ? 0.1 : 7,
                  shadowOpacity: 1.0,
                  margin: 5,
                }}
              >
                <ImageBackground
                  style={{
                    overflow: "hidden",
                    height: 140,
                    width: width / 2 - 15,
                  }}
                  source={Icons.ic_demo}
                  resizeMode={"cover"}
                >
                  <Image
                    style={{
                      height: 40,
                      width: 40,
                      alignSelf: "flex-end",
                      marginTop: 10,
                      marginRight: 10,
                    }}
                    source={Icons.ic_wish_list_unfill}
                    resizeMode={"contain"}
                  ></Image>
                </ImageBackground>
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <CustomText
                      style={{
                        textAlign: "center",
                        color: colors.black,
                        fontSize: 12,
                        fontWeight: "700",
                        marginTop: 0,
                      }}
                    >
                      {"Red Dress"}
                    </CustomText>

                    <CustomText
                      style={{
                        color: colors.primary,
                        fontSize: 12,
                        fontWeight: "700",
                        marginTop: 0,

                        textAlign: "right",
                        flex: 1,
                      }}
                    >
                      {"$129"}
                    </CustomText>
                  </View>

                  <CustomText
                    style={{
                      color: colors.grey,
                      fontSize: 10,
                      fontWeight: "400",
                      marginTop: 0,
                    }}
                  >
                    {"Womens Clothing"}
                  </CustomText>

                  <View
                    style={{
                      backgroundColor: colors.black,
                      width: 11,
                      height: 1,
                      marginTop: 5,
                    }}
                  ></View>
                </View>
              </Pressable>
            )}
            numColumns={2}
            keyExtractor={(item, index) => index}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ViewVendorService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  imageStyle: {
    height: 120,
    width: "100%",
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});
