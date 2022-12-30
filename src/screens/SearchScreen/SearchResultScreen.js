import { DrawerActions } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Image,
  LogBox,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { SliderBox } from "react-native-image-slider-box";
import { useDispatch, useSelector } from "react-redux";
import { AlertView } from "../../components/AlertView";
import CustomBottomDialog from "../../components/CustomBottomDialog";
import CustomText from "../../components/CustomText";
import { Header } from "../../components/Header";
import Item from "../../components/Item";
import Loader from "../../components/Loader";
import { PrimaryButton } from "../../components/PrimaryButton";
import { clearSearchItem } from "../../redux/action/action";
import {
  addRemoveFavorite,
  searchItemApiCall,
} from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Icons from "../../theme/Icons";
import { StaticData } from "../ViewItems/StaticData";
import { moderateScale } from "../../components/scalling";
import SearchInput, { createFilter } from "react-native-search-filter";

const KEYS_TO_FILTERS = ["name"];

const { width, height } = Dimensions.get("window");

LogBox.ignoreAllLogs();
const SearchResultScreen = ({ navigation, route }) => {
  var categoryId = route.params.categoryId;
  var categoryName = route.params.categoryName;
  var subCategoryId = route.params.subCategoryId;
  var subCategoryName = route.params.subCategoryName;
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [dataUpdated, setDataUpdated] = React.useState(false);

  const refFlatList = useRef();

  const refRBDistance = useRef();
  const [selDistance, setSelDistance] = useState(30);
  const [selDistanceTitle, setSelDistanceTitle] = useState("30 miles");

  const images = [Icons.ic_demo, Icons.ic_demo, Icons.ic_demo];
  const [isLoading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  //const [listItems, setListItems] = useState([]);
  const data = useSelector((state) => state.viewItemReducer.data.list);

  var isLoad = useSelector((state) => state.searchItemReducer.data.isLoading);
  //let listItems = useSelector((state) => state.searchItemReducer.data.list);

  var next_page_url = useSelector(
    (state) => state.searchItemReducer.data.next_page_url
  );

  var { listItems } = useSelector((state) => ({
    listItems: state.searchItemReducer.data.list,
  }));

  const list = listItems.filter(createFilter(searchTerm, KEYS_TO_FILTERS));

  var intialUrl = "listing?page=1";

  const getViewItemwithRedux1 = async () => {
    console.log(subCategoryId);
    dispatch(clearSearchItem());
    const param = new FormData();
    param.append("category_id", categoryId);
    param.append("sub_category_id", subCategoryId);

    dispatch(searchItemApiCall(intialUrl, param));
  };

  const getViewItemwithRedux2 = async () => {
    const param = new FormData();
    param.append("category_id", categoryId);
    param.append("sub_category_id", subCategoryId);

    var fields = next_page_url.split("api/");

    var finalUrl = fields[1];
    console.log("Final Url", finalUrl);
    dispatch(searchItemApiCall(finalUrl, param));
  };

  useEffect(() => {
    console.log("Category ID===>", categoryId);
    listItems = [];
    getViewItemwithRedux1();
  }, [categoryId]);

  

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

  const renderItem = ({ item, index }) => {
    return (
      <Item
        index={index}
        item={item}
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
  const searchUpdated = (term) => {
    setSearchTerm(term);
  };
  const AddOrRemovewishList = (item, index) => {
    const param = new FormData();
    param.append("listing_id", item.id);
    setLoading(true);
    addRemoveFavorite(param)
      .then((res) => {
        console.log("----getListing ", res);
        if (res.success) {
          listItems[index].favorite = item.favorite != 1 ? 1 : 0;

          let pos = data.findIndex((el) => el.id === item.id);
          data[pos] = {
            ...data[pos],
            favorite: item.favorite,
          };

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

  return (
    <View style={styles.container}>
      <Header
        isShowBackButton={true}
        onBack={() => navigation.goBack()}
        showDrawer={true}
        isShowCart={true}
        backIconColor={true}
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

      <FlatList
        data={[]}
        keyExtractor={() => "key"}
        renderItem={null}
        ListHeaderComponent={
          <>
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 10,
              }}
            >
              <View style={styles.searchSection}>
                <Image
                  style={styles.searchIcon}
                  source={Icons.ic_search}
                  resizeMode={"cover"}
                />
                <SearchInput
                  style={styles.input}
                  onChangeText={(term) => {
                    searchUpdated(term);
                  }}
                  placeholder={t("search")}
                ></SearchInput>
              </View>
              {/* <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => navigation.navigate("CategoryScreen")}
              >
                <View style={styles.searchSection}>
                  <Image
                    style={styles.searchIcon}
                    source={Icons.ic_search}
                    resizeMode={"cover"}
                  />
                  <Text
                    placeholderTextColor={"rgba(203, 203, 203, 1)"}
                    style={styles.inputLabel}
                    placeholder={t("search")}
                    underlineColorAndroid="transparent"
                  >
                    {t("search") + ":"}
                  </Text>
                  <Text
                    style={styles.inputResult}
                    placeholder={t("search")}
                    underlineColorAndroid="transparent"
                  >
                    {categoryName + ", " + subCategoryName}
                  </Text>
                </View>
              </TouchableOpacity> */}
            </View>

            <View>
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 20,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <View style={{ flexDirection: "row", flex: 1 }}>
                  <CustomText style={{ marginTop: 0, fontWeight: "700" }}>
                    {t("distance") + ":"}
                  </CustomText>
                  <TouchableOpacity
                    onPress={() => {
                      refRBDistance.current.open();
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <CustomText style={{ marginTop: 0, marginLeft: 5 }}>
                        {selDistanceTitle}
                      </CustomText>
                      <Image
                        style={{
                          width: 10,
                          height: 8,
                          alignSelf: "center",
                          marginLeft: 5,
                          marginTop: -2,
                        }}
                        source={Icons.ic_down_arrow}
                      ></Image>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <SliderBox
                ImageComponent={FastImage}
                images={images}
                sliderBoxHeight={100}
                onCurrentImagePressed={(index) =>
                  console.warn(`image ${index} pressed`)
                }
                dotColor={colors.primary}
                inactiveDotColor={colors.grey}
                paginationBoxVerticalPadding={20}
                autoplay
                circleLoop
                resizeMethod={"resize"}
                resizeMode={"cover"}
                paginationBoxStyle={{
                  position: "absolute",
                  marginBottom: -30,
                  bottom: 0,
                  padding: 0,
                  alignItems: "center",
                  alignSelf: "center",
                  justifyContent: "center",
                  paddingVertical: 10,
                }}
                dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 0,
                  padding: 5,
                  marginBottom: 0,
                  backgroundColor: "rgba(128, 128, 128, 0.92)",
                }}
                ImageComponentStyle={{ borderRadius: 15, width: "90%" }}
                imageLoadingColor="#2196F3"
              />
            </View>

            <View
              style={{
                marginHorizontal: 15,
                marginTop: 30,
              }}
            >
              {list.length === 0 ? (
                <View></View>
              ) : (
                <FlatList
                  ref={refFlatList}
                  showsVerticalScrollIndicator={false}
                  onEndReachedThreshold={0.1}
                  enableEmptySections={true}
                  extraData={categoryId} // extraData={listData <--- didn't work either}
                  ListFooterComponent={renderFooterNew}
                  data={formatData(list)}
                  renderItem={renderItem}
                  numColumns={2}
                  keyExtractor={(item, index) => index}
                />
              )}
            </View>
          </>
        }
      />
    </View>
  );
};

export default SearchResultScreen;

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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    margin: 10,
    borderRadius: 15,
    height: 55,
    paddingHorizontal: 10,
    flex: 1,
  },
  searchIcon: {
    padding: 10,
  },
  inputLabel: {
    paddingLeft: 5,
    fontSize: 14,
    backgroundColor: "#F9F9F9",
    color: colors.black,
    borderRadius: 15,
    fontWeight: "700",
  },
  inputResult: {
    paddingLeft: 5,
    fontSize: 14,
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

  input: {
    flex: 1,
    paddingLeft: 5,
    fontSize: moderateScale(22),
    backgroundColor: "#F9F9F9",
    color: colors.black,
    borderRadius: 15,
  },
});
