import { DrawerActions, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Image,
  LogBox,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { AlertView } from "../../components/AlertView";
import CustomBottomDialog from "../../components/CustomBottomDialog";
import CustomText from "../../components/CustomText";
import { Header } from "../../components/Header";
import Item from "../../components/Item";
import Loader from "../../components/Loader";
import { moderateScale } from "../../components/scalling";
import {
  addRemoveFavorite,
  getCategoryApiCall,
  getFavoriteListing,
} from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Icons from "../../theme/Icons";
import { StaticData } from "../ViewItems/StaticData";

const { width, height } = Dimensions.get("window");

LogBox.ignoreAllLogs();
const FavouriteScreen = ({ navigation }) => {
  const refRBSort = useRef();
  const { t } = useTranslation();

  const [selSort, setSelSort] = useState(1);
  const [selSortTitle, setSelSortTitle] = useState(t("latest"));

  const refRBFilter = useRef();
  const [selFilter, setSelFilter] = useState(1);
  const [selFilterTitle, setSelFilterTitle] = useState(t("all"));

  const isFocused = useIsFocused();
  const [isLoading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [listItems, setListItems] = useState([]);
  const [tmpListItems, setTmpListItems] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const data = useSelector((state) => state.viewItemReducer.data.list);

  useEffect(() => {
    if (isFocused) {
      getCategoryData();
      getItemList();
    }
  }, [isFocused]);

  const getCategoryData = () => {
    setLoading(true);
    getCategoryApiCall()
      .then((res) => {
        setLoading(false);
        console.log("Categorty====>", res);
        if (res.success) {
          var data = [];

          var tempList = res.data;
          data.push({ id: null, title: t("all") });

          for (var i = 0; i < tempList.length; i++) {
            data.push({
              id: tempList[i].id,
              title: tempList[i].name,
            });
          }
          setCategoryList(data);
        } else {
          setShowAlert(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setShowAlert(true);
      });
  };

  const getItemList = async (params) => {
    const param = new FormData();
    param.append("category_id", selFilter);
    param.append("sort", selSort);
    console.log("Listing params", JSON.stringify(param));

    setLoading(true);

    getFavoriteListing(params)
      .then((res) => {
        setLoading(false);
        if (res.success) {
          console.log("Data=>", res.data);
          setListItems(res.data);
          setTmpListItems(res.data);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlertMessage(error.message);
        setShowAlert(true);
      });
  };

  const [text, setText] = useState("");
  const searchData = (text) => {
    const newData = tmpListItems.filter((item) => {
      const itemData = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setListItems(newData);
    setText(text);
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
  const renderItem = ({ item, index }) => {
    return (
      <Item
        index={index}
        showCategoryDetails={true}
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
  const renderFooterNew = () => {
    return <View style={{ height: 35, backgroundColor: "transparent" }}></View>;
  };

  const AddOrRemovewishList = (item, index) => {
    const param = new FormData();
    param.append("listing_id", item.id);
    setLoading(true);
    addRemoveFavorite(param)
      .then((res) => {
        if (res.success) {
          listItems[index].favorite = item.favorite != 1 ? 1 : 0;
          let pos = data.findIndex((el) => el.id === item.id);
          data[pos] = {
            ...data[pos],
            favorite: item.favorite,
          };
          listItems.splice(index, 1);
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
        isShowCart={true}
        showDrawer={true}
        backIconColor={true}
        title={t("favourites")}
        onCartClick={() => {
          navigation.navigate("NotificationScreen");
        }}
        onBack={() => navigation.goBack()}
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
      <CustomBottomDialog
        ref={refRBSort}
        title={t("short_by")}
        value={selSort}
        data={StaticData.sortStaticData}
        onPressOk={() => {
          console.log("onPressOk");
          getItemList();

          refRBSort.current.close();
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
          getItemList();

          refRBFilter.current.close();
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
      <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
        <View style={styles.searchSection}>
          <Image
            style={styles.searchIcon}
            source={Icons.ic_search}
            resizeMode={"contain"}
          />
          <TextInput
            style={styles.input}
            placeholder={t("search")}
            value={text}
            placeholderTextColor={"rgba(203, 203, 203, 1)"}
            onChangeText={(text) => searchData(text)}
            underlineColorAndroid="transparent"
          />
        </View>
        <View
          style={{
            margin: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            //style={styles.searchIcon}
            source={Icons.ic_location}
            resizeMode={"cover"}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          marginTop: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flexDirection: "row" }}>
            <CustomText style={{ marginTop: 0, fontWeight: "700" }}>
              {t("filter") + ":"}
            </CustomText>
            <TouchableOpacity
              onPress={() => {
                refRBFilter.current.open();
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <CustomText
                  style={{ marginTop: 0, marginLeft: 5, fontWeight: "700" }}
                >
                  {selFilterTitle}
                </CustomText>
                <Image
                  style={{
                    width: 10,
                    height: 8,
                    alignSelf: "center",
                    marginLeft: 5,
                  }}
                  source={Icons.ic_down_arrow}
                ></Image>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginLeft: 10,
              alignItems: "center",
            }}
          >
            <CustomText style={{ marginTop: 0, fontWeight: "700" }}>
              {t("Sort") + ":"}
            </CustomText>
            <TouchableOpacity
              onPress={() => {
                refRBSort.current.open();
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <CustomText
                  style={{ marginTop: 0, marginLeft: 5, fontWeight: "700" }}
                >
                  {selSortTitle}
                </CustomText>
                <Image
                  style={{
                    width: 10,
                    height: 8,
                    alignSelf: "center",
                    marginLeft: 5,
                  }}
                  source={Icons.ic_down_arrow}
                ></Image>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: 15,
          marginTop: 20,
          flex: 1,
        }}
        data={formatData(listItems)}
        renderItem={renderItem}
        numColumns={2}
        ListFooterComponent={listItems?.length > 0 ? renderFooterNew : null}
        keyExtractor={(item, index) => index}
      />
    </View>
  );
};

export default FavouriteScreen;

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
