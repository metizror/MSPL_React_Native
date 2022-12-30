import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../theme/colors";
import CustomText from "./CustomText";
import { moderateScale, verticalScale } from "./scalling";
import { useTranslation } from "react-i18next";

const YearPicker = (props) => {
  const {
    onSelect,
    yearList,
    selectedYear,
    showDialog,
    onRequestClose,
    onPressClose,
    onPressOk,
  } = props;
  const { t } = useTranslation();

  return (
    <Modal
      transparent={true}
      animationType={"none"}
      visible={showDialog}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              flexDirection: "row",
              backgroundColor: "#F7F7F7",
              height: verticalScale(100),
              width: "100%",
            }}
          >
            <CustomText
              style={{
                marginTop: 0,
                fontSize: moderateScale(22),
                color: colors.primary,
                fontWeight: "700",
              }}
            >
              {t("select_year")}
            </CustomText>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={true}
              persistentScrollbar={true}
              contentContainerStyle={styles.scrollView}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "90%",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {yearList.map((item, i) => {
                  return (
                    <View
                      key={i}
                      style={{
                        marginTop: 3,
                        marginBottom: 3,
                        marginLeft: 3,
                        marginRight: 3,
                        overflow: "hidden",
                        backgroundColor:
                          selectedYear == item ? colors.primary : colors.white,
                        borderRadius: 5,
                        borderColor: colors.black,
                        borderWidth: 0.5,
                        padding: 4,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          onSelect(item);
                        }}
                      >
                        <CustomText
                          style={{
                            color:
                              selectedYear == item
                                ? colors.white
                                : colors.black,
                            fontSize: moderateScale(20),
                            marginTop: 0,
                            paddingLeft: 5,
                            paddingRight: 5,
                            paddingTop: 3,
                            paddingBottom: 3,
                          }}
                        >
                          {item}
                        </CustomText>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "flex-end",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              flexDirection: "row",
              backgroundColor: "#F7F7F7",
              height: verticalScale(100),
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{ marginRight: 20 }}
              onPress={onPressClose}
            >
              <CustomText
                style={{
                  marginTop: 0,
                  color: "#F47920",
                  fontWeight: "700",
                  fontSize: moderateScale(22),
                }}
              >
                {t("close")}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginRight: 20 }}
              onPress={() => {
                onPressOk(selectedYear);
              }}
            >
              <CustomText
                style={{
                  marginTop: 0,
                  color: "#F47920",
                  fontWeight: "700",
                  fontSize: moderateScale(22),
                }}
              >
                {t("ok")}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040",
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: "60%",
    width: "80%",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  scrollView: {
    paddingTop: 10,
    width: "100%",
    alignItems: "center",
  },
});

export default YearPicker;
