import AsyncStorage from "@react-native-async-storage/async-storage";
import { exp } from "react-native-reanimated";
import { navigate } from "../navigation/NavigationService";
import { userDataKey } from "./Constant";

export const handleNavigation = async (data) => {
  try {
    console.log("data : ", data);
    console.log("data : ", data.redirect_to_screen);
    const isLogin = await AsyncStorage.getItem(userDataKey.IS_LOGGED_IN);
    const role = await AsyncStorage.getItem(userDataKey.Role);
    await AsyncStorage.removeItem("notification");
    console.log("role", role);
    console.log("isLogin", isLogin);

    if (isLogin) {
      if (data.type == 2) {
        await AsyncStorage.removeItem("notification");
        navigate("HomeStackNavigator", {
          screen: "ContactUsScreen",
        });
      }

      if (data.type == 3) {
        await AsyncStorage.removeItem("notification");
        navigate("HomeStackNavigator", {
          screen: "ViewItems",
        });
      } else if (data.type == 4) {
        await AsyncStorage.removeItem("notification");

        navigate("DrawerNavigator", {
          screen: "EditListingScreen",
          params: { listingId: data?.listing_id, role: data?.role },
        });
      }
       else if (data.type == 5) {
        await AsyncStorage.removeItem("notification");
        navigate("MessagesStackNavigator", {
          screen: "ChatDetailsScreen",
          params: { 
            receiver: data,  
            mSenderId: await AsyncStorage.getItem(userDataKey.ID),
          },
        });
      }

      else if (data.type == 8) {
        await AsyncStorage.removeItem("notification");
        navigate("MessagesStackNavigator", {
          screen: "ChatDetailsScreen",
          params: { 
            receiver: data,  
            mSenderId: await AsyncStorage.getItem(userDataKey.ID),
          },
        });
      }
      
      else if (data.type == 6) {
        await AsyncStorage.removeItem("notification");
        //Subscription Screen
        navigate("HomeStackNavigator", {
          screen: "Subscription",
        });
      }
    }
  } catch (e) {
    alert(e);
  }
};
export const validateEmail = (email) => {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const saveLoginData = async (response, role, from) => {
  if (from == "login") {
    global.isLoggedIn = true;
    AsyncStorage.setItem(userDataKey.IS_LOGGED_IN, "true");
    AsyncStorage.setItem(userDataKey.LOGIN_DATA, JSON.stringify(response));
    AsyncStorage.setItem(userDataKey.AccessToken, response.accessToken);
    AsyncStorage.setItem(userDataKey.ID, JSON.stringify(response.id));
  }
  AsyncStorage.setItem(userDataKey.Name, response.name);
  AsyncStorage.setItem(userDataKey.Email, response.email);
  AsyncStorage.setItem(userDataKey.Zipcode, response.zipcode);
  AsyncStorage.setItem(userDataKey.Street_Address, response.street_address);
  AsyncStorage.setItem(userDataKey.City, response.city);
  AsyncStorage.setItem(userDataKey.State, response.state);
  AsyncStorage.setItem(userDataKey.Role, response.role);

  if (role === "business_user" || role == "business_user_pro") {
    AsyncStorage.setItem(
      userDataKey.Default_Name_Profile,
      JSON.stringify(response.default_name_profile)
    );
    AsyncStorage.setItem(userDataKey.Store_Logo_Path, response.store_logo_path);
    AsyncStorage.setItem(userDataKey.Store_Category, response.store_category);
    if (response.website_url) {
      AsyncStorage.setItem(userDataKey.Website_Url, response.website_url);
    }
    if (response.business_name != null) {
      AsyncStorage.setItem(userDataKey.BusinessName, response.business_name);
    }
    if (response.hasOwnProperty("store_description")) {
      AsyncStorage.setItem(
        userDataKey.Store_Description,
        response.store_description
      );
    }
  }

  if (role === "standard_user") {
    if (response.hasOwnProperty("photo")) {
      AsyncStorage.setItem(userDataKey.Photo, response.photo);
    }
  }
};

export const clearLoginData = async () => {
  AsyncStorage.removeItem(userDataKey.IS_LOGGED_IN);
  AsyncStorage.removeItem(userDataKey.LOGIN_DATA);
  AsyncStorage.removeItem(userDataKey.AccessToken);
  AsyncStorage.removeItem(userDataKey.ID);
  AsyncStorage.removeItem(userDataKey.Name);
  AsyncStorage.removeItem(userDataKey.Email);
  AsyncStorage.removeItem(userDataKey.Zipcode);
  AsyncStorage.removeItem(userDataKey.Street_Address);
  AsyncStorage.removeItem(userDataKey.City);
  AsyncStorage.removeItem(userDataKey.State);
  AsyncStorage.removeItem(userDataKey.Role);
  AsyncStorage.removeItem(userDataKey.Default_Name_Profile);
  AsyncStorage.removeItem(userDataKey.Store_Logo_Path);
  AsyncStorage.removeItem(userDataKey.Store_Category);
  AsyncStorage.removeItem(userDataKey.Website_Url);
  AsyncStorage.removeItem(userDataKey.BusinessName);
  AsyncStorage.removeItem(userDataKey.Store_Description);
  AsyncStorage.removeItem(userDataKey.Photo);
};

export const formatMobileNumber = (text) => {
  var cleaned = ("" + text).replace(/\D/g, "");
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = match[1] ? "+1 " : "",
      number = [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join(
        ""
      );
    return number;
  }
  return text;
};

var appNotificationData;
export const setAppNotificationData = (data) => {
  appNotificationData = data;
};

export const getAppNotificationData = () => {
  return appNotificationData;
};
export const returnDecimal = (value) => {
  try {
    return Number(value).toFixed(2);
  } catch (error) {}
};

export const returnUrl = (url) => {
  try {
    var fields = url.split("api/");

    return fields[1];
  } catch (error) {}
};

export const returnRole = async () => {
  var role = await AsyncStorage.getItem(userDataKey.Role);
  console.log("Aaaaaaaaaa", role);
  return role;
};

export const returnFirstCapitalChar = (string) => {
  try {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } catch (error) {}
};

export const returnCurrencySymbol = (currency_name) => {
  var currency_symbols = {
    USD: "$", // US Dollar
    EUR: "€", // Euro
    CRC: "₡", // Costa Rican Colón
    GBP: "£", // British Pound Sterling
    ILS: "₪", // Israeli New Sheqel
    INR: "₹", // Indian Rupee
    JPY: "¥", // Japanese Yen
    KRW: "₩", // South Korean Won
    NGN: "₦", // Nigerian Naira
    PHP: "₱", // Philippine Peso
    PLN: "zł", // Polish Zloty
    PYG: "₲", // Paraguayan Guarani
    THB: "฿", // Thai Baht
    UAH: "₴", // Ukrainian Hryvnia
    VND: "₫", // Vietnamese Dong
    LKR: "ரூ", // ShreeLanka
  };

  try {
    if (currency_symbols[currency_name] !== undefined) {
      return currency_symbols[currency_name];
    }
  } catch (error) {}
};
export const validatePasswrod = (password) => {
  var re = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z]).*$/;

  return re.test(password);
};

