import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import colors from "../theme/colors";
import { horizontalScale, moderateScale, verticalScale } from "./scalling";

const Loader = (props) => {
  const { loading } = props;

  return (
    <Modal
      transparent={true}
      animationType={"none"}
      visible={loading}
      onRequestClose={() => {
        console.log("close modal");
      }}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={loading}
            size="large"
            color={colors.primary}
          />
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
    height: verticalScale(180),
    width: horizontalScale(300),
    borderRadius: moderateScale(16),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default Loader;
