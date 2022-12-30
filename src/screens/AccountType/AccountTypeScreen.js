import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions, Image,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomText from "../../components/CustomText";
import { Header } from "../../components/Header";
import { PrimaryButton } from "../../components/PrimaryButton";
import {
  horizontalScale, moderateScale,
  verticalScale
} from "../../components/scalling";
import colors from "../../theme/colors";
import Icons from "../../theme/Icons";
const { height, width } = Dimensions.get("window");


const AccountTypeScreen = ({ navigation, route }) => {
  let data = null;
  let type = null;
  if (route.params !== undefined && route.params.data !== undefined) {
    console.log("1");
    data = route.params.data;
  } else {
    data = null;
    console.log("3");
  }

  if (route.params !== undefined && route.params.type !== undefined) {
    type = route.params.type;
    console.log("2");
  } else {
    type = null;
    console.log("4");
  }

  console.log("5");

  console.log("data_account_type===>", JSON.stringify(data));
  console.log("type_account===>", type);

  const [selectionUserType, setSelectionUserType] = useState(true);
  const [selectionBusinessType, setSelectionBusinessType] = useState(false);
  const { t } = useTranslation();

  const selection = (text) => {
    if (text === "1") {
      setSelectionUserType(true);
      setSelectionBusinessType(false);
    } else if (text === "2") {
      setSelectionUserType(false);
      setSelectionBusinessType(true);
    } else {
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Header onBack={() => navigation.goBack()}></Header>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <CustomText style={styles.TitleText}>
            {t("select_account_type")}
          </CustomText>

          <TouchableOpacity
            style={[
              styles.ItemView,
              {
                backgroundColor: selectionUserType
                  ? colors.primary
                  : colors.white,
              },
            ]}
            onPress={() => selection("1")}
          >
            <Image
              style={[
                styles.imageLayout,
                {
                  tintColor: selectionUserType ? colors.white : colors.primary,
                },
              ]}
              source={Icons.ic_acc_user}
              resizeMode={"contain"}
            ></Image>
            <CustomText
              style={[
                styles.ItemText,
                { color: selectionUserType ? colors.white : colors.primary },
              ]}
            >
              {t("individual")}
            </CustomText>
            <CustomText
              style={[
                styles.Description,
                { color: selectionUserType ? colors.white : colors.black },
              ]}
            >
              {t("great_for_individuals_looking_to_buy_and_sell_items")}
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.ItemView,
              {
                backgroundColor: selectionBusinessType
                  ? colors.primary
                  : colors.white,
              },
            ]}
            onPress={() => selection("2")}
          >
            <Image
              style={[
                styles.imageLayout,
                {
                  tintColor: selectionBusinessType
                    ? colors.white
                    : colors.primary,
                },
              ]}
              source={Icons.ic_acc_business}
              resizeMode={"contain"}
            ></Image>
            <CustomText
              style={[
                styles.ItemText,
                {
                  color: selectionBusinessType ? colors.white : colors.primary,
                },
              ]}
            >
              {t("business")}
            </CustomText>
            <CustomText
              style={[
                styles.Description,
                {
                  color: selectionBusinessType ? colors.white : colors.black,
                },
              ]}
            >
              {t("perfect_for_business")}
            </CustomText>
          </TouchableOpacity>

          <PrimaryButton
            onPress={() => {
              data == null
                ? navigation.navigate("CreateAccountScreen", {
                    userType: selectionUserType
                      ? "standard_user"
                      : "business_user",
                  })
                : navigation.navigate("CreateAccountScreen", {
                    userType: selectionUserType
                      ? "standard_user"
                      : "business_user",
                    data: data,
                    type: type,
                  });
            }}
            title={t("next")}
            buttonStyle={{ marginTop: moderateScale(40) }}
          ></PrimaryButton>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  TitleText: {
    fontSize: moderateScale(35),
    fontWeight: "700",
    color: colors.primary,
    marginVertical: moderateScale(30),
    textAlign: "center",
  },

  ItemView: {
    height: verticalScale(350),
    padding: moderateScale(10),
    borderRadius: 15,
    borderColor: "#F47920",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: moderateScale(40),
  },
  imageLayout: {
    height: verticalScale(110),
    width: horizontalScale(110),
    resizeMode: "contain",
  },
  ItemText: {
    fontSize: moderateScale(30),
    fontWeight: "700",
    color: colors.primary,
    marginTop: 0,
  },
  Description: {
    fontSize: moderateScale(18),
    color: colors.black,
    marginTop: 0,
    marginHorizontal: moderateScale(100),
    textAlign: "center",
  },
});

export default AccountTypeScreen;
