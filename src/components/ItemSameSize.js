import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, View } from "react-native";
import FastImage from 'react-native-fast-image';
import colors from "../theme/colors";
import Icons from "../theme/Icons";
import CustomText from "./CustomText";
import { horizontalScale, moderateScale, verticalScale } from "./scalling";




const ItemSameSize = (props) => {
    const { t } = useTranslation();

    const {
        item,
        onPressItem,
        onPresswishItem,
        numOfColumns = 2,
        ShowFavouriteIcon = true,
        showCategoryDetails = false,
        screenType = "",
        role = "",
        index
    } = props;
    if (numOfColumns > 0) {
        if (item.empty === true) {
            return (
                <View
                    style={{
                        margin: 5,
                        flex: 1,
                    }}
                />
            );
        }
    }

    const statusView = () => {
        if (screenType == 'myListing' && item.status == 0) {
            return (
                <CustomText
                    style={{
                        marginTop: 0,
                        alignSelf: "center",
                        backgroundColor: colors.primary,
                        color: colors.white,
                        borderRadius: 3,
                        paddingVertical: 4,
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    {t("pending_approval")}

                </CustomText>
            )
        }
        else if (screenType == 'myListing' && item.status == 2) {
            return (
                <CustomText
                    style={{
                        marginTop: 0,
                        alignSelf: "center",
                        backgroundColor: colors.red,
                        color: colors.white,
                        borderRadius: 3,
                        paddingVertical: 4,
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    {t("rejected")}

                </CustomText>
            )
        }

        else if (screenType == 'myListing' && item.status == 4) {
            return (
                <CustomText
                    style={{
                        marginTop: 0,
                        alignSelf: "center",
                        backgroundColor: '#008000',
                        color: colors.white,
                        borderRadius: 3,
                        paddingVertical: 4,
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    {t("sold")}
                </CustomText>
            )
        }
        else if (screenType == 'myListing' && role == "business_user") {
            if (item.status == 5) {
                return (<CustomText
                    style={{
                        marginTop: 0,
                        alignSelf: "center",
                        backgroundColor: colors.red,
                        color: colors.white,
                        borderRadius: 3,
                        paddingVertical: 4,
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    {t("expiring_in_hours")}
                </CustomText>)
            } else if (item.status == 6) {
                return (
                    <CustomText
                        style={{
                            marginTop: 0,
                            alignSelf: "center",
                            backgroundColor: colors.red,
                            color: colors.white,
                            borderRadius: 3,
                            paddingVertical: 4,
                            width: "100%",
                            textAlign: "center",
                        }}
                    >
                        {t("listing_expired")}
                    </CustomText>)

            }
        }
        else if (screenType == 'myListing' && role == "standard_user") {
            if (item.status == 5) {
                return (<CustomText
                    style={{
                        marginTop: 0,
                        alignSelf: "center",
                        backgroundColor: colors.red,
                        color: colors.white,
                        borderRadius: 3,
                        paddingVertical: 4,
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    {t("expiring_in_hours")}
                </CustomText>)
            } else if (item.status == 6) {
                return (
                    <CustomText
                        style={{
                            marginTop: 0,
                            alignSelf: "center",
                            backgroundColor: colors.red,
                            color: colors.white,
                            borderRadius: 3,
                            paddingVertical: 4,
                            width: "100%",
                            textAlign: "center",
                        }}
                    >
                        {t("listing_expired")}
                    </CustomText>)

            }
            else {
                return null
            }

        } else {
            return null

        }
    }



    return (
        <Pressable
            onPress={onPressItem}
            style={{
                backgroundColor: "white",
                borderRadius: 10,
                shadowColor: Platform.OS == "ios" ? "#00000029" : "rgba(0, 0, 0, 0.6)",
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                elevation: Platform.OS === "ios" ? 0.1 : 7,
                shadowOpacity: 1.0,
                margin: verticalScale(8),
                flex: 1,

            }}
        >
            <FastImage
                style={{
                    overflow: "hidden",
                    height: verticalScale(280),
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                }}

                // source={{ uri: item.photos[0]?.url }}
                source={{
                    uri: item.photos[0]?.url,
                    headers: { Authorization: 'token' },
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.immutable,
                }}
                resizeMode={FastImage.resizeMode.stretch}>
                {statusView()}
                {ShowFavouriteIcon && (
                    <Pressable
                        onPress={onPresswishItem}
                        source={
                            item.photos.length == 0
                                ? Icons.ic_demo
                                : { uri: item.photos[0].url }
                        }
                        resizeMode={"cover"}
                    >
                        <Image
                            style={{
                                height: verticalScale(100),
                                width: horizontalScale(100),
                                alignSelf: "flex-end",
                                marginTop: 2,
                            }}
                            source={
                                item.favorite === 0
                                    ? Icons.ic_wish_list_unfill
                                    : Icons.ic_wish_list_fill
                            }
                            resizeMode={"contain"}
                        ></Image>
                    </Pressable>
                )}
            </FastImage>

            <View
                style={{
                    paddingVertical: 10,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                }}
            >
                <View
                    style={{
                        paddingHorizontal: 10,
                        flexDirection: "row",
                        overflow: "hidden",
                    }}
                >
                    <CustomText
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={{
                            color: colors.black,
                            fontSize: moderateScale(18),
                            fontWeight: "700",
                            marginTop: 0,
                            flex: 1,
                        }}
                    >
                        {item.name}
                    </CustomText>
                    {screenType == "ViewItem" && item.is_ads == 1 ? (
                        <CustomText
                            numberOfLines={1}
                            // ellipsizeMode={"tail"}
                            style={{
                                color: colors.primary,
                                fontSize: moderateScale(12),
                                fontWeight: "700",
                                marginTop: 0,
                                textAlignVertical: "bottom",
                            }}
                        >
                            {"AD"}
                        </CustomText>
                    ) : (
                        <View></View>
                    )}

                    <CustomText
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={{
                            color: colors.primary,
                            fontSize: moderateScale(18),
                            fontWeight: "700",
                            marginTop: 0,
                            textAlign: "right",
                            flex: 1.3,
                        }}
                    >
                        {"$" + item.price}
                    </CustomText>
                </View>

                <CustomText
                    numberOfLines={1}
                    style={{
                        color: colors.grey,
                        fontSize: moderateScale(16),
                        fontWeight: "400",
                        marginTop: 0,
                        marginHorizontal: 10,
                    }}
                >
                    {showCategoryDetails ? item?.category_name : item?.description}
                </CustomText>

                <View
                    style={{
                        backgroundColor: colors.black,
                        width: 20,
                        height: 1.5,
                        marginTop: 5,
                        marginHorizontal: 10,
                    }}
                ></View>
            </View>
        </Pressable>
    );
};
export default ItemSameSize;
