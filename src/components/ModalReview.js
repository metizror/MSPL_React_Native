import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Modal, Pressable, StyleSheet, View } from "react-native";
import colors from "../theme/colors";
import Icons from "../theme/Icons";
import CustomText from "./CustomText";
import { PrimaryButton } from "./PrimaryButton";

const ModalReview = (props) => {
  const {
    item,
    showModal,
    setShowModal,
    onPressPositive,
    onPressNegative,
    onRequestClose,
    name,
    photo,
  } = props;
  const { t } = useTranslation();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={onRequestClose}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
           
              <Image
                source={{
                  uri: photo,
                }}
                style={styles.iconProfile}
              ></Image>
          
            <CustomText style={styles.modalTextHeader}>
              {t("how_was_your_experience") + name + "?"}
            </CustomText>

            <View style={{ paddingHorizontal: 25 }}>
              <PrimaryButton
                iSource={Icons.ic_thumb_white}
                buttonStyle={{ marginTop: 15 }}
                onPress={onPressPositive}
                title={t("positive")}
              ></PrimaryButton>

              <PrimaryButton
                textStyle={{ color: colors.primary }}
                iSource={Icons.ic_thumb_down_white}
                buttonStyle={{
                  backgroundColor: colors.white,
                  borderColor: colors.primary,
                  borderWidth: 1,
                }}
                onPress={onPressNegative}
                title={t("negative")}
              ></PrimaryButton>
            </View>
            <Pressable
              onPress={() => {
                setShowModal(false);
              }}
              style={{
                alignSelf: "flex-end",
                marginTop: 10,
                paddingRight: 15,
                position: "absolute",
              }}
            >
              <Image
                source={Icons.ic_close}
                resizeMode={"contain"}
                style={{ width: 16, height: 16, tintColor: colors.primary }}
              ></Image>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default ModalReview;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    //margin: 0,
    backgroundColor: colors.white,
    borderRadius: 20,
    position: "absolute",
    //alignItems: "center",
    //shadowColor: "#000",
    // shadowOffset: {
    //     width: 0,
    //     height: 2
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    elevation: 5,
    width: "85%",
    paddingVertical: 20,
  },
  iconProfile: {
    borderRadius: 115 / 2,
    height: 115,
    width: 115,
    borderWidth: 5,
    borderColor: colors.white,
    marginTop: -70,
    resizeMode: "cover",
    alignSelf: "center",
  },
  modalTextHeader: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
    marginStart: 25,
    marginEnd: 25,
    lineHeight: 24,
    marginBottom: 22,
  },
});
