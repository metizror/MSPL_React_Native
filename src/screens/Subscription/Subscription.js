import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Linking
} from "react-native";
import * as RNIap from "react-native-iap";
import { AlertView } from "../../components/AlertView";
import CustomText from "../../components/CustomText";
import { Header } from "../../components/Header";
import Loader from "../../components/Loader";
import { PrimaryButton } from "../../components/PrimaryButton";
import { moderateScale, verticalScale } from "../../components/scalling";
import Localization from "../../Localization/Localization";
import { callSubScriptionApi } from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Icons from "../../theme/Icons";
import { userDataKey } from "../../Utils/Constant";
import { returnCurrencySymbol, saveLoginData } from "../../Utils/Helper";

const items = Platform.select({
  ios: ["test_product"],
  android: ["test_product"],
});

let purchaseUpdateSubscription;
let purchaseErrorSubscription;
const Subscription = ({ navigation }) => {
  const [isLoading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, showAlertMessage] = useState("");
  const [modelBusiness, showModelBusiness] = useState(false);
  const [subSuccessModel, setSubSuccessModel] = useState(false);

  const [products, setProducts] = useState([]); //used to store list of products
  const [role, setRole] = useState(""); //used to store list of products
  const { t } = useTranslation();

  useEffect(() => {
    RNIap.initConnection()
      .catch(() => {
        console.log("error connecting to store...");
      })
      .then(() => {
        RNIap.getSubscriptions(items)
          .catch(() => {
            console.log("error finding items");
          })
          .then((res) => {
            console.log("Resss", JSON.stringify(res));

            setProducts(res);
          });
      });

    purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
      if (!(error["responseCode"] === "2")) {
        Alert.alert(
          "Error",
          "There has been an error with your purchase, error code" +
          error["code"]
        );
      }
    });
    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener((purchase) => {
      if (Platform.OS == "ios") {
        setTimeout(() => {
          SubcriptionStoreApi(
            JSON.stringify(purchase),
            purchase.productId,
            purchase.transactionReceipt
          );
        }, 1000);
      } else {
        setTimeout(() => {
          SubcriptionStoreApi(JSON.stringify(purchase), purchase.productId);
        }, 1000);
      }
    });

    return () => {
      try {
        purchaseUpdateSubscription.remove();
      } catch (error) { }
      try {
        purchaseErrorSubscription.remove();
      } catch (error) { }
      try {
        RNIap.endConnection();
      } catch (error) { }
    };
  }, []);

  const SubcriptionStoreApi = async (
    response,
    productId,
    transactionReceipt
  ) => {
    const param = new FormData();
    param.append("response", response);
    param.append("subscribe_plan_id", productId);
    param.append("payment_type", Platform.OS == "ios" ? 2 : 1);
    if (Platform.OS == "ios") {
      param.append("transaction_token", transactionReceipt);
    }
    console.log("param===>", JSON.stringify(param));
    setLoading(true);
    callSubScriptionApi(param)
      .then((res) => {
        setLoading(false);
        if (res.success) {
          setSubSuccessModel(true);

          storeBusinessProData(res);
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
  const storeBusinessProData = async (res) => {
    await saveLoginData(res.data, res.data.role, "login");
  };
  useEffect(() => {
    getUserRole();
  }, []);

  const getUserRole = async () => {
    setRole(await AsyncStorage.getItem(userDataKey.Role));
  };
  const RenderItem = ({ item }) => {
    return (
      <View style={styles.cardView}>
        <CustomText style={styles.TitleText}>{item.name}</CustomText>
        <View style={styles.AmountCard}>
          <CustomText
            style={{
              color: colors.white,
              fontSize: moderateScale(16),
              marginTop: -30,
            }}
          >
            {Localization.sign}
          </CustomText>
          <CustomText
            style={{
              color: colors.white,
              fontSize: moderateScale(60),
              fontWeight: "700",
              lineHeight: 57,
              marginTop: 0,
            }}
          >
            {item.amount}
          </CustomText>
          <CustomText style={styles.AmountText}>
            {Localization.textTitle}
          </CustomText>
        </View>

        <CustomText style={styles.DiscriptionText}>
          {item.description}
        </CustomText>
        <CustomText style={[styles.DiscriptionText, { fontWeight: "700" }]}>
          {Localization.secondAbout}
        </CustomText>

        <FlatList
          showsHorizontalScrollIndicator={false}
          data={item.subscribe_plan_detail}
          pagingEnabled
          renderItem={({ item }) => <SubRenderItem item={item} />}
        />

        {products &&
          products.map((p) => (
            <PrimaryButton
              onPress={() => {
                RNIap.requestSubscription(p["productId"]);
              }}
              title={"Buy now for $" + item.amount + "/per month"}
              buttonStyle={[{ marginBottom: 24 }]}
            ></PrimaryButton>
          ))}
      </View>
    );
  };


  const SubRenderItem = ({ item }) => {
    return (
      <View style={styles.mainView}>
        <Image
          style={styles.imageLayout}
          source={Icons.ic_star}
          resizeMode={"contain"}
        ></Image>

        <CustomText style={styles.listTextView}>{item.detail}</CustomText>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Header
        onBack={() => navigation.goBack()}
        isShowCart={false}
        title={t("subscribe")}
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
      {products && products?.length > 0 && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: 20 }}
        >
          <View style={styles.cardView}>
            <CustomText style={styles.TitleText}>{t("screenTitle")}</CustomText>
            <View style={styles.AmountCard}>
              <CustomText
                style={{ color: colors.white, fontSize: 12, marginTop: -30 }}
              >
                {returnCurrencySymbol(products[0]?.currency)}
              </CustomText>
              <CustomText
                style={{
                  color: colors.white,
                  fontSize: 53,
                  fontWeight: "700",
                  lineHeight: 57,
                  marginTop: 0,
                }}
              >
                {products[0]?.price}
              </CustomText>
              <CustomText style={styles.AmountText}>
                {t("textTitle")}
              </CustomText>
            </View>

            <CustomText style={styles.DiscriptionText}>{t("about")}</CustomText>
            <CustomText style={[styles.DiscriptionText, { fontWeight: "700" }]}>
              {t("secondAbout")}
            </CustomText>

            <View>
              <View style={styles.mainView}>
                <Image
                  style={styles.imageLayout}
                  source={Icons.ic_star}
                  resizeMode={"contain"}
                ></Image>
                <CustomText style={styles.listTextView}>{t("line")}</CustomText>
              </View>

              <View style={styles.mainView}>
                <Image
                  style={styles.imageLayout}
                  source={Icons.ic_star}
                  resizeMode={"contain"}
                ></Image>
                <CustomText style={styles.listTextView}>
                  {t("line2")}
                </CustomText>
              </View>

              <View style={styles.mainView}>
                <Image
                  style={styles.imageLayout}
                  source={Icons.ic_star}
                  resizeMode={"contain"}
                ></Image>
                <CustomText style={styles.listTextView}>
                  {t("line3")}
                </CustomText>
              </View>

              <View style={styles.mainView}>
                <Image
                  style={styles.imageLayout}
                  source={Icons.ic_star}
                  resizeMode={"contain"}
                ></Image>
                <CustomText style={styles.listTextView}>
                  {t("line4")}
                </CustomText>
              </View>

              <View style={styles.mainView}>
                <Image
                  style={styles.imageLayout}
                  source={Icons.ic_star}
                  resizeMode={"contain"}
                ></Image>
                <CustomText style={styles.listTextView}>
                  {t("line5")}
                </CustomText>
              </View>

              <View style={styles.mainView}>
                <Image
                  style={styles.imageLayout}
                  source={Icons.ic_star}
                  resizeMode={"contain"}
                ></Image>
                <CustomText style={styles.listTextView}>
                  {t("line6")} {"\n"}
                  {t("line7")} {"\n"}
                  {t("line8")}
                </CustomText>
              </View>

              <View style={styles.mainView}>
                <Image
                  style={styles.imageLayout}
                  source={Icons.ic_star}
                  resizeMode={"contain"}
                ></Image>
                <CustomText style={styles.listTextView}>
                  {t("line9")}
                </CustomText>
              </View>

              <View style={styles.mainView}>
                <Image
                  style={styles.imageLayout}
                  source={Icons.ic_star}
                  resizeMode={"contain"}
                ></Image>
                <CustomText style={styles.listTextView}>
                  {t("line10")}
                </CustomText>
              </View>
            </View>

            {products &&
              products.map((p) => (

                <PrimaryButton
                  onPress={() => {
                    if (role == "standard_user") {
                      showModelBusiness(true)
                    } 
                    
                    else if (role == "business_user_pro") {
                      if (Platform.OS == "ios") {
                        Linking.openURL('https://apps.apple.com/account/subscriptions');

                      } else {
                        Linking.openURL('https://play.google.com/store/account/subscriptions?package="com.rn.codebase"&sku="bp_899_1m"')
                      }
                    }
                    else {
                      RNIap.requestSubscription(p["productId"])
                    }
                  }}
                  title={ 
                    role == "business_user_pro"? "Remove From Account":
                    t("buy_now_for") +
                    returnCurrencySymbol(products[0]?.currency) +
                    p["price"] +
                    t("textTitle")
                  }
                  buttonStyle={[{ marginBottom: 24 }]}
                ></PrimaryButton>
              ))}
          </View>
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modelBusiness}
        onRequestClose={() => {
          showModelBusiness(!modelBusiness);
        }}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <CustomText style={styles.modalTextHeader}>
                {Localization.feature_only_for_business_account}
              </CustomText>

              <View style={{ paddingHorizontal: 25 }}>
                <PrimaryButton
                  buttonStyle={{ marginTop: 15 }}
                  onPress={() => {
                    navigation.navigate("CreateListingNavigator", {
                      screen: "ConvertBusinessAccount",
                    });
                  }}
                  title={Localization.convert_to_business_account}
                ></PrimaryButton>

                <PrimaryButton
                  buttonStyle={{ backgroundColor: "#F42020" }}
                  onPress={() => showModelBusiness(false)}
                  title={Localization.cancel}
                ></PrimaryButton>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={subSuccessModel}
        onRequestClose={() => {
          setSubSuccessModel(!subSuccessModel);
        }}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <CustomText style={styles.modalTextHeader}>
                {t("success_msg_for_business_pro")}
              </CustomText>

              <View style={{ paddingHorizontal: 25 }}>
                <PrimaryButton
                  buttonStyle={{ marginTop: 15 }}
                  onPress={() => {
                    navigation.navigate("ViewItems");
                    setSubSuccessModel(false);
                  }}
                  title={t("close")}
                ></PrimaryButton>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  background: {
    flex: 1,
    backgroundColor: colors.white,
  },

  TitleText: {
    fontSize: moderateScale(24),
    fontFamily: "Helvetica",
    fontWeight: "700",
    color: "#000000",
    marginTop: 25,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "center",
  },
  DiscriptionText: {
    fontSize: moderateScale(22),
    fontFamily: "Helvetica",
    textAlign: "center",
  },
  cardView: {
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 30,
    textAlign: "center",
    backgroundColor: "white",
    shadowRadius: 4,
    shadowColor: Platform.OS == "ios" ? "#00000029" : "rgba(0, 0, 0, 0.7)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    overflow: "hidden",
    elevation: Platform.OS === "ios" ? 0.1 : 5,
    shadowOpacity: 1.0,
    margin: 5,
    flex: 1,
    marginBottom: 50,
  },
  AmountCard: {
    height: verticalScale(250),
    borderRadius: 15,
    backgroundColor: "#F47920",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  AmountText: {
    color: colors.white,
    lineHeight: 77,
    fontSize: moderateScale(16),
    fontWeight: "700",
  },
  listTextView: {
    fontSize: moderateScale(20),
    fontWeight: "400",
    marginLeft: 10,
    marginRight: 30,
    marginTop: 0,
  },

  imageLayout: {
    height: 25,
    width: 25,
    // alignSelf: 'center',
  },
  mainView: {
    flexDirection: "row",
    marginTop: 10,
  },

  modalView: {
    backgroundColor: colors.white,
    borderRadius: 20,
    position: "absolute",
    elevation: 5,
    width: "85%",
    paddingVertical: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTextHeader: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: moderateScale(24),
    marginStart: 25,
    marginEnd: 25,
    lineHeight: 24,
    marginBottom: 22,
  },
});

export default Subscription;
