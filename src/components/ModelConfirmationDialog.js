import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import colors from "../theme/colors";
import CustomText from "./CustomText";
import { PrimaryButton } from "./PrimaryButton";
import { useTranslation } from "react-i18next";

const ModelConfirmationDialog = (props) => {
  const { t } = useTranslation();

  const {
    showModal,
    onPressDelete,
    onPressCancel,
    onRequestClose,
    title,
    onPressDeleteTitle = t("delete"),
    buttonColor = "#F42020",
  } = props;

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
            <CustomText style={styles.modalTextHeader}>{title}</CustomText>

            <View style={{ paddingHorizontal: 25 }}>
              <PrimaryButton
                buttonStyle={{ backgroundColor: buttonColor, marginTop: 25 }}
                onPress={onPressDelete}
                title={onPressDeleteTitle}
              ></PrimaryButton>

              <PrimaryButton
                textStyle={{ color: colors.primary }}
                buttonStyle={{
                  backgroundColor: colors.white,
                  borderColor: colors.primary,
                  borderWidth: 1,
                }}
                onPress={onPressCancel}
                title={t("cancel")}
              ></PrimaryButton>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default ModelConfirmationDialog;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: colors.white,
    borderRadius: 20,
    position: "absolute",
    elevation: 5,
    width: "85%",
    paddingTop: 30,
    paddingBottom: 40,
  },

  modalTextHeader: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
    marginStart: 25,
    marginEnd: 25,
    lineHeight: 24,
    marginTop: 0,
  },
});
