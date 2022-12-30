import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userDataKey } from "../Utils/Constant";
class NetworkUtils {
  constructor(options) {
    this.baseUrl = options.baseUrl;
  }

  getImageUrl() {
    return this.baseUrl.replace("api/", "") + "uploads/images/full/";
  }

  getProfileImageUrl() {
    return this.baseUrl.replace("api/", "") + "uploads/user_profile/";
  }

  get(endpoint) {
    console.log(this.baseUrl + "" + endpoint);
    return this.requestHttp("GET", this.baseUrl + endpoint, null);
  }

  post(endpoint, params) {
    console.log(this.baseUrl + "" + endpoint + " " + params);
    return this.requestHttp("POST", this.baseUrl + endpoint, params);
  }

  put(endpoint, params,) {
    return this.requestHttp("PUT", this.baseUrl + endpoint, params);
  }

  delete(endpoint, params) {
    return this.requestHttp("DELETE", this.baseUrl + endpoint, params);
  }

  async requestHttp(method, url, params) {
    var new_token = await AsyncStorage.getItem(userDataKey.AccessToken);

    return new Promise((resolve, reject) => {
      var options = {
        method,
        url,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      };
      if (params) {
        options.data = params;
      }
      if (new_token) {
        options.headers["Authorization"] = "Bearer " + new_token;
      }

      axios(options)
        .then((response) => {
          resolve({ statusCode: response.status, body: response.data });
        })
        .catch((error) => {
          if (error.response != undefined) {
            console.log("Here1");
            resolve({
              statusCode: error.response.status,
              body: error.response.data,
            });
          } else {
            reject(__.t("Can not connect to server"));
          }
        });
    });
  }
}

export default NetworkUtils;
