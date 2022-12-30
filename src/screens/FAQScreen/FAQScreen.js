// Example of Expandable ListView in React Native
// https://aboutreact.com/expandable-list-view/

// Import React
import React, { useEffect, useState } from "react";
// Import required components
import {
  Image,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { AlertView } from "../../components/AlertView";
import CustomText from "../../components/CustomText";
import { Header } from "../../components/Header";
import Loader from "../../components/Loader";
import { FAQApiCall } from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Icons from "../../theme/Icons";
import { useTranslation } from "react-i18next";

const ExpandableComponent = ({ item, onClickFunction }) => {
  const [LayoutHeight, setLayoutHeight] = useState(0);

  useEffect(() => {
    console.log("Itemmmmm", item);
    if (item.isExpanded) {
      setLayoutHeight(null);
    } else {
      setLayoutHeight(0);
    }
  }, [item.isExpanded]);

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.header,
              { paddingVertical: item.isExpanded ? 5 : 20 },
            ]}
            onPress={onClickFunction}
          >
            <CustomText
              style={[
                styles.headerText,
                { color: item.isExpanded ? colors.primary : colors.black },
              ]}
            >
              {item.title}
            </CustomText>
          </TouchableOpacity>
        </View>
        <View
          style={{ marginLeft: 10, marginRight: 10, justifyContent: "center" }}
        >
          {item.isExpanded ? (
            <Image source={Icons.ic_arrow_up}></Image>
          ) : (
            <Image source={Icons.ic_arrow_down}></Image>
          )}
        </View>
      </View>

      <View style={{ height: LayoutHeight, overflow: "hidden" }}>
        <TouchableOpacity style={styles.content}>
          <CustomText style={styles.detailsText}>{item.description}</CustomText>
          <View style={styles.separator}></View>
        </TouchableOpacity>
      </View>
      <View
        style={{ height: 1, backgroundColor: "#F4F4F4", marginHorizontal: 20 }}
      ></View>
    </View>
  );
};

const FAQScreen = ({ navigation }) => {
  const [multiSelect, setMultiSelect] = useState(false);
  const [listDataSource, setlistDataSource] = useState(CONTENT);
  const [isLoading, setLoading] = useState(false);
  const [faqList, setFaqList] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, showAlertMessage] = useState("");
  const { t } = useTranslation();

  const getFAQList = () => {
    setLoading(true);

    FAQApiCall()
      .then((res) => {
        setLoading(false);

        console.log("FaqList====>", res);
        if (res.success) {
          setFaqList(res.data);
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
  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...faqList];
    if (multiSelect) {
      array[index]["isExpanded"] = !array[index]["isExpanded"];
    } else {
      array.map((value, placeindex) =>
        placeindex === index
          ? (array[placeindex]["isExpanded"] = !array[placeindex]["isExpanded"])
          : (array[placeindex]["isExpanded"] = false)
      );
    }
    setFaqList(array);
  };

  useEffect(() => {
    getFAQList();
  }, []);
  //Custom Component for the Expandable List

  return (
    <View style={styles.container}>
      <Header
        title={t("faq")}
        onBack={() => navigation.goBack()}
        isShowCart={false}
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
      <ScrollView>
        {faqList.map((item, key) => (
          <ExpandableComponent
            key={item.title}
            onClickFunction={() => {
              updateLayout(key);
            }}
            item={item}
          />
        ))}
              <View style={{ height: 40, backgroundColor: "transparent" }}></View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  header: {
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 0,
  },
  separator: {
    height: 0.5,
    
    backgroundColor: "#F4F4F4",
    width: "95%",
  },
  detailsText: {
    fontSize: 14,
    marginLeft: 10,
    marginTop: 0,
    color: colors.unactiveTab,
    marginBottom: 10,
  },

  content: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#fff",
  },
});
export default FAQScreen;

const CONTENT = [
  {
    isExpanded: false,
    category_name: "Lorem Ipsum doler sit amet",
    subcategory: [
      {
        val: "Lorem ipsum dolor sit amet. consectetur adipiscing elit. Sed id mauris risus. Integer posuere a lorem eu convallis. Proin in vulputate ex. Suspendisse vestibulum consequat ligula in imperdiet.Proin id dolor maximus mi mollis elementum. Nam libero augue, lacinia quis erat ac, gravida feugiat odio. Curabitur ultricies quam orci, sed venenatis velit posuere a.",
      },
    ],
  },
  {
    isExpanded: false,
    category_name: "Lorem  doler sit amet",
    subcategory: [
      {
        val: "Lorem ipsum dolor sit amet. consectetur adipiscing elit. Sed id mauris risus. Integer posuere a lorem eu convallis. Proin in vulputate ex. Suspendisse vestibulum consequat ligula in imperdiet.Proin id dolor maximus mi mollis elementum. Nam libero augue, lacinia quis erat ac, gravida feugiat odio. Curabitur ultricies quam orci, sed venenatis velit posuere a.",
      },
    ],
  },
  {
    isExpanded: false,
    category_name: "Lorem Ipsum  sit amet",
    subcategory: [
      {
        val: "Lorem ipsum dolor sit amet. consectetur adipiscing elit. Sed id mauris risus. Integer posuere a lorem eu convallis. Proin in vulputate ex. Suspendisse vestibulum consequat ligula in imperdiet.Proin id dolor maximus mi mollis elementum. Nam libero augue, lacinia quis erat ac, gravida feugiat odio. Curabitur ultricies quam orci, sed venenatis velit posuere a.",
      },
    ],
  },
  {
    isExpanded: false,
    category_name: "Lorem Ipsum doler  amet",
    subcategory: [
      {
        val: "Lorem ipsum dolor sit amet. consectetur adipiscing elit. Sed id mauris risus. Integer posuere a lorem eu convallis. Proin in vulputate ex. Suspendisse vestibulum consequat ligula in imperdiet.Proin id dolor maximus mi mollis elementum. Nam libero augue, lacinia quis erat ac, gravida feugiat odio. Curabitur ultricies quam orci, sed venenatis velit posuere a.",
      },
    ],
  },
];