export const colourNameToHex = (colour) => {
  var colours = {
    "#f0f8ff": "aliceblue",
    "#faebd7": "antiquewhite",
    "#00ffff": "aqua",
    "#7fffd4": "aquamarine",
    "#f0ffff": "azure",
    "#f5f5dc": "beige",
    "#ffe4c4": "bisque",
    "#000000": "black",
    "#ffebcd": "blanchedalmond",
    "#0000ff": "blue",
    "#8a2be2": "blueviolet",
    "#a52a2a": "brown",
    "#deb887": "burlywood",
    "#5f9ea0": "cadetblue",
    "#7fff00": "chartreuse",
    "#d2691e": "chocolate",
    "#ff7f50": "coral",
    "#6495ed": "cornflowerblue",
    "#fff8dc": "cornsilk",
    "#dc143c": "crimson",
    "#00ffff": "cyan",
    "#00008b": "darkblue",
    "#008b8b": "darkcyan",
    "#b8860b": "darkgoldenrod",
    "#a9a9a9": "darkgray",
    "#006400": "darkgreen",
    "#bdb76b": "darkkhaki",
    "#8b008b": "darkmagenta",
    "#556b2f": "darkolivegreen",
    "#ff8c00": "darkorange",
    "#9932cc": "darkorchid",
    "#8b0000": "darkred",
    "#e9967a": "darksalmon",
    "#8fbc8f": "darkseagreen",
    "#483d8b": "darkslateblue",
    "#2f4f4f": "darkslategray",
    "#00ced1": "darkturquoise",
    "#9400d3": "darkviolet",
    "#ff1493": "deeppink",
    "#00bfff": "deepskyblue",
    "#696969": "dimgray",
    "#1e90ff": "dodgerblue",
    "#b22222": "firebrick",
    "#fffaf0": "floralwhite",
    "#228b22": "forestgreen",
    "#ff00ff": "fuchsia",
    "#dcdcdc": "gainsboro",
    "#f8f8ff": "ghostwhite",
    "#ffd700": "gold",
    "#daa520": "goldenrod",
    "#808080": "gray",
    "#008000": "green",
    "#adff2f": "greenyellow",
    "#f0fff0": "honeydew",
    "#ff69b4": "hotpink",
    "#cd5c5c": "indianred ",
    "#4b0082": "indigo",
    "#fffff0": "ivory",
    "#f0e68c": "khaki",
    "#e6e6fa": "lavender",
    "#fff0f5": "lavenderblush",
    "#7cfc00": "lawngreen",
    "#fffacd": "lemonchiffon",
    "#add8e6": "lightblue",
    "#f08080": "lightcoral",
    "#e0ffff": "lightcyan",
    "#fafad2": "lightgoldenrodyellow",
    "#d3d3d3": "lightgrey",
    "#90ee90": "lightgreen",
    "#ffb6c1": "lightpink",
    "#ffa07a": "lightsalmon",
    "#20b2aa": "lightseagreen",
    "#87cefa": "lightskyblue",
    "#778899": "lightslategray",
    "#b0c4de": "lightsteelblue",
    "#ffffe0": "lightyellow",
    "#00ff00": "lime",
    "#32cd32": "limegreen",
    "#faf0e6": "linen",
    "#ff00ff": "magenta",
    "#800000": "maroon",
    "#66cdaa": "mediumaquamarine",
    "#0000cd": "mediumblue",
    "#ba55d3": "mediumorchid",
    "#9370d8": "mediumpurple",
    "#3cb371": "mediumseagreen",
    "#7b68ee": "mediumslateblue",
    "#00fa9a": "mediumspringgreen",
    "#48d1cc": "mediumturquoise",
    "#c71585": "mediumvioletred",
    "#191970": "midnightblue",
    "#f5fffa": "mintcream",
    "#ffe4e1": "mistyrose",
    "#ffe4b5": "moccasin",
    "#ffdead": "navajowhite",
    "#000080": "navy",
    "#fdf5e6": "oldlace",
    "#808000": "olive",
    "#6b8e23": "olivedrab",
    "#ffa500": "orange",
    "#ff4500": "orangered",
    "#da70d6": "orchid",
    "#eee8aa": "palegoldenrod",
    "#98fb98": "palegreen",
    "#afeeee": "paleturquoise",
    "#d87093": "palevioletred",
    "#ffefd5": "papayawhip",
    "#ffdab9": "peachpuff",
    "#cd853f": "peru",
    "#ffc0cb": "pink",
    "#dda0dd": "plum",
    "#b0e0e6": "powderblue",
    "#800080": "purple",
    "#663399": "rebeccapurple",
    "#ff0000": "red",
    "#bc8f8f": "rosybrown",
    "#4169e1": "royalblue",
    "#8b4513": "saddlebrown",
    "#fa8072": "salmon",
    "#f4a460": "sandybrown",
    "#2e8b57": "seagreen",
    "#fff5ee": "seashell",
    "#a0522d": "sienna",
    "#c0c0c0": "silver",
    "#87ceeb": "skyblue",
    "#6a5acd": "slateblue",
    "#708090": "slategray",
    "#fffafa": "snow",
    "#00ff7f": "springgreen",
    "#4682b4": "steelblue",
    "#d2b48c": "tan",
    "#008080": "teal",
    "#d8bfd8": "thistle",
    "#ff6347": "tomato",
    "#40e0d0": "turquoise",
    "#ee82ee": "violet",
    "#f5deb3": "wheat",
    "#ffffff": "white",
    "#f5f5f5": "whitesmoke",
    "#ffff00": "yellow",
    "#9acd32": "yellowgreen",
    "#e61919": "Scarlet",
  };
  if (typeof colours[colour.toLowerCase()] != "undefined")
    return colours[colour.toLowerCase()];

  return colour;
};


export const imageSize =(index)=>{
    try{
  if(index %2 ==0){
    var a = index/2
    return a%2==0 ? 280 :200
    
  } else {
    var a = parseInt(index/2)
    return a%2==0 ? 200 :280
  }
}catch(error){

}


}

export const containerSize =(index)=>{
  try{
  if(index %2 ==0){
    var a = index/2
    return a%2==0 ? 380 :300
    
  } else {
    var a = parseInt(index/2)
    return a%2==0 ? 300 :380
  }}catch(error){

  }


}


export const containerMargin =(index)=>{
  try{
  if(index ==0 || index ==1 ){
    return 0
  }
  
  if(index %2 ==0){
    var a = index/2
    return a%2==0 ? 10 : 12
    
  } else {
    var a = parseInt(index/2)
    return a%2==0 ? 10 :-40
  }
}catch(error){

}


}