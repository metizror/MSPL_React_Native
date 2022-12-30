import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DrawerActions } from "@react-navigation/routers";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CurrencyInput from "react-native-currency-input";
import { RadioButton, RadioGroup } from "react-native-flexi-radio-button";
import * as RNIap from "react-native-iap";
import ImagePicker from "react-native-image-crop-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import tinycolor from "tinycolor2";
import { AlertView } from "../../components/AlertView";
import ColorComponent from "../../components/ColorComponent";
import CustomDropDown from "../../components/CustomDropDown";
import CustomText from "../../components/CustomText";
import CustomTextInput from "../../components/CustomTextInput";
import { Header } from "../../components/Header";
import Loader from "../../components/Loader";
import { PrimaryButton } from "../../components/PrimaryButton";
import { moderateScale, verticalScale } from "../../components/scalling";
import SelectImageDialog from "../../components/SelectImageDialog";
import { UploadPhoto } from "../../components/UploadPhoto";
import YearPicker from "../../components/YearPicker";

import {
  CATEGORY_DETAIL_LIST_EVENT,
  clearCategoryEvent,
} from "../../redux/action/action";
import {
  callBoostPostApi,
  callBusinessUserPaymentCreateListingApiCall,
  checkBoostAmountApiCall,
  createData,
  createListingApiCall,
  getCategoryApiCall,
  getFormCategoryDetailsApiCall,
  getProListingCountApi,
  getSubCategoryApiCall,
} from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Fonts from "../../theme/Fonts";
import Icons from "../../theme/Icons";
import { userDataKey } from "../../Utils/Constant";
import {
  returnCurrencySymbol,
  returnFirstCapitalChar,
} from "../../Utils/Helper";

const CreateListingScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [listingName, setListingName] = useState("");
  const [remainingListingCount, setRemainingListingCount] = useState("");
  const [listingPrice, setListingPrice] = useState(null);
  const [listingDescription, setListingDescription] = useState("");
  const [address, setAddress] = useState("");
  const [descMaxLength, setDescMaxLength] = useState(125);
  const [reamaingLength, setReamaingLength] = useState(0);
  const [role, setRole] = useState("");
  const [dynamicData, setDynamicData] = useState({});
  const [selectedItem, setSelectedItem] = useState("");
  const [yearList, setYearList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [showYearDialog, setShowYearDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [alertMessageSuccess, setAlertMessageSuccess] = useState("");
  const [categoryName, setCategoryName] = useState(0);
  const [subCategoryName, setSubCategoryName] = useState(0);
  const [showBoost, setShowBoost] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [categoryDetailList, setCategoryDetailList] = useState([]);
  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [dateLabel, setDateLable] = useState("");
  const [photoCount, setPhotoCount] = useState(3);
  const [selectedPhoto1, setSelectedPhoto1] = useState("");
  const [selectedPhoto2, setSelectedPhoto2] = useState("");
  const [selectedPhoto3, setSelectedPhoto3] = useState("");
  const [selectedPhoto4, setSelectedPhoto4] = useState("");
  const [selectedPhoto5, setSelectedPhoto5] = useState("");
  const [selectedPhoto6, setSelectedPhoto6] = useState("");
  const [selectedPhoto7, setSelectedPhoto7] = useState("");
  const [selectedPhoto8, setSelectedPhoto8] = useState("");
  const [selectedPhoto9, setSelectedPhoto9] = useState("");
  const [selectedPhoto10, setSelectedPhoto10] = useState("");
  const [modelBusiness, showModelBusiness] = useState(false);
  const [modelBusinessPro, showModelBusinessPro] = useState(false);
  const [modelListingPosted, setModelListingPosted] = useState(false);
  const [modelLearnSubscription, setModelLearnSubscription] = useState(false);
  const [modelBoostPost, setModelBoostPost] = useState(false);
  const [selectImagePos, setSelectedImagePos] = useState("");
  const refImageDialog = useRef();
  const [boostDayList, setBoostDayList] = useState([]);
  const [listingId, setListingId] = useState(0);
  const [boostDay, setBoostDay] = useState(1);
  const [boostAmount, setBoostAmount] = useState(0);
  const [purchased, setPurchased] = useState(false); //set to true if the user has active subscription
  const [products, setProducts] = useState([]); //used to store list of products
  const [listingProduct, setListingProduct] = useState([]); //used to store list of products
  var listing_ID = 0;
  var partPhoto;
  var listID = 0;
  let purchaseUpdateSubscription;
  let purchaseErrorSubscription;
  const { t } = useTranslation();
  const refListingName = useRef();
  const refListingPrice = useRef();
  let purchaseUpdateCreateListing;
  let purchaseErrorCreateListing;
  const [createListingOpen, setCreateListingOpen] = useState(false);
  const categoryDList = useSelector(
    (state) => state.categoryDetailListReducer.categoryDetailList
  );
  const items = Platform.select({
    ios: ["boost_post_1"],
    android: ["boost_post_1"],
  });
  const items2 = Platform.select({
    ios: ["boost_post_2"],
    android: ["boost_post_2"],
  });
  const items3 = Platform.select({
    ios: ["boost_post_2"],
    android: ["boost_post_3"],
  });
  const items4 = Platform.select({
    ios: ["boost_post_4"],
    android: ["boost_post_4"],
  });
  const items5 = Platform.select({
    ios: ["boost_post_5"],
    android: ["boost_post_5"],
  });
  const items6 = Platform.select({
    ios: ["boost_post_6"],
    android: ["boost_post_6"],
  });
  const items7 = Platform.select({
    ios: ["boost_post_7"],
    android: ["boost_post_7"],
  });
  const items8 = Platform.select({
    ios: ["boost_post_8"],
    android: ["boost_post_8"],
  });
  const items9 = Platform.select({
    ios: ["boost_post_9"],
    android: ["boost_post_9"],
  });
  const items10 = Platform.select({
    ios: ["boost_post_10"],
    android: ["boost_post_10"],
  });
  const items11 = Platform.select({
    ios: ["boost_post_11"],
    android: ["boost_post_11"],
  });
  const items12 = Platform.select({
    ios: ["boost_post_12"],
    android: ["boost_post_12"],
  });
  const items13 = Platform.select({
    ios: ["boost_post_13"],
    android: ["boost_post_13"],
  });
  const items14 = Platform.select({
    ios: ["boost_post_14"],
    android: ["boost_post_14"],
  });
  const items15 = Platform.select({
    ios: ["boost_post_15"],
    android: ["boost_post_15"],
  });
  const createListingPrice = Platform.select({
    ios: ["create_listing_26.99"],
    android: ["create_listing_26.99"],
  });

  useEffect(() => {
  
    RNIap.initConnection()
        .catch(() => {
          console.log("errorvv connecting to store...");
        })
        .then(() => {
          RNIap.getProducts(createListingPrice)
            .catch(() => {
              console.log("error finding items");
            })
            .then((res) => {
              console.log("Resss Create Listing", JSON.stringify(res));
              setListingProduct(res);
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

      purchaseUpdateCreateListing = RNIap.purchaseUpdatedListener(
        (purchase) => {
          setTimeout(() => {
            RNIap.finishTransaction(purchase, true);
            createListingPayment(JSON.stringify(purchase))
          }, 1000);
        }
      );

      return () => {
        try {
          purchaseUpdateCreateListing.remove();
        } catch (error) {}
        try {
          purchaseErrorCreateListing.remove();
        } catch (error) {}
        try {
          RNIap.endConnection();
        } catch (error) {}
      };
    
  }, [ createListingOpen]);


  useEffect(() => {
    if(showBoost!=null){
      console.log("Init 1");
      RNIap.initConnection()
        .catch(() => {
          console.log("errorvv connecting to store...");
        })
        .then(() => {
          var boost = items;
          if (boostDay == 1) {
            boost = items;
          } else if (boostDay == 2) {
            boost = items2;
          } else if (boostDay == 3) {
            boost = items3;
          } else if (boostDay == 4) {
            boost = items4;
          } else if (boostDay == 5) {
            boost = items5;
          } else if (boostDay == 6) {
            boost = items6;
          } else if (boostDay == 7) {
            boost = items7;
          } else if (boostDay == 8) {
            boost = items8;
          } else if (boostDay == 9) {
            boost = items9;
          } else if (boostDay == 10) {
            boost = items10;
          } else if (boostDay == 11) {
            boost = items11;
          } else if (boostDay == 12) {
            boost = items12;
          } else if (boostDay == 13) {
            boost = items13;
          } else if (boostDay == 14) {
            boost = items14;
          } else if (boostDay == 15) {
            boost = items15;
          } else {
            boost = [];
          }
          RNIap.getProducts(boost)
            .catch(() => {
              console.log("error finding items boost");
            })
            .then((res) => {
              console.log("Resss Boosy", JSON.stringify(res));
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
        console.log("Item Booost", purchase);
        RNIap.finishTransaction(purchase, true);
        setTimeout(() => {
          if(purchase.productId!="create_listing_26.99"){
          boostPostApi(JSON.stringify(purchase), purchase.productId);
          }
        }, 1000);
      });

      return () => {
        try {
          purchaseUpdateSubscription.remove();
        } catch (error) {
          console.log("error");
        }
        try {
          purchaseErrorSubscription.remove();
        } catch (error) {}

        try {
          purchaseUpdateSubscription.remove();
        } catch (error) {
          console.log("error");
        }
        try {
          purchaseErrorSubscription.remove();
        } catch (error) {}

        try {
          RNIap.endConnection();
        } catch (error) {}
      };
    }
    
  }, [boostDay,showBoost]);

  

  const getUser = async () => {
    setRole(await AsyncStorage.getItem(userDataKey.Role));
    console.log("role", await AsyncStorage.getItem(userDataKey.Role));
    if ((await AsyncStorage.getItem(userDataKey.Role)) === "business_user") {
      setDescMaxLength(125);
      setReamaingLength(125);
    } else if ((await AsyncStorage.getItem(userDataKey.Role)) === "business_user_pro") {
      setDescMaxLength(250);
      setReamaingLength(250);
    }
     else {
      setDescMaxLength(125);
      setReamaingLength(125);
    }
  };


  const takePhotoFromCamera = (item) => {
    ImagePicker.openCamera({
      mediaType: "photo",
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      compressImageQuality: 0.7,
      // includeBase64: true,
      cropping: true,
      resizeMode: 1000,
    }).then((image1) => {
      console.log("paras image", image1);
      var ext = image1.path.substr(image1.path.lastIndexOf(".") + 1);
      partPhoto = {
        name: image1.modificationDate + "." + ext,
        type: image1.mime,
        uri:
          Platform.OS === "android"
            ? image1.path
            : image1.path.replace("file://", ""),
      };

      if (item == "1") {
        setSelectedPhoto1(partPhoto);
      } else if (item == "2") {
        setSelectedPhoto2(partPhoto);
      } else if (item == "3") {
        setSelectedPhoto3(partPhoto);
      } else if (item == "4") {
        setPhotoCount(4);
        setSelectedPhoto4(partPhoto);
      } else if (item == "5") {
        setPhotoCount(5);
        setSelectedPhoto5(partPhoto);
      } else if (item == "6") {
        setPhotoCount(6);
        setSelectedPhoto6(partPhoto);
      } else if (item == "7") {
        setPhotoCount(7);
        setSelectedPhoto7(partPhoto);
      } else if (item == "8") {
        setPhotoCount(8);
        setSelectedPhoto8(partPhoto);
      } else if (item == "9") {
        setPhotoCount(9);
        setSelectedPhoto9(partPhoto);
      } else if (item == "10") {
        setPhotoCount(10);
        setSelectedPhoto10(partPhoto);
      } else {
        setPhotoCount(3);
        setSelectedPhoto1("");
        setSelectedPhoto2("");
        setSelectedPhoto3("");
        setSelectedPhoto4("");
        setSelectedPhoto5("");
        setSelectedPhoto6("");
        setSelectedPhoto7("");
        setSelectedPhoto8("");
        setSelectedPhoto9("");
        setSelectedPhoto10("");
      }
      console.log("paras 4", partPhoto);
    });
  };

  const choosePhotoFromLibrary = (item) => {
    ImagePicker.openPicker({
      mediaType: "photo",
      width: 300,
      height: 300,
      compressImageQuality: 0.7,
      cropping: true,
    }).then((image1) => {
      console.log("paras image", image1);
      var ext = image1.path.substr(image1.path.lastIndexOf(".") + 1);
      partPhoto = {
        name: image1.modificationDate + "." + ext,
        type: image1.mime,
        uri:
          Platform.OS === "android"
            ? image1.path
            : image1.path.replace("file://", ""),
      };

      if (item == "1") {
        setSelectedPhoto1(partPhoto);
      } else if (item == "2") {
        setSelectedPhoto2(partPhoto);
      } else if (item == "3") {
        setSelectedPhoto3(partPhoto);
      } else if (item == "4") {
        setPhotoCount(4);
        setSelectedPhoto4(partPhoto);
      } else if (item == "5") {
        setPhotoCount(5);
        setSelectedPhoto5(partPhoto);
      } else if (item == "6") {
        setPhotoCount(6);
        setSelectedPhoto6(partPhoto);
      } else if (item == "7") {
        setPhotoCount(7);
        setSelectedPhoto7(partPhoto);
      } else if (item == "8") {
        setPhotoCount(8);
        setSelectedPhoto8(partPhoto);
      } else if (item == "9") {
        setPhotoCount(9);
        setSelectedPhoto9(partPhoto);
      } else if (item == "10") {
        setPhotoCount(10);
        setSelectedPhoto10(partPhoto);
      } else {
        setPhotoCount(3);
        setSelectedPhoto1("");
        setSelectedPhoto2("");
        setSelectedPhoto3("");
        setSelectedPhoto4("");
        setSelectedPhoto5("");
        setSelectedPhoto6("");
        setSelectedPhoto7("");
        setSelectedPhoto8("");
        setSelectedPhoto9("");
        setSelectedPhoto10("");
      }
    });
  };

  useEffect(() => {
    setPhotoCount(3);
    getUser();
  }, []);

  useEffect(() => {
    getCategoryData();
    getProListingCount();
    setBoost();
    const yList = [];
    for (let i = 1990; i <= new Date().getFullYear(); i++) {
      yList.push(i);
    }
    setYearList(yList);
    console.log("come again");
  }, []);

  useEffect(() => {
    if (categoryName != 0) {
      setDynamicData({});
      getSubCategoryData();
      getFromDataFromCategory();
    }
  }, [categoryName]);

 
  const getCategoryData = () => {
    setLoading(true);

    getCategoryApiCall()
      .then((res) => {
        setLoading(false);
        if (res.success) {
          var data = [];
          var tempList = res.data;
          data.push({ value: 0, label: t("listing_category") });
          for (var i = 0; i < tempList.length; i++) {
            data.push({
              value: tempList[i].id,
              label: tempList[i].name,
            });
          }
          setCategoryList(data);
        } else {
          setAlertMessage(res.message);
          setShowAlert(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("userGetDealerships Error", error);
        setAlertMessage(error.message);
        setShowAlert(true);
      });
  };
  const getProListingCount = async () => {
    const userRole = await AsyncStorage.getItem(userDataKey.Role);
    if (userRole === "business_user_pro") {
      getProListingCountApi()
        .then((res) => {
          console.log("getProListingCountApi====>", res);
          if (res.success) {
            setRemainingListingCount(res.data.remaining_listing_count);
          } else {

          }
        })
        .catch((error) => {
          console.log("getProListingCount Error", error);
        });
    }
}
  const getSubCategoryData = () => {
    setLoading(true);
    getSubCategoryApiCall(categoryName)
      .then((res) => {
        setLoading(false);
        console.log("Categorty====>", res);
        if (res.success) {
          setSubCategoryList([]);

          var data = [];
          var tempList = res.data;
          if (tempList.length > 0) {
            for (var i = 0; i < tempList.length; i++) {
              data.push({
                value: tempList[i].id,
                label: tempList[i].name,
              });
            }

            setSubCategoryList(data);
            setSubCategoryName(data[0]?.value);
          }
        } else {
          setAlertMessage(res.message);
          setShowAlert(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("userGetDealerships Error", error);
        setAlertMessage(error.message);
        setShowAlert(true);
      });
  };

  const getBootListingData = () => {
    const param = new FormData();
    param.append("boost_days", boostDay);

    setLoading(true);

    checkBoostAmountApiCall(param)
      .then((res) => {
        setLoading(false);
        console.log("boost Create Listing====>", res);
        if (res.success) {
          setBoostAmount(JSON.stringify(res.data.amount));
        } else {
          setAlertMessage(res.message);
          setShowAlert(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("userGetDealerships Error", error);
        setAlertMessage(error.message);
        setShowAlert(true);
      });
  };

  const boostPostApi = async (response, productId) => {
    console.log("listing ID", listID + "  " + listing_ID + "  " + listingId);

    const param = new FormData();
    param.append("user_id", await AsyncStorage.getItem(userDataKey.ID));
    param.append("listing_id", listingId);
    param.append("response", response);
    param.append("product_payment_type", Platform.OS == "ios" ? 2 : 1);
    param.append("product_id", productId);

    console.log("param===>", JSON.stringify(param));

    setLoading(true);

    callBoostPostApi(param)
      .then((res) => {
        setLoading(false);
        console.log("boost Crete Lisitng1====>", res);
        setShowBoost(null)
        if (res.success) {
          setModelBoostPost(false);
          setTimeout(() => {
            setModelListingPosted(true);
          }, 100);
          setPurchased(true);
        } else {
          setModelBoostPost(false);

          setAlertMessage(res.message);
          setShowAlert(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("userGetDealerships Error", error);
        setAlertMessage(error.message);
        setShowAlert(true);
      });
  };


    const createListingPayment = async (response,) => {
    const param = new FormData();
    param.append("listing_id", listingId);
    param.append("payment_type", Platform.OS == "ios" ? 2 : 1);
    param.append("amount",119.99);
    param.append("response", response);
    console.log("param===>", JSON.stringify(param));
    setLoading(true);
    callBusinessUserPaymentCreateListingApiCall(param)
      .then((res) => {
        setLoading(false);
        console.log("boost Crete Lisitng1====>", res);
        if (res.success) {
          setCreateListingOpen(false);
          setShowBoost("true")
          setModelBoostPost(true);
        } else {
          setAlertMessage(res.message);
          setShowAlert(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("userGetDealerships Error", error);
        setAlertMessage(error.message);
        setShowAlert(true);
      });
  };
  const getFromDataFromCategory = () => {
    const param = new FormData();
    param.append("category_id", categoryName);
    setLoading(true);

    getFormCategoryDetailsApiCall(param)
      .then((res) => {
        setLoading(false);
        console.log("getFromDataFromCategory====>", res);
        if (res.success) {
          setCategoryDetailList(res.data);
          dispatch({
            type: CATEGORY_DETAIL_LIST_EVENT,
            payload: res.data,
          });
        } else {
          setAlertMessage(res.message);
          setShowAlert(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("userGetDealerships Error", error);
        setAlertMessage(error.message);
        setShowAlert(true);
      });
  };

  const onChange = (event, selectedDate) => {
    var mData = dynamicData;
    mData[`${selectedItem.id}`] = moment(selectedDate).format("DD-MM-YYYY");
    setDynamicData(mData);

    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    var stringDate = moment(currentDate).format("DD-MM-YYYY");
    setDateLable(stringDate);
    refreshRenderer();
  };

  const refreshRenderer = () => {
    dispatch({
      type: CATEGORY_DETAIL_LIST_EVENT,
      payload: [],
    });
    dispatch({
      type: CATEGORY_DETAIL_LIST_EVENT,
      payload: categoryDetailList,
    });
  };

  const setBoost = () => {
    var data = [];

    for (var i = 0; i < 15; i++) {
      data.push({
        value: i + 1,
        label: JSON.stringify(i + 1) + t("day"),
      });
    }
    setBoostDayList(data);
  };

  const clearData = () => {
    dispatch(clearCategoryEvent());
    setSelectedPhoto1("");
    setSelectedPhoto2("");
    setSelectedPhoto3("");
    setSelectedPhoto4("");
    setSelectedPhoto5("");
    setSelectedPhoto6("");
    setSelectedPhoto7("");
    setSelectedPhoto8("");
    setSelectedPhoto9("");
    setSelectedPhoto10("");
    setPhotoCount(3);
    setListingName("");
    setListingPrice(null);
    setDynamicData({});
    setCategoryName(0);
    setListingDescription("");
    setCategoryDetailList([]);
    setSubCategoryList([]);
    setAddress("")
  };

  return (
    <View style={styles.mainContainer}>
      <Header
        isShowBackButton={true}
        onBack={() => {
          navigation.goBack();
        }}
        onCartClick={() => {
          navigation.navigate("NotificationScreen");
        }}
        isShowCart={true}
        showDrawer={true}
        openDrawer={() => navigation.dispatch(DrawerActions.openDrawer())}
      ></Header>
      <Loader loading={isLoading} />

      <AlertView
        showAlert={showAlert}
        message={alertMessage}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
        onDismiss={() => {}}
      ></AlertView>
      <AlertView
        showAlert={showAlertSuccess}
        message={alertMessageSuccess}
        onConfirmPressed={() => {
          setShowAlertSuccess(false);
        }}
        onDismiss={() => {
          navigation.navigate("HomeStackNavigator");
        }}
      ></AlertView>

      <SelectImageDialog
        ref={refImageDialog}
        onPressTakePhoto={() => {
          console.log("onPressOk");
          refImageDialog.current.close();
          setTimeout(
            function () {
              takePhotoFromCamera(selectImagePos);
            }.bind(this),
            1000
          );
        }}
        onPressChooseFromLibrary={() => {
          refImageDialog.current.close();
          setTimeout(
            function () {
              choosePhotoFromLibrary(selectImagePos);
            }.bind(this),
            1000
          );
        }}
        onPressCancel={() => {
          console.log("onPressClose");
          refImageDialog.current.close();
        }}
      ></SelectImageDialog>

      <YearPicker
        yearList={yearList}
        selectedYear={selectedYear}
        showDialog={showYearDialog}
        onSelect={(year) => {
          console.log("onSelect : ", year);
          setSelectedYear(year);
          var mData = dynamicData;
          mData[`${selectedItem.id}`] = year;

          setDynamicData(mData);
          refreshRenderer();
        }}
        onRequestClose={() => {
          console.log("onRequestClose");
          setShowYearDialog(false);
        }}
        onPressClose={() => {
          console.log("onPressClose");
          setShowYearDialog(false);
        }}
        onPressOk={(year) => {
          console.log(`selected item ${year}`);
          setSelectedYear(year);
          setShowYearDialog(false);

          var mData = dynamicData;
          mData[`${selectedItem.id}`] = year;
          setDynamicData(mData);
          refreshRenderer();
        }}
      ></YearPicker>

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
      >
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
        <View style={styles.main}>
          <CustomText style={styles.screenTitle}>
            {t("createlistingscreen")}
          </CustomText>
          <CustomText
            style={{
              textAlign: "center",
              color: colors.primary,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            {t("listing_information")}
          </CustomText>
          {selectedPhoto1 == "" ? (
            <UploadPhoto
              onPress={() => {
                setSelectedImagePos("1");
                refImageDialog.current.open();
              }}
              title={t("upload_listing_photos")}
              style={{ marginTop: 10 }}
            ></UploadPhoto>
          ) : (
            <ImageBackground
              source={{
                uri: selectedPhoto1.uri,
              }}
              style={styles.mainImage}
              imageStyle={{ borderRadius: 10 }}
            >
              <TouchableOpacity
                onPress={() => setSelectedPhoto1("")}
                style={{
                  marginRight: 15,
                  marginTop: 15,
                  alignItems: "flex-end",
                }}
              >
                <Image
                  style={{ width: 10, height: 10 }}
                  source={Icons.ic_close}
                ></Image>
              </TouchableOpacity>
            </ImageBackground>
          )}
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Pressable
              onPress={() => {
                setSelectedImagePos("2");
                refImageDialog.current.open();
              }}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#000000",
                borderRadius: 10,
                borderStyle: "dashed",
                marginHorizontal: 5,
                overflow: "hidden",
                height: 65,
              }}
            >
              {selectedPhoto2 != "" ? (
                <ImageBackground
                  source={{
                    uri: selectedPhoto2.uri,
                  }}
                  // key={index}
                  style={{
                    // width: 65,
                    height: 65,
                    resizeMode: "contain",
                    overflow: "hidden",
                  }}
                  imageStyle={{ borderRadius: 3 }}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedPhoto2("")}
                    style={{
                      marginRight: 10,
                      marginTop: 10,
                      alignItems: "flex-end",
                    }}
                  >
                    <Image
                      style={{ width: 10, height: 10 }}
                      source={Icons.ic_close}
                    ></Image>
                  </TouchableOpacity>
                </ImageBackground>
              ) : null}
            </Pressable>

            <Pressable
              onPress={() => {
                setSelectedImagePos("3");
                refImageDialog.current.open();
              }}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#000000",
                borderRadius: 10,
                borderStyle: "dashed",
                overflow: "hidden",
                height: 65,
                marginHorizontal: 5,
              }}
            >
              {selectedPhoto3 != "" ? (
                <ImageBackground
                  source={{
                    uri: selectedPhoto3.uri,
                  }}
                  // key={index}
                  style={{
                    // width: 65,
                    height: 65,
                    resizeMode: "cover",
                  }}
                  imageStyle={{ borderRadius: 3 }}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedPhoto3("")}
                    style={{
                      marginRight: 10,
                      marginTop: 10,
                      alignItems: "flex-end",
                    }}
                  >
                    <Image
                      style={{ width: 10, height: 10 }}
                      source={Icons.ic_close}
                    ></Image>
                  </TouchableOpacity>
                </ImageBackground>
              ) : null}
            </Pressable>

            {photoCount == 3 && (
              <Pressable
                onPress={() => {
                  if (selectedPhoto1 == "") {
                    setAlertMessage("Please upload first photo");
                    setShowAlert(true);
                  } else if (selectedPhoto2 == "") {
                    setAlertMessage("Please upload second photo");
                    setShowAlert(true);
                  } else if (selectedPhoto3 == "") {
                    setAlertMessage("Please upload third photo");
                    setShowAlert(true);
                  } else {
                    setSelectedImagePos("4");
                    refImageDialog.current.open();
                  }
                  // setSelectedImagePos("4");
                  // refImageDialog.current.open();
                }}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#000000",
                  borderRadius: 10,
                  borderStyle: "dashed",
                  overflow: "hidden",
                  height: 65,
                  marginHorizontal: 5,
                  justifyContent: "center",
                }}
              >
                <Image
                  source={Icons.ic_zoom_in_map}
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: "cover",
                    alignSelf: "center",
                  }}
                  imageStyle={{ borderRadius: 3 }}
                ></Image>
              </Pressable>
            )}

            {photoCount >= 4 && (
              <Pressable
                onPress={() => {
                  setSelectedImagePos("4");
                  refImageDialog.current.open();
                }}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#000000",
                  borderRadius: 10,
                  borderStyle: "dashed",
                  overflow: "hidden",
                  height: 65,
                  marginHorizontal: 5,
                }}
              >
                {selectedPhoto4 != "" ? (
                  <ImageBackground
                    source={{
                      uri: selectedPhoto4.uri,
                    }}
                    // key={index}
                    style={{
                      //  width: 65,
                      height: 65,
                      resizeMode: "contain",
                    }}
                    imageStyle={{ borderRadius: 3 }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (photoCount == 4) {
                          setPhotoCount(3);
                          setSelectedPhoto4("");
                        } else if (photoCount == 5) {
                          setPhotoCount(4);
                          setSelectedPhoto4(selectedPhoto5);
                          setSelectedPhoto5("");
                        } else if (photoCount == 6) {
                          setPhotoCount(5);
                          setSelectedPhoto5(selectedPhoto6);
                          setSelectedPhoto4(selectedPhoto5);
                          setSelectedPhoto6("");
                        } else if (photoCount == 7) {
                          setPhotoCount(6);
                          setSelectedPhoto6(selectedPhoto7);
                          setSelectedPhoto5(selectedPhoto6);
                          setSelectedPhoto4(selectedPhoto5);
                          setSelectedPhoto7("");
                        } else if (photoCount == 8) {
                          setPhotoCount(7);
                          setSelectedPhoto7(selectedPhoto8);
                          setSelectedPhoto6(selectedPhoto7);
                          setSelectedPhoto5(selectedPhoto6);
                          setSelectedPhoto4(selectedPhoto5);
                          setSelectedPhoto8("");
                        } else if (photoCount == 9) {
                          setPhotoCount(8);
                          setSelectedPhoto8(selectedPhoto9);
                          setSelectedPhoto7(selectedPhoto8);
                          setSelectedPhoto6(selectedPhoto7);
                          setSelectedPhoto5(selectedPhoto6);
                          setSelectedPhoto4(selectedPhoto5);
                          setSelectedPhoto9("");
                        } else if (photoCount == 10) {
                          setPhotoCount(9);
                          setSelectedPhoto9(selectedPhoto10);
                          setSelectedPhoto8(selectedPhoto9);
                          setSelectedPhoto7(selectedPhoto8);
                          setSelectedPhoto6(selectedPhoto7);
                          setSelectedPhoto5(selectedPhoto6);
                          setSelectedPhoto4(selectedPhoto5);
                          setSelectedPhoto10("");
                        }
                      }}
                      style={{
                        marginRight: 10,
                        marginTop: 10,
                        alignItems: "flex-end",
                      }}
                    >
                      <Image
                        style={{ width: 10, height: 10 }}
                        source={Icons.ic_close}
                      ></Image>
                    </TouchableOpacity>
                  </ImageBackground>
                ) : null}
              </Pressable>
            )}
          </View>
          {/* {role == "standard_user" && ( */}
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            {photoCount >= 5 && (
              <Pressable
                onPress={() => {
                  setSelectedImagePos("5");
                  refImageDialog.current.open();
                }}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#000000",
                  borderRadius: 10,
                  borderStyle: "dashed",
                  overflow: "hidden",
                  height: 65,
                  marginHorizontal: 5,
                }}
              >
                {selectedPhoto5 != "" ? (
                  <ImageBackground
                    source={{
                      uri: selectedPhoto5.uri,
                    }}
                    // key={index}
                    style={{
                      //width: 65,
                      height: 65,
                      resizeMode: "contain",
                    }}
                    imageStyle={{ borderRadius: 3 }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (photoCount == 5) {
                          setPhotoCount(4);
                          setSelectedPhoto5("");
                        } else if (photoCount == 6) {
                          setPhotoCount(5);
                          setSelectedPhoto5(selectedPhoto6);
                          setSelectedPhoto6("");
                        } else if (photoCount == 7) {
                          setPhotoCount(6);
                          setSelectedPhoto6(selectedPhoto7);
                          setSelectedPhoto5(selectedPhoto6);
                          setSelectedPhoto7("");
                        } else if (photoCount == 8) {
                          setPhotoCount(7);
                          setSelectedPhoto7(selectedPhoto8);
                          setSelectedPhoto6(selectedPhoto7);
                          setSelectedPhoto5(selectedPhoto6);
                          setSelectedPhoto8("");
                        } else if (photoCount == 9) {
                          setPhotoCount(8);
                          setSelectedPhoto8(selectedPhoto9);
                          setSelectedPhoto7(selectedPhoto8);
                          setSelectedPhoto6(selectedPhoto7);
                          setSelectedPhoto5(selectedPhoto6);
                          setSelectedPhoto9("");
                        } else if (photoCount == 10) {
                          setPhotoCount(9);
                          setSelectedPhoto9(selectedPhoto10);
                          setSelectedPhoto8(selectedPhoto9);
                          setSelectedPhoto7(selectedPhoto8);
                          setSelectedPhoto6(selectedPhoto7);
                          setSelectedPhoto5(selectedPhoto6);
                          setSelectedPhoto10("");
                        }
                      }}
                      style={{
                        marginRight: 10,
                        marginTop: 10,
                        alignItems: "flex-end",
                      }}
                    >
                      <Image
                        style={{ width: 10, height: 10 }}
                        source={Icons.ic_close}
                      ></Image>
                    </TouchableOpacity>
                  </ImageBackground>
                ) : null}
              </Pressable>
            )}
            {photoCount >= 4 && photoCount <= 5 && (
              <Pressable
                onPress={() => {
                  if (role == "business_user" || role=="business_user_pro") {
                    if (photoCount == 5) {
                      setSelectedImagePos("6");
                      refImageDialog.current.open();
                    } else {
                      setSelectedImagePos("5");
                      refImageDialog.current.open();
                    }
                  } else {
                    if (photoCount == 5) {
                      setAlertMessage(
                        "Individual account listings are limited to 5 images."
                      );
                      setShowAlert(true);
                    } else {
                      // setPhotoCount(5);
                      setSelectedImagePos("5");
                      refImageDialog.current.open();
                    }
                  }
                }}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#000000",
                  borderRadius: 10,
                  borderStyle: "dashed",
                  overflow: "hidden",
                  height: 65,
                  marginHorizontal: 5,
                  justifyContent: "center",
                }}
              >
                <Image
                  source={Icons.ic_zoom_in_map}
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: "cover",
                    alignSelf: "center",
                  }}
                  imageStyle={{ borderRadius: 3 }}
                ></Image>
              </Pressable>
            )}

            {photoCount == 4 && (
              <View
                style={{
                  flex: 1,
                  height: 65,
                  marginHorizontal: 5,
                  justifyContent: "center",
                }}
              ></View>
            )}
            {photoCount == 4 && (
              <View
                style={{
                  flex: 1,
                  height: 65,
                  marginHorizontal: 5,
                  justifyContent: "center",
                }}
              ></View>
            )}
            {photoCount == 5 && (
              <View
                style={{
                  flex: 1,
                  height: 65,
                  marginHorizontal: 5,
                  justifyContent: "center",
                }}
              ></View>
            )}

            {photoCount >= 6 && (
              <Pressable
                onPress={() => {
                  setSelectedImagePos("6");
                  refImageDialog.current.open();
                }}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#000000",
                  borderRadius: 10,
                  borderStyle: "dashed",
                  overflow: "hidden",
                  height: 65,
                  marginHorizontal: 5,
                }}
              >
                {selectedPhoto6 != "" ? (
                  <ImageBackground
                    source={{
                      uri: selectedPhoto6.uri,
                    }}
                    style={{
                      height: 65,
                      resizeMode: "contain",
                    }}
                    imageStyle={{ borderRadius: 3 }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (photoCount == 6) {
                          setPhotoCount(5);
                          setSelectedPhoto6("");
                        } else if (photoCount == 7) {
                          setPhotoCount(6);
                          setSelectedPhoto6(selectedPhoto7);
                          setSelectedPhoto7("");
                        } else if (photoCount == 8) {
                          setPhotoCount(7);
                          setSelectedPhoto7(selectedPhoto8);
                          setSelectedPhoto6(selectedPhoto7);
                          setSelectedPhoto8("");
                        } else if (photoCount == 9) {
                          setPhotoCount(8);
                          setSelectedPhoto8(selectedPhoto9);
                          setSelectedPhoto7(selectedPhoto8);
                          setSelectedPhoto6(selectedPhoto7);
                          setSelectedPhoto9("");
                        } else if (photoCount == 10) {
                          setPhotoCount(9);
                          setSelectedPhoto9(selectedPhoto10);
                          setSelectedPhoto8(selectedPhoto9);
                          setSelectedPhoto7(selectedPhoto8);
                          setSelectedPhoto6(selectedPhoto7);
                          setSelectedPhoto10("");
                        }
                      }}
                      style={{
                        marginRight: 10,
                        marginTop: 10,
                        alignItems: "flex-end",
                      }}
                    >
                      <Image
                        style={{ width: 10, height: 10 }}
                        source={Icons.ic_close}
                      ></Image>
                    </TouchableOpacity>
                  </ImageBackground>
                ) : null}
              </Pressable>
            )}

            {photoCount == 6 && (
              <Pressable
                onPress={() => {
                  setSelectedImagePos("7");
                  refImageDialog.current.open();
                }}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#000000",
                  borderRadius: 10,
                  borderStyle: "dashed",
                  overflow: "hidden",
                  height: 65,
                  marginHorizontal: 5,
                  justifyContent: "center",
                }}
              >
                <Image
                  source={Icons.ic_zoom_in_map}
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: "cover",
                    alignSelf: "center",
                  }}
                  imageStyle={{ borderRadius: 3 }}
                ></Image>
              </Pressable>
            )}
            {photoCount >= 7 && (
              <Pressable
                onPress={() => {
                  setSelectedImagePos("7");
                  refImageDialog.current.open();
                }}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#000000",
                  borderRadius: 10,
                  borderStyle: "dashed",
                  overflow: "hidden",
                  height: 65,
                  marginHorizontal: 5,
                }}
              >
                {selectedPhoto7 != "" ? (
                  <ImageBackground
                    source={{
                      uri: selectedPhoto7.uri,
                    }}
                    // key={index}
                    style={{
                      //width: 65,
                      height: 65,
                      resizeMode: "contain",
                    }}
                    imageStyle={{ borderRadius: 3 }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (photoCount == 7) {
                          setPhotoCount(6);
                          setSelectedPhoto7("");
                        } else if (photoCount == 8) {
                          setPhotoCount(7);
                          setSelectedPhoto7(selectedPhoto8);
                          setSelectedPhoto8("");
                        } else if (photoCount == 9) {
                          setPhotoCount(8);
                          setSelectedPhoto8(selectedPhoto9);
                          setSelectedPhoto7(selectedPhoto8);
                          setSelectedPhoto9("");
                        } else if (photoCount == 10) {
                          setPhotoCount(9);
                          setSelectedPhoto9(selectedPhoto10);
                          setSelectedPhoto8(selectedPhoto9);
                          setSelectedPhoto7(selectedPhoto8);
                          setSelectedPhoto10("");
                        }
                      }}
                      style={{
                        marginRight: 10,
                        marginTop: 10,
                        alignItems: "flex-end",
                      }}
                    >
                      <Image
                        style={{ width: 10, height: 10 }}
                        source={Icons.ic_close}
                      ></Image>
                    </TouchableOpacity>
                  </ImageBackground>
                ) : null}
              </Pressable>
            )}
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            {photoCount >= 8 && (
              <Pressable
                onPress={() => {
                  setSelectedImagePos("8");
                  refImageDialog.current.open();
                }}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#000000",
                  borderRadius: 10,
                  borderStyle: "dashed",
                  overflow: "hidden",
                  height: 65,
                  marginHorizontal: 5,
                }}
              >
                {selectedPhoto8 != "" ? (
                  <ImageBackground
                    source={{
                      uri: selectedPhoto8.uri,
                    }}
                    // key={index}
                    style={{
                      //width: 65,
                      height: 65,
                      resizeMode: "contain",
                    }}
                    imageStyle={{ borderRadius: 3 }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (photoCount == 8) {
                          setPhotoCount(7);
                          setSelectedPhoto8("");
                        } else if (photoCount == 9) {
                          setPhotoCount(8);
                          setSelectedPhoto8(selectedPhoto9);
                          setSelectedPhoto9("");
                        } else if (photoCount == 10) {
                          setPhotoCount(9);
                          setSelectedPhoto9(selectedPhoto10);
                          setSelectedPhoto8(selectedPhoto9);
                          setSelectedPhoto10("");
                        }
                      }}
                      style={{
                        marginRight: 10,
                        marginTop: 10,
                        alignItems: "flex-end",
                      }}
                    >
                      <Image
                        style={{ width: 10, height: 10 }}
                        source={Icons.ic_close}
                      ></Image>
                    </TouchableOpacity>
                  </ImageBackground>
                ) : null}
              </Pressable>
            )}

            {photoCount >= 7 && photoCount <= 8 && (
              <Pressable
                onPress={() => {
                  if (photoCount == 8) {
                    setSelectedImagePos("9");
                    refImageDialog.current.open();
                  } else {
                    setSelectedImagePos("8");
                    refImageDialog.current.open();
                  }
                }}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#000000",
                  borderRadius: 10,
                  borderStyle: "dashed",
                  overflow: "hidden",
                  height: 65,
                  marginHorizontal: 5,
                  justifyContent: "center",
                }}
              >
                <Image
                  source={Icons.ic_zoom_in_map}
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: "cover",
                    alignSelf: "center",
                  }}
                  imageStyle={{ borderRadius: 3 }}
                ></Image>
              </Pressable>
            )}

            {photoCount == 7 && (
              <View
                style={{
                  flex: 1,
                  height: 65,
                  marginHorizontal: 5,
                  justifyContent: "center",
                }}
              ></View>
            )}
            {photoCount == 7 && (
              <View
                style={{
                  flex: 1,
                  height: 65,
                  marginHorizontal: 5,
                  justifyContent: "center",
                }}
              ></View>
            )}
            {photoCount == 8 && (
              <View
                style={{
                  flex: 1,
                  height: 65,
                  marginHorizontal: 5,
                  justifyContent: "center",
                }}
              ></View>
            )}


            {photoCount >= 9 && (
              <Pressable
                onPress={() => {
                  setSelectedImagePos("9");
                  refImageDialog.current.open();
                }}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#000000",
                  borderRadius: 10,
                  borderStyle: "dashed",
                  overflow: "hidden",
                  height: 65,
                  marginHorizontal: 5,
                }}
              >

                {selectedPhoto9 != "" ? (
                  <ImageBackground
                    source={{
                      uri: selectedPhoto9.uri,
                    }}
                    style={{
                      height: 65,
                      resizeMode: "contain",
                    }}
                    imageStyle={{ borderRadius: 3 }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (photoCount == 9) {
                          setPhotoCount(8);
                          setSelectedPhoto9("");
                        } else if (photoCount == 10) {
                          setPhotoCount(9);
                          setSelectedPhoto9(selectedPhoto10);
                          setSelectedPhoto10("");
                        }
                      }}
                      style={{
                        marginRight: 10,
                        marginTop: 10,
                        alignItems: "flex-end",
                      }}
                    >
                      <Image
                        style={{ width: 10, height: 10 }}
                        source={Icons.ic_close}
                      ></Image>
                    </TouchableOpacity>
                  </ImageBackground>
                ) : null}
              </Pressable>
            )}

            {photoCount == 9 && (
              <Pressable
                onPress={() => {
                  setSelectedImagePos("10");
                  refImageDialog.current.open();
                }}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#000000",
                  borderRadius: 10,
                  borderStyle: "dashed",
                  overflow: "hidden",
                  height: 65,
                  marginHorizontal: 5,
                  justifyContent: "center",
                }}
              >
                <Image
                  source={Icons.ic_zoom_in_map}
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: "cover",
                    alignSelf: "center",
                  }}
                  imageStyle={{ borderRadius: 3 }}
                ></Image>
              </Pressable>
            )}

            {photoCount >= 10 && (
              <Pressable
                onPress={() => {
                  setSelectedImagePos("10");
                  refImageDialog.current.open();
                }}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#000000",
                  borderRadius: 10,
                  borderStyle: "dashed",
                  overflow: "hidden",
                  height: 65,
                  marginHorizontal: 5,
                }}
              >
                {selectedPhoto10 != "" ? (
                  <ImageBackground
                    source={{
                      uri: selectedPhoto10.uri,
                    }}
                    style={{
                      height: 65,
                      resizeMode: "contain",
                    }}
                    imageStyle={{ borderRadius: 3 }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (photoCount == 10) {
                          setPhotoCount(9);
                          setSelectedPhoto10("");
                        }
                      }}
                      style={{
                        marginRight: 10,
                        marginTop: 10,
                        alignItems: "flex-end",
                      }}
                    >
                      <Image
                        style={{ width: 10, height: 10 }}
                        source={Icons.ic_close}
                      ></Image>
                    </TouchableOpacity>
                  </ImageBackground>
                ) : null}
              </Pressable>
            )}
          </View>

          {/* )} */}

          <CustomTextInput
            ref={refListingName}
            value={listingName}
            changeText={(value) => setListingName(value)}
            placeholder={t("listing_name")}
            returnKeyType={"next"}
            blurOnSubmit={false}
            onSubmitEditing={() => {
              refListingPrice.current.focus();
            }}
          ></CustomTextInput>
          {categoryName==11 && (

          <View>
          <TextInput
              blurOnSubmit={false}
              returnKeyType={"default"}
              value={address}
              onChangeText={(value) => {
              setAddress(value)
              }}
              style={{
                textAlignVertical: "top",
                paddingLeft: 20,
                paddingTop: 10,
                paddingEnd: 20,
             
                minHeight: verticalScale(250),
                fontFamily: Fonts.Helvetica,
                fontWeight: "400",
                borderRadius: 10,
                borderColor: colors.black,
                borderWidth: moderateScale(1),
                marginTop: 20,
                color: colors.black,
              }}
              placeholderTextColor={"rgba(203, 203, 203, 1)"}
              keyboardType="default"
              placeholder={t("house_address")}
              multiline={true}
              numberOfLines={5}
              maxLength={
               250
              }
            ></TextInput>

            <CustomText
              style={{
                color: colors.red,
                marginTop: 5,
                marginHorizontal:5,
                fontSize: moderateScale(20),
              }}
            >
            This address will be displayed publicly on your listing.
            </CustomText>
          </View>
          )}
          <View
            style={{
              borderRadius: moderateScale(16),
              marginTop: 20,
              height: verticalScale(100),
              borderColor: colors.black,
              borderWidth: moderateScale(1),
              flexDirection: "row",
              width: "100%",
            }}
          >
            <CustomText
              style={{
                color: listingPrice != null ? colors.black : colors.grey,
                paddingLeft: moderateScale(26),
                marginTop: 1,
                alignSelf: "center",
                fontSize: moderateScale(20),
              }}
            >
              $
            </CustomText>

            <CurrencyInput
              style={{ width: "90%", color: colors.black }}
              ref={refListingPrice}
              value={listingPrice}
              // prefix="$"
              delimiter=","
              separator="."
              precision={2}
              onChangeText={(formattedValue) => {
                console.log(formattedValue); // $2,310.46
              }}
              onChangeValue={setListingPrice}
              placeholder={t("listing_Price1")}
              keyboardType={"numeric"}
              returnKeyType={"done"}
              blurOnSubmit={false}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              placeholderTextColor={"rgba(203, 203, 203, 1)"}
              maxLength={10}
            ></CurrencyInput>
          </View>
          <CustomDropDown
            onValueChange={(value) => setCategoryName(value)}
            data={categoryList}
            value={categoryName}
          ></CustomDropDown>
          {subCategoryList && subCategoryList.length > 0 && (
            <CustomDropDown
              onValueChange={(value) => setSubCategoryName(value)}
              data={subCategoryList}
              value={subCategoryName}
            ></CustomDropDown>
          )}
          {categoryDList.map((item, i) => {
            if (item.input_type === "0") {
              return (
                <CustomTextInput
                  value={dynamicData[`${item.id}`]}
                  changeText={(value) => {
                    console.log("onChage Text Box : ", value);
                    var mData = dynamicData;
                    mData[`${item.id}`] = value;
                    setDynamicData(mData);
                    refreshRenderer();
                  }}
                  placeholder={item.title}
                  returnKeyType={"next"}
                  blurOnSubmit={false}
                ></CustomTextInput>
              );
            } else if (item.input_type === "1") {
              const mValue = dynamicData.hasOwnProperty(`${item.id}`)
                ? dynamicData[`${item.id}`]
                : "";
              const consumedChar = mValue.length;
              const leftChars = 250 - consumedChar;
              return (
                <View
                  style={{
                    minHeight: verticalScale(250),
                    borderRadius: 10,
                    marginTop: 20,
                    borderColor: colors.black,
                    borderWidth: moderateScale(1),
                  }}
                >
                  <TextInput
                    value={dynamicData[`${item.id}`]}
                    onChangeText={(value) => {
                      console.log("changeText TextArea : ", value);
                      var mData = dynamicData;
                      mData[`${item.id}`] = value;
                      setDynamicData(mData);
                      refreshRenderer();
                    }}
                    style={{
                      textAlignVertical: "top",
                      paddingLeft: 20,
                      paddingTop: 10,
                      paddingEnd: 20,
                      minHeight: verticalScale(250),
                      color: colors.black,
                    }}
                    placeholderTextColor={"rgba(203, 203, 203, 1)"}
                    placeholder={item?.title}
                    multiline={true}
                    numberOfLines={5}
                    require={true}
                    maxLength={250}
                  ></TextInput>
                  <CustomText
                    style={{
                      marginTop: 5,
                      alignSelf: "flex-end",
                      paddingRight: 20,
                      marginBottom: 5,
                    }}
                  >
                    {`${leftChars}` + t("characters_remaining")}
                  </CustomText>
                </View>
              );
            } else if (item.input_type === "6") {
              // "input_type": "6",            "input_type_lable": "Color"

              return (
                <ColorComponent
                  placeholder={item.title}
                  value={dynamicData[`${item.id}`]}
                  textValue={dynamicData[item.id]}
                  onColorChange={(color) => {
                    console.log("color data ", dynamicData);
                    const mColor = tinycolor
                      .fromRatio({ h: color.h, s: color.s, v: color.v })
                      .toHexString();
                    var mData = dynamicData;
                    mData[`${item.id}`] = mColor;
                    setDynamicData(mData);
                    refreshRenderer();
                  }}
                  onColorSelected={(color) => {
                    var mData = dynamicData;
                    mData[`${item.id}`] = color;
                    setDynamicData(mData);
                    refreshRenderer();
                    console.log("color data ", dynamicData);
                  }}
                  onChangeText={(value) => {
                    var mData = dynamicData;
                    mData[`${item.id}`] = value;
                    setDynamicData(mData);
                    refreshRenderer();
                    console.log("changeText : ", dynamicData[`${item.id}`]);
                  }}
                ></ColorComponent>
              );
            } else if (item.input_type === "4") {
              var dropDownDataItems = [];

              var radioValue = item.input_type_value;
              var mKeys = Object.keys(radioValue);
              console.log("Drop Down Data ", mKeys);
              // dropDownDataItems.push({
              //   value: "0",
              //   label: "dgdgg0",
              // });

              for (var i = 0; i < mKeys.length; i++) {
                const mKey = mKeys[i];
                const mValue = radioValue[mKey];
                // console.log("radio mKey : ", mKey);
                // console.log("radio mValue : ", mValue);

                dropDownDataItems.push({
                  value: mKey,
                  label: mValue,
                });
              }

              return (
                <View style={{ marginTop: 10 }}>
                  <CustomText
                    style={{
                      fontSize: moderateScale(22),
                      marginHorizontal: 5,
                      marginTop: 0,
                      fontWeight: "700",
                    }}
                  >
                    {item?.title}
                  </CustomText>

                  <CustomDropDown
                    style={{ marginTop: 10 }}
                    onValueChange={(value) => {
                      console.log("onValueChange : ", value);
                      var mData = dynamicData;
                      mData[`${item.id}`] = value;
                      setDynamicData(mData);
                      refreshRenderer();
                    }}
                    data={dropDownDataItems}
                    value={
                      dynamicData.hasOwnProperty(`${item.id}`)
                        ? dynamicData[`${item.id}`]
                        : item.title
                    }
                  ></CustomDropDown>
                </View>
              );
            } else if (item.input_type === "2") {
              var radioValue = item.input_type_value;

              return (
                <View>
                  <CustomText
                    style={{
                      fontSize: moderateScale(22),
                      fontWeight: "700",
                      marginHorizontal: 10,
                    }}
                  >
                    {item?.title}
                  </CustomText>
                  <RadioGroup
                    size={18}
                    thickness={2}
                    color={colors.primary}
                    custom={true}
                    style={{
                      flexDirection: "row",
                    }}
                    selectedIndex={
                      dynamicData.hasOwnProperty(`${item.id}`)
                        ? radioValue.indexOf(dynamicData[`${item.id}`])
                        : 0
                    }
                    onSelect={(index, value) => {
                      console.log(
                        "onSelect : index - " + index + ", value - " + value
                      );
                      var mData = dynamicData;
                      mData[`${item.id}`] = value;
                      setDynamicData(mData);
                      refreshRenderer();
                    }}
                  >
                    {radioValue.map((item, i) => {
                      return (
                        <RadioButton color={colors.primary} value={item}>
                          <CustomText
                            style={{
                              color: colors.grey,
                              fontWeight: "700",
                              marginTop: 0,
                            }}
                          >
                            {returnFirstCapitalChar(item)}
                          </CustomText>
                        </RadioButton>
                      );
                    })}
                  </RadioGroup>
                </View>
              );
            } else if (item.input_type === "7") {
              // "input_type": "7",            "input_type_lable": "Date"
              return (
                <Pressable
                  style={styles.inputDropDownContainer}
                  onPress={() => {
                    setSelectedItem(item);
                    setShow(true);
                    setMode("date");
                  }}
                >
                  <CustomText
                    style={{
                      marginTop: 0,
                      marginLeft: 12,
                      fontSize: 14,
                      color: colors.grey,
                    }}
                  >
                    {dynamicData.hasOwnProperty(`${item.id}`)
                      ? dynamicData[`${item.id}`]
                      : item.title}
                  </CustomText>
                </Pressable>
              );
            } else if (item.input_type === "5") {
              // "input_type": "5",            "input_type_lable": "Year"
              return (
                <Pressable
                  style={styles.inputDropDownContainer}
                  onPress={() => {
                    console.log("item : ", item);
                    setSelectedItem(item);
                    setShowYearDialog(true);
                  }}
                >
                  <CustomText
                    style={{
                      marginTop: 0,
                      marginLeft: 12,
                      fontSize: moderateScale(22),
                      color: colors.black,
                    }}
                  >
                    {dynamicData.hasOwnProperty(`${item.id}`)
                      ? dynamicData[`${item.id}`]
                      : "Select " + item.title}
                  </CustomText>
                </Pressable>
              );
            } else {
              return null;
            }
          })}
          <View
            style={{
              minHeight: verticalScale(250),
              borderRadius: 10,
              borderColor: colors.black,
              borderWidth: moderateScale(1),
              marginTop: 20,
            }}
          >
            <TextInput
              blurOnSubmit={false}
              returnKeyType={"default"}
              value={listingDescription}
              onChangeText={(value) => {
                setListingDescription(value);
                var withoutSpace = value.replace(/ /g, "");
                var length = withoutSpace.length;
                const leftLength = descMaxLength - length;
                setReamaingLength(leftLength);
              }}
              style={{
                textAlignVertical: "top",
                paddingLeft: 20,
                paddingTop: 10,
                paddingEnd: 20,
                minHeight: verticalScale(250),
                fontFamily: Fonts.Helvetica,
                fontWeight: "400",
                color: colors.black,
              }}
              placeholderTextColor={"rgba(203, 203, 203, 1)"}
              keyboardType="default"
              //   blurOnSubmit={true}
              placeholder={t("listing_description")}
              multiline={true}
              numberOfLines={5}
              maxLength={
                descMaxLength + (listingDescription.split(" ").length - 1)
              }
            ></TextInput>
            <CustomText
              style={{
                marginTop: 5,
                alignSelf: "flex-end",
                paddingRight: 20,
                marginBottom: 5,
              }}
            >
              {`${reamaingLength}` + t("characters_remaining")}
            </CustomText>
          </View>

          <PrimaryButton
            buttonStyle={{ marginBottom: 50 }}
            onPress={() => {
            
            }}
            title={
              role == "standard_user"
                ? t("post_listing")
                : role == "business_user"
                ? t("Post Listing for $119.99/per week")
                : t("Post Listing ("+remainingListingCount+" remaining)")
            }
          ></PrimaryButton>
        </View>
      </KeyboardAwareScrollView>

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
                {t("reach_to_free_limit")}
              </CustomText>

              <View style={{ paddingHorizontal: 25 }}>
                <PrimaryButton
                  buttonStyle={{ marginTop: 15 }}
                  onPress={() => {
                    navigation.navigate("ConvertBusinessAccount");
                    showModelBusiness(false);
                  }}
                  title={t("convert_to_business_account")}
                ></PrimaryButton>

                <PrimaryButton
                  buttonStyle={{ backgroundColor: "#F42020" }}
                  onPress={() => {
                    clearData();
                    navigation.navigate("ViewItems");
                    showModelBusiness(false);
                  }}
                  title={t("cancel")}
                ></PrimaryButton>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modelBusiness}
        onRequestClose={() => {
          showModelBusinessPro(!modelBusinessPro);
        }}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <CustomText style={styles.modalTextHeader}>
                {t("reach_to_free_limit")}
              </CustomText>

              <View style={{ paddingHorizontal: 25 }}>
                <PrimaryButton
                  buttonStyle={{ backgroundColor: "#F42020" }}
                  onPress={() => {
                    clearData();
                    navigation.navigate("ViewItems");
                    showModelBusinessPro(false);
                  }}
                  title={t("cancel")}
                ></PrimaryButton>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modelListingPosted}
        onRequestClose={() => {
          setModelListingPosted(!modelListingPosted);
        }}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <CustomText style={styles.modalTextHeader}>
                {t("listing_posted_successfully")}
              </CustomText>

              <View style={{ paddingHorizontal: 25 }}>
                <PrimaryButton
                  buttonStyle={{ marginTop: 15 }}
                  onPress={() => {
                    navigation.navigate("ViewItems");
                    setModelBoostPost(false);
                    setModelListingPosted(false);
                  }}
                  title={t("close")}
                ></PrimaryButton>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modelLearnSubscription}
        onRequestClose={() => {
          setModelLearnSubscription(!modelLearnSubscription);
        }}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <CustomText style={styles.modalTextHeader}>
                {t("want_to_learn_about_subscription_plans")}
              </CustomText>

              <View style={{ paddingHorizontal: 25 }}>
                <PrimaryButton
                  buttonStyle={{ marginTop: 15 }}
                  onPress={() => {
                    navigation.navigate("Subscription");
                    showModelBusiness(false);
                    setModelLearnSubscription(false);
                    clearData();
                  }}
                  title={t("learn_about_our_subscription_plans")}
                ></PrimaryButton>

                <PrimaryButton
                  buttonStyle={{ backgroundColor: "#F42020" }}
                  onPress={() => {
                    clearData();
                    navigation.navigate("ViewItems");
                    showModelBusiness(false);
                    setModelLearnSubscription(false);
                  }}
                  title={t("skip")}
                ></PrimaryButton>
                
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modelBoostPost}
        onRequestClose={() => {
          setModelBoostPost(!modelBoostPost);
        }}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {products &&
                products.map((p) => (
                  <CustomText style={styles.modalTextBoostHeader}>
                    {t("would_you_like_to_promote_your_post_for") +
                      returnCurrencySymbol(p["currency"]) +
                      p["price"] +
                      "/ " +
                      boostDay +
                      (boostDay == 1 ? t("day") : t("days")) +
                      // t("days") +
                      "?"}
                  </CustomText>
                ))}

              <View style={{ paddingHorizontal: 25 }}>
                <CustomDropDown
                  onValueChange={(value) => setBoostDay(value)}
                  data={boostDayList}
                  value={boostDay}
                ></CustomDropDown>

                {products &&
                  products.map((prod) => (
                    <PrimaryButton
                      onPress={() => {
                        RNIap.requestPurchase(prod["productId"]);
                      }}
                      title={t("boost_post")}
                      buttonStyle={[{ marginBottom: 5 }]}
                    ></PrimaryButton>
                  ))}

                <PrimaryButton
                  buttonStyle={{ backgroundColor: "#F42020" }}
                  onPress={() => {
                    setModelBoostPost(false);
                    setTimeout(() => {
                      setModelListingPosted(true);
                    }, 100);
                  }}
                  title={t("skip")}
                >
                  
                </PrimaryButton>
              
                <TouchableOpacity
                  onPress={() => {
                    setModelBoostPost(false);
                    setTimeout(() => {
                      setModelLearnSubscription(true);
                    }, 100);
                  }}
                >
                  <CustomText
                    style={{
                      color: colors.black,
                      fontSize: 14,
                      textDecorationLine: "underline",
                      textAlign: "center",
                      fontWeight: "700",
                    }}
                  >
                    {t("learn_more")}
                  </CustomText>
                </TouchableOpacity>
               
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};



