import { DrawerActions } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dimensions,
    FlatList,
    Image,
    LogBox,
    StyleSheet, View,
    Text,
    Pressable
} from "react-native";
import { AlertView } from "../../components/AlertView";
import CustomText from "../../components/CustomText";
import { Header } from "../../components/Header";
import Loader from "../../components/Loader";
import { PrimaryButton } from "../../components/PrimaryButton";
import { moderateScale, verticalScale } from "../../components/scalling";
import {
    createAddListApi,
    getCategoryApiCall
} from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Icons from "../../theme/Icons";
import ImagePicker from "react-native-image-crop-picker";
import SelectImageDialog from "../../components/SelectImageDialog";


const CreateAdsScreen = ({ navigation }) => {

    const { t } = useTranslation();
    const [isLoading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [adsList, setAdsList] = useState([]);
    const refImageDialog = useRef();
    const [dataUpdated, setDataUpdated] = React.useState(false)

    var partPhoto;

    useEffect(() => {
        getAdsList()
    }, []);

    const takePhotoFromCamera = (index) => {
        ImagePicker.openCamera({
            mediaType: "photo",
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            compressImageQuality: 0.7,
            // includeBase64: true,
            cropping: true,
            resizeMode: 1000,
        }).then((image1) => {
            console.log("paras image", image1);
            var ext = image1.path.substr(image1.path.lastIndexOf(".") + 1);
            partPhoto = {
                name: image1.modificationDate + "." + ext,
                type: image1.mime,
                uri:
                    Platform.OS === "android"
                        ? image1.path
                        : image1.path.replace("file://", ""),
            };
            adsList[index] = {
                ...adsList[index],
                title: 'ABCD'
            };
            setDataUpdated(true)

            setAdsList(adsList);
          

        });
    };

    const choosePhotoFromLibrary = (index) => {
        ImagePicker.openPicker({
            mediaType: "photo",
            width: 300,
            height: 300,
            compressImageQuality: 0.7,
            cropping: true,
        }).then((image1) => {
            console.log("paras image", image1);
            var ext = image1.path.substr(image1.path.lastIndexOf(".") + 1);
            partPhoto = {
                name: image1.modificationDate + "." + ext,
                type: image1.mime,
                uri:
                    Platform.OS === "android"
                        ? image1.path
                        : image1.path.replace("file://", ""),
            };
            adsList[index] = {
                ...adsList[index],
                image_path:partPhoto.uri,
                title:'Checking'
            };
            setDataUpdated(true)

            setAdsList(adsList);
            console.log("Part Photo===>", partPhoto);
            console.log("List item---->", adsList);
            console.log("List Index---->", index);



        });
    };

useEffect(() => {
    setDataUpdated(!dataUpdated);
  }, [adsList]);

    const getAdsList = () => {
        setLoading(true);
        createAddListApi()
            .then((res) => {
                setLoading(false);
                console.log("Categorty====>", res);
                if (res.success) {
                    setAdsList(res.data);
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


    const createAds = () => {
        setLoading(true);
        createAddListApi()
            .then((res) => {
                setLoading(false);
                console.log("Categorty====>", res);
                if (res.success) {
                    setAdsList(res.data);
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



    


    const renderItem = ({ item, index }) => {
        console.log("Check Item", item);

        return (
            <View style={{ flexDirection: 'row', padding: 20 }}>

                <SelectImageDialog
                    ref={refImageDialog}
                    onPressTakePhoto={() => {
                        console.log("onPressOk");
                        refImageDialog.current.close();
                        setTimeout(
                            function () {
                                takePhotoFromCamera(index);
                            }.bind(this),
                            1000
                        );
                    }}
                    onPressChooseFromLibrary={() => {
                        refImageDialog.current.close();
                        setTimeout(
                            function () {
                                choosePhotoFromLibrary(index);
                            }.bind(this),
                            1000
                        );
                    }}
                    onPressCancel={() => {
                        console.log("onPressClose");
                        refImageDialog.current.close();
                    }}
                ></SelectImageDialog>
                <View style={{overflow: 'hidden', flex: 1, marginRight:10}}
                >
                    <Pressable style={{ flex: 1 }} onPress={() => {
                        refImageDialog.current.open();
                    }}>
                        <Image
                            resizeMode="cover"
                            source={{
                                uri: item.image_path,
                              }}
                            style={{
                                flex: 1, borderRadius: 15,
                            }}>
                        </Image>
                    </Pressable>
                </View>
                <View style={{ backgroundColor: 'white', flex: 1, marginLeft: 10 }}>

                    <CustomText
                        mTop={0}
                        style={{
                            fontSize: moderateScale(18),
                            color: colors.primary,
                        }}
                    >
                        {item.title}
                    </CustomText>
                    <CustomText
                        mTop={0}
                        style={{
                            fontSize: moderateScale(18),
                            color: colors.primary,
                        }}
                    >
                        {item.title}
                    </CustomText>
                    <CustomText
                        mTop={5}
                        style={{
                            fontSize: moderateScale(16),
                            color: colors.grey,
                        }}
                    >
                        {item.description}
                    </CustomText>
                    <CustomText
                        mTop={5}
                        style={{
                            fontSize: moderateScale(16),
                            color: colors.grey,
                        }}
                    >
                        {"("+ item.weight_size +"*" +item.height_size +")" }
                    </CustomText>
                    <CustomText
                        mTop={5}
                        style={{
                            fontSize: moderateScale(18),
                            color: colors.primary,

                        }}
                    >
                        {'$113'}
                    </CustomText>


                    <PrimaryButton
                        buttonMarginTop={5}
                        buttonHeight={verticalScale(80)}
                        onPress={() => {

                        }}
                        title={"Buy Ads Space"}
                    ></PrimaryButton>

                </View>

            </View>
        )
    };
    return (
        <View style={styles.container}>


            <Loader loading={isLoading} />
            <AlertView
                showAlert={showAlert}
                message={alertMessage}
                onConfirmPressed={() => {
                    setShowAlert(false);
                }}
                onDismiss={() => setShowAlert(false)}
            ></AlertView>


            <FlatList
                showsVerticalScrollIndicator={false}
                style={{
                    marginHorizontal: 15,
                    marginTop: 20,
                    flex: 1,
                }}
                extraData={dataUpdated}
                data={adsList}
                renderItem={renderItem}

                keyExtractor = { (item) => item.id.toString() }
                />
        </View>
    );
};

export default CreateAdsScreen;

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
