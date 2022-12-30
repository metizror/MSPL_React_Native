import { DrawerActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  LogBox,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AlertView } from "../../components/AlertView";
import CustomText from "../../components/CustomText";
import { Header } from "../../components/Header";
import Loader from "../../components/Loader";
import { getSubCategoryApiCall } from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Icons from "../../theme/Icons";
import { useTranslation } from "react-i18next";
import { moderateScale } from "../../components/scalling";

const { width, height } = Dimensions.get("window");

LogBox.ignoreAllLogs();
const SubCategoryScreen = ({ navigation, route }) => {
  var categoryId = 0;
  var categoryName = "";

  if (route.params.categoryId != undefined) {
    categoryId = route.params.categoryId;
  }
  if (route.params.categoryName != undefined) {
    categoryName = route.params.categoryName;
  }
  const [isLoading, setLoading] = useState(false);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, showAlertMessage] = useState("");
  const [arrayholder, setArrayholder] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    getSubCategoryData();
    console.log("categoryId", categoryId);
  }, []);
  const getSubCategoryData = () => {
    setLoading(true);

    getSubCategoryApiCall(categoryId)
      .then((res) => {
        setLoading(false);

        console.log("SubCategorty====>", res);
        if (res.success) {
          setSubCategoryList(res.data);
          setArrayholder(res.data);
        } else {
          showAlertMessage(res.message);
          setShowAlert(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("userGetDealerships Error", error);
        showAlertMessage(error.message);
        setShowAlert(true);
      });
  };
  const searchData = (text) => {
    const newData = arrayholder.filter((item) => {
      const itemData = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setSubCategoryList(newData);
  };
  return (
    <View style={styles.container}>
      <Header
        isShowBackButton={true}
        onBack={() => navigation.goBack()}
        showDrawer={true}
        onCartClick={() => {
          navigation.navigate("NotificationScreen");
        }}
        isShowCart={true}
        openDrawer={() => navigation.dispatch(DrawerActions.openDrawer())}
      ></Header>
      <Loader loading={isLoading} />
      <AlertView
        showAlert={showAlert}
        message={alertMessage}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
        onDismiss={() => setShowAlert(false)}
      ></AlertView>
      <KeyboardAwareScrollView>
        <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
          <View style={styles.searchSection}>
            <Image
              style={styles.searchIcon}
              source={Icons.ic_search}
              resizeMode={"cover"}
            />
            <TextInput
              placeholderTextColor={"rgba(203, 203, 203, 1)"}
              style={styles.input}
              placeholder={t("search")}
              onChangeText={(text) => searchData(text)}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>

        <View
          style={{
            marginHorizontal: 15,
            marginTop: 20,
          }}
        >
          <FlatList
            data={subCategoryList}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("SearchResultScreen", {
                    categoryId: categoryId,
                    categoryName: categoryName,
                    subCategoryId: item.id,
                    subCategoryName: item.name,
                  })
                }
                style={{
                  backgroundColor: "white",
                  margin: 5,
                  flex: 1,
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    //  backgroundColor: "white",
                    paddingVertical: 8,
                    marginHorizontal: 8,
                    // backgroundColor: "red",
                  }}
                >
                  <CustomText
                    style={{
                      color: colors.primary,
                      fontSize: moderateScale(28),
                      fontWeight: "700",
                      marginTop: 0,
                    }}
                  >
                    {item.name}
                  </CustomText>
                </View>
              </Pressable>
            )}
            numColumns={1}
            keyExtractor={(item, index) => index}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default SubCategoryScreen;

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
  searchSection: {
    flex: 1,
    flexDirection: "row",
    // justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    margin: 10,
    borderRadius: 15,
    height: 55,
    paddingHorizontal: 10,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingLeft: 5,
    fontSize: moderateScale(22),
    backgroundColor: "#F9F9F9",
    color: colors.black,
    borderRadius: 15,
  },
});