export default CreateListingScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: 30,
  },

  main: {
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 35,
  },

  appLogo: {
    height: 80,
    width: 80,
    resizeMode: "contain",
    alignSelf: "center",
  },

  screenTitle: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "700",
    lineHeight: 24,
    marginTop: 0,
    fontFamily: Fonts.Helvetica,
    color: colors.primary,
  },

  signinLink: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  viewForgot: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    bottom: 0,
    position: "absolute",
    flexDirection: "row",
  },

  textForgot: {
    marginTop: 0,
    fontSize: 14,
    paddingVertical: 30,
  },

  textResetLink: {
    color: colors.primary,
    marginTop: 0,
    fontSize: 14,
    marginLeft: 4,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: colors.white,
    borderRadius: 5,
    position: "absolute",
    elevation: 5,
    width: "80%",
    paddingVertical: 25,
  },

  modalTextHeader: {
    textAlign: "center",
    color: colors.black,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Fonts.Helvetica,
    lineHeight: 24,
    marginHorizontal: 25,
    marginTop: 0,
    marginBottom: 25,
  },
  inputDropDownContainer: {
    borderWidth: 1,
    minHeight: verticalScale(100),
    justifyContent: "center",
    paddingHorizontal: Platform.OS == "android" ? 10 : 5,
    marginTop: 20,
    borderColor: "#000000",
    borderRadius: 10,
    height: verticalScale(100),
  },

  mainImage: {
    height: 173,
    width: "100%",
    resizeMode: "cover",
    borderRadius: 10,
    marginTop: 10,
    //borderWidth: 1
  },

  modalTextBoostHeader: {
    textAlign: "center",
    color: colors.black,
    fontSize: moderateScale(24),
    fontWeight: "700",
    fontFamily: Fonts.Helvetica,
    lineHeight: 24,
    marginHorizontal: 25,
    marginTop: 0,
  },
});

// "input_type": "0",             "input_type_lable": "Text Box"
// "input_type": "1",             "input_type_lable": "Text Area"
// "input_type": "2",            "input_type_lable": "Radio"
// "input_type": "4",            "input_type_lable": "Dropdown"
// "input_type": "6",            "input_type_lable": "Color"
// "input_type": "5",            "input_type_lable": "Year"
// "input_type": "7",            "input_type_lable": "Date"
