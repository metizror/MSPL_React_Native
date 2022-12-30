import { DrawerActions, useIsFocused } from "@react-navigation/native";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  LogBox,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import GetLocation from "react-native-get-location";
import { useDispatch, useSelector } from "react-redux";
import { AlertConfirmDialog } from "../../components/AlertConfirmDialog";
import { AlertView } from "../../components/AlertView";
import CustomBottomDialog from "../../components/CustomBottomDialog";
import CustomText from "../../components/CustomText";
import { Header } from "../../components/Header";
import Item from "../../components/Item";
import Loader from "../../components/Loader";
import { PrimaryButton } from "../../components/PrimaryButton";
import {
  horizontalScale,
  moderateScale,
  verticalScale
} from "../../components/scalling";
import { clearViewData, LOAD_MORE_EVENT } from "../../redux/action/action";
import {
  addRemoveFavorite,
  getCategoryApiCall,
  viewItemApiCall
} from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Icons from "../../theme/Icons";
import { clearLoginData } from "../../Utils/Helper";
import { StaticData } from "./StaticData";
import { ScrollView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");
LogBox.ignoreAllLogs();
const ViewItems = ({ navigation }) => {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const refRBDistance = useRef();
  const refFlatList = useRef();
  const [selDistance, setSelDistance] = useState(30);
  const [selDistanceTitle, setSelDistanceTitle] = useState("30" + t("miles"));

  const refRBSort = useRef();
  const [selSort, setSelSort] = useState(1);
  const [selSortTitle, setSelSortTitle] = useState(t("latest"));

  const refRBFilter = useRef();
  const [selFilter, setSelFilter] = useState("");
  const [selFilterTitle, setSelFilterTitle] = useState(t("all"));

  const [isLoading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [listItems, setListItems] = useState([]);

  const [showSettingAlert, setShowSettingAlert] = useState(false);
  const [settingAlertMessage, setSettingAlertMessage] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [isInternet, setIsInternet] = useState(true);

  // const [offset, setOffset] = useState(Number(1));

  var offset = 1;

  const [latitute, setLatitute] = useState(0.0);
  const [longitute, setLongitute] = useState([]);
  const [dataUpdated, setDataUpdated] = React.useState(false);
  const randomBool =  useMemo(()=>  Math.random()<0.5,[]); 
  const deepLinking = useSelector(
    (state) => state.deepLinkingReducer.deepLinking
  );

  const loadMore = useSelector((state) => state.loadMoreReducer.loadMore);

  var isLoad = useSelector((state) => state.viewItemReducer.data.isLoading);
  var data = useSelector((state) => state.viewItemReducer.data.list);



  var next_page_url = useSelector(
    (state) => state.viewItemReducer.data.next_page_url
  );

  var intialUrl = "listing?page=1";

  const { mainCategory } = useSelector((state) => ({
    mainCategory: state.categoryReducer.data.list,
  }));

  

  const getViewItemwithRedux1 = async () => {
    dispatch(clearViewData());
    const param = new FormData();
    param.append("category_id", selFilter);
    //param.append("sort", selSort);
    dispatch(viewItemApiCall(intialUrl, param));
  };

  const getViewItemwithRedux2 = async () => {
    const param = new FormData();
    param.append("category_id", selFilter);
  //  param.append("sort", selSort);

    var fields = next_page_url.split("api/");

    var finalUrl = fields[1];
    console.log("Final Url", finalUrl);
    dispatch(viewItemApiCall(finalUrl, param));
  };

  useEffect(() => {

    console.log("Open Appp", "Open Appp");
    getCategoryData();
    if (data.length === 0) {
      getViewItemwithRedux1();
    }
  }, []);

  
  const logoutDialog = () => {
    setSettingAlertMessage(t("location_permition_from_seeting_msg"));
    setShowSettingAlert(true);
  };
  const getLocationPermitions = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 15000,
    })
      .then((location) => {
        console.log("Locations===>", location);
        navigation.navigate("MapViewScreen", { location: location });
      })
      .catch((error) => {
        const { code, message } = error;
        console.log("map issue==>", code, message);
        logoutDialog();
      });
  };

  const numOfColumns = 2;

  const formatData = (list) => {
    if (numOfColumns > 0) {
      const numberOfFullRows = Math.floor(list.length / numOfColumns);
      let numberOfElementsLastRow =
        list.length - numberOfFullRows * numOfColumns;
      while (
        numberOfElementsLastRow !== numOfColumns &&
        numberOfElementsLastRow !== 0
      ) {
        list.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
        numberOfElementsLastRow++;
      }
    }
    return list;
  };

  const emptyView = () => {
    return (
      <CustomText
        style={{
          fontSize: moderateScale(30),
          color: colors.primary,
          justifyContent: "center",
          textAlign: "center",
          marginTop: 50,
        }}
      >
        {t("no_data_found")}
      </CustomText>
    );
  };

  const getCategoryData = () => {
    setLoading(true);
    getCategoryApiCall()
      .then((res) => {
        setLoading(false);
        console.log("Categorty====>", res);
       
        if (res.success) {
          var data = [];

          var tempList = res.data;
          data.push({ id: 0, title: t("all") });

          for (var i = 0; i < tempList.length; i++) {
            data.push({
              id: tempList[i].id,
              title: tempList[i].name,
            });
          }
          setCategoryList(data);
        } else if(res.message=="Unauthenticated."){
          setAlertMessage(res.message);
          clearLoginData();
          props.navigation.replace("AuthStack", { screen: "LaunchScreen" });
        }
        else {
          
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setShowAlert(true);
      });
  };

  const AddOrRemovewishList = (item, index) => {
    const param = new FormData();
    param.append("listing_id", item.id);
    setLoading(true);
    addRemoveFavorite(param)
      .then((res) => {
        console.log("----getListing ", res);
        if (res.success) {
          data[index].favorite = item.favorite != 1 ? 1 : 0;
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlertMessage(error.message);
        setShowAlert(true);
      });
  };

  const RenderItem = ({ item, index }) => {
    console.log("index", index);
    return (
      <Item
        index={index}
        item={item}
        screenType={"ViewItem"}
        onPressItem={() => {
          navigation.navigate("ViewItemUser", {
            itemId: item.id,
          });
        }}
        onPresswishItem={() => {
          AddOrRemovewishList(item, index);
        }}
      />
    );
  };

  const renderFooterNew = () => {
    return (
      //Footer View with Load More button

      <View style={styles.footer}>
        {next_page_url != "" && (
          <PrimaryButton
            title={t("click_here_to_view_more")}
            onPress={() => {
              if (next_page_url != "") {
                getViewItemwithRedux2();
              } else {
                setAlertMessage(t("no_more_data_found"));
                setShowAlert(true);
              }
            }}
          ></PrimaryButton>
        )}
      </View>
    );
  };

  return (
   

    <View style={styles.container}>
      <Header
        isShowBackButton={false}
        showDrawer={true}
        isShowCart={true}
        onCartClick={() => {
          navigation.navigate("NotificationScreen");
        }}
        openDrawer={() => navigation.dispatch(DrawerActions.openDrawer())}
      ></Header>
      <Loader loading={isLoad} />
      <AlertView
        showAlert={showAlert}
        message={alertMessage}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
        onDismiss={() => setShowAlert(false)}
      ></AlertView>

      <AlertConfirmDialog
        title={""}
        showAlert={showSettingAlert}
        message={settingAlertMessage}
        onConfirmPressed={async () => {
          Linking.openSettings();
          setShowSettingAlert(false);
        }}
        onCancelPressed={() => {
          setShowSettingAlert(false);
        }}
        onDismiss={() => setShowSettingAlert(false)}
      ></AlertConfirmDialog>
      <CustomBottomDialog
        ref={refRBDistance}
        title={t("distance")}
        value={selDistance}
        data={StaticData.distanceStaticData}
        onPressOk={() => {
          console.log("onPressOk");
          refRBDistance.current.close();
          getViewItemwithRedux1();
        }}
        onPressClose={() => {
          console.log("onPressClose");
          refRBDistance.current.close();
        }}
        onSelectValue={(value) => {
          console.log("onSelectValue", value);
          setSelDistance(value);
        }}
        onSelectTitle={(title) => {
          console.log("onSelectTitle", title);
          setSelDistanceTitle(title);
        }}
      ></CustomBottomDialog>
      <CustomBottomDialog
        ref={refRBSort}
        title={t("sort_by")}
        value={selSort}
        data={StaticData.sortStaticData}
        onPressOk={() => {
          console.log("onPressOk");
          refRBSort.current.close();
          getViewItemwithRedux1();
        }}
        onPressClose={() => {
          console.log("onPressClose");
          refRBSort.current.close();
        }}
        onSelectValue={(value) => {
          console.log("onSelectValue", value);
          setSelSort(value);
        }}
        onSelectTitle={(title) => {
          console.log("onSelectTitle", title);
          setSelSortTitle(title);
        }}
      ></CustomBottomDialog>
      <CustomBottomDialog
        ref={refRBFilter}
        title={t("filter")}
        value={selFilter}
        data={categoryList}
        onPressOk={() => {
          console.log("onPressOk");
          refRBFilter.current.close();

          getViewItemwithRedux1();
        }}
        onPressClose={() => {
          console.log("onPressClose");
          refRBFilter.current.close();
        }}
        onSelectValue={(value) => {
          console.log("onSelectValue", value);
          setSelFilter(value);
        }}
        onSelectTitle={(title) => {
          console.log("onSelectTitle", title);
          setSelFilterTitle(title);
        }}
      ></CustomBottomDialog>

      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 15,
          // backgroundColor: "blue",
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.navigate("CategoryScreen")}
        >
          <View style={styles.searchSection}>
            <Image
              // style={styles.searchIcon}
              source={Icons.ic_search}
              resizeMode={"cover"}
            />
            <Text
              style={styles.input}
              placeholder={t("search")}
              underlineColorAndroid="transparent"
            >
              {t("search")}
            </Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            margin: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              getLocationPermitions();
            }}
          >
            <Image
              //style={styles.searchIcon}
              source={Icons.ic_location}
              resizeMode={"cover"}
            />
          </TouchableOpacity>
        </View>
      </View>

  

      <View
        style={{
          flex: 1,
          marginHorizontal: 15,
          marginTop: 5,
        }}
      >
        <FlatList
          ref={refFlatList}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.1}
          enableEmptySections={true}
          ListEmptyComponent={emptyView}
          extraData={dataUpdated}
          ListFooterComponent={data.length > 0 ? renderFooterNew : null}
          data={formatData(data)}
          renderItem={({ item, index }) => <RenderItem item={item} index={index} /> }
         numColumns={2}
          keyExtractor={(item, index) => index}
        />
      </View>
    </View>
     

  
  );
};

export default ViewItems;

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

  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  searchSection: {
    flexDirection: "row",
    // justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    margin: 10,
    borderRadius: 15,
    height: verticalScale(100),
    paddingHorizontal: 10,
  },
  searchIcon: {
    height: verticalScale(60),
    width: horizontalScale(60),
  },
  input: {
    flex: 1,
    paddingLeft: 5,
    fontSize: moderateScale(22),
    backgroundColor: "#F9F9F9",
    color: colors.black,
    borderRadius: 15,
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 40,
  },
  loadMoreBtn: {
    width: "100%",
    padding: 10,
    backgroundColor: "#F47920",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
});
