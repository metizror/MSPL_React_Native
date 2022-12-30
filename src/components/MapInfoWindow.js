import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import colors from "../theme/colors";
import Icons from "../theme/Icons";
import { useTranslation } from "react-i18next";

const deviceWidth = Dimensions.get("window").width;
const imgSize = (deviceWidth / 10) * 2.5;
const imgSizeClose = (deviceWidth / 10) * 0.4;
const popupWidth = (deviceWidth / 10) * 8;

const MapInfoWindow = (props) => {
  const {
    item,
    modelUserProfile = false,
    setModelUserProfile,
    radioSelect,
    onPressRadio,
    onPressViewStore,
    onPressPlayStore,
  } = props;
  const { t } = useTranslation();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modelUserProfile}
      onRequestClose={() => {
        setModelUserProfile(!modelUserProfile);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View>
            <View style={{ marginHorizontal: 25, alignItems: "center" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 60,
                }}
              >
                <Image source={Icons.ic_like}></Image>

                <Text
                  style={{ fontSize: 14, fontWeight: "700", marginLeft: 5 }}
                >
                  {item.like}
                </Text>
              </View>
              <Text style={{ marginTop: 8, fontSize: 18, fontWeight: "700" }}>
                {item.name}
              </Text>

              <Text style={{ marginTop: 5, fontSize: 12, fontWeight: "400" }}>
                {item.address}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                marginTop: 15,
                marginLeft: 10,
                marginRight: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  onPressRadio(0);
                }}
                style={{
                  backgroundColor: "transparent",
                  flexDirection: "row",
                  flex: 1,
                  marginRight: 2,
                }}
              >
                <Image
                  style={{ height: 18, width: 18 }}
                  source={
                    radioSelect === 0
                      ? Icons.ic_radio_checked
                      : Icons.ic_radio_unchecked
                  }
                ></Image>
                <View style={{ flexDirection: "column", marginLeft: 7 }}>
                  <Text
                    style={{
                      color: "#CBCBCB",
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    {t("estimated_arrival")}
                  </Text>
                  <Text
                    style={{ marginTop: 2, fontSize: 12, fontWeight: "700" }}
                  >
                    {item.estimated_arrival}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  onPressRadio(1);
                }}
                style={{
                  backgroundColor: "transparent",
                  flexDirection: "row",
                  flex: 1,
                  marginLeft: 2,
                }}
              >
                <Image
                  style={{ height: 18, width: 18 }}
                  source={
                    radioSelect === 1
                      ? Icons.ic_radio_checked
                      : Icons.ic_radio_unchecked
                  }
                ></Image>
                <View style={{ flexDirection: "column", marginLeft: 10 }}>
                  <Text
                    style={{
                      color: "#CBCBCB",
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    {t("your_address")}
                  </Text>
                  <Text
                    style={{ marginTop: 2, fontSize: 12, fontWeight: "700" }}
                  >
                    100 University Lane
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View
              style={{
                alignItems: "center",
                marginTop: 25,
                flex: 1,
                flexDirection: "row",
                backgroundColor: "#F7F7F7",
                height: 50,
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={{ flex: 1, alignItems: "center" }}
                onPress={onPressViewStore}
              >
                <Text
                  style={{
                    color: "#F47920",
                    fontStyle: "normal",
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  {t("view_store")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, alignItems: "center" }}
                onPress={onPressPlayStore}
              >
                <Text
                  style={{
                    color: "#F47920",
                    fontStyle: "normal",
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  {t("open_in_google_maps")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "center" }}
            onPress={() => {
              setModelUserProfile(false);
            }}
          >
            <Image style={styles.floatingCloase} source={Icons.ic_close} />
          </TouchableOpacity>
          <Image style={styles.subHeaderImage} source={{ uri: item.url }} />
        </View>
      </View>
    </Modal>
  );
};
export default MapInfoWindow;
const styles = StyleSheet.create({
  subHeaderImage: {
    position: "absolute",
    height: imgSize,
    width: imgSize,
    top: -(imgSize / 2),
    left: popupWidth / 2 - imgSize / 2,
  },
  floatingCloase: {
    position: "absolute",
    height: imgSizeClose,
    width: imgSizeClose,
    top: imgSizeClose,
    left: popupWidth - imgSizeClose * 2,
    tintColor: "#F47920",
  },

  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: "hidden",

    elevation: 5,
    width: popupWidth,
  },
});
