import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PrimaryButton } from "../../components/PrimaryButton";
import Localization from "../../Localization/Localization";
import colors from "../../theme/colors";
import Fonts from "../../theme/Fonts";
import Icons from "../../theme/Icons";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");

const Slide = ({ item }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <Image
        source={Icons.ic_app_logo_small}
        style={{
          marginTop: 30,
          marginBottom: 40,
          width,
          resizeMode: "contain",
        }}
      />
      <Image
        source={item?.image}
        style={{
          height: "44%",
          width,
          resizeMode: "contain",
        }}
      />
      <Text style={styles.title}>{item?.title}</Text>
      <Text style={styles.subtitle}>{item?.subtitle}</Text>
    </View>
  );
};

const OnboardingScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const slides = [
    {
      id: "1",
      image: Icons.ic_onboarding1,
      title: t("onboarding1_title"),
      subtitle: t("onboarding1_subtitle"),
    },
    {
      id: "2",
      image: Icons.ic_onboarding3,
      title: t("onboarding2_title"),
      subtitle: t("onboarding2_subtitle"),
    },
    {
      id: "3",
      image: Icons.ic_onboarding2,
      title: t("onboarding3_title"),
      subtitle: t("onboarding3_subtitle"),
    },
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref = React.useRef();
  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({ offset });
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
    console.log("index", currentSlideIndex);
  };

  const Footer = () => {
    return (
      <View
        style={{
          // height: height * 0.10,
          paddingHorizontal: 20,
        }}
      >
        {/* Indicator container */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingVertical: 10,
          }}
        >
          {/* Render indicator */}
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex == index && {
                  backgroundColor: "rgba(244, 121, 32, 1)",
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                },
              ]}
            />
          ))}
        </View>

        {/* Render buttons */}
        <View style={{ marginBottom: 20 }}>
          {currentSlideIndex == slides.length - 1 ? (
            <PrimaryButton
              onPress={() => {
                navigation.replace("LaunchScreen");
              }}
              title={t("next")}
            ></PrimaryButton>
          ) : (
            <PrimaryButton
              onPress={goToNextSlide}
              title={t("next")}
            ></PrimaryButton>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <FlatList
        style={{ flex: 1 }}
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        // contentContainerStyle={{height: height * 0.75}}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({ item }) => <Slide item={item} />}
      />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: colors.black,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "400",
    fontFamily: Fonts.HELVETICANEUE,
    marginTop: 20,
    lineHeight: 26,
  },
  title: {
    color: "rgba(244, 121, 32, 1)",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "700",
    fontFamily: Fonts.Helvetica,
    marginTop: 20,
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
  indicator: {
    width: 10,
    height: 10,
    backgroundColor: "grey",
    marginHorizontal: 3,
    borderRadius: 5,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: "rgba(244, 121, 32, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default OnboardingScreen;
