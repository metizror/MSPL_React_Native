import { DrawerActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { moderateScale } from "../../components/scalling";
import { getCategoryApiCall } from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Icons from "../../theme/Icons";

const { width, height } = Dimensions.get("window");

LogBox.ignoreAllLogs();
const CategoryScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [arrayholder, setArrayholder] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, showAlertMessage] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    getCategoryData();
  }, []);
  const getCategoryData = () => {
    setLoading(true);

    getCategoryApiCall()
      .then((res) => {
        setLoading(false);

        console.log("Categorty====>", res);
        if (res.success) {
          setCategoryList(res.data);
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

  const [text, setText] = useState("");
  const searchData = (text) => {
    const newData = arrayholder.filter((item) => {
      const itemData = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setCategoryList(newData);
    setText(text);
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
              value={text}
              onChangeText={(text) => searchData(text)}
              underlineColorAndroid="transparent"
            />
          </View>
        
        </View>

        <View
          style={{
            //justifyContent: 'center',
            //alignItems: 'center',
            marginHorizontal: 15,
            marginTop: 20,
            //backgroundColor: 'red'
          }}
        >
          <FlatList
            data={categoryList}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("SubCategoryScreen", {
                    categoryId: item.id,
                    categoryName: item.name,
                  })
                }
                style={{
                  backgroundColor: "white",
                  margin: 5,
                  marginTop: index == 0 ? 0 : 10,
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    paddingVertical: 8,
                    marginHorizontal: 8,
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

export default CategoryScreen;

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
