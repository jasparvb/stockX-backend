/*API calls to iexcloud.io */
const axios = require("axios");
const APIKEY = require("../Apikey");

const BASE_URL = "https://sandbox.iexapis.com/stable"

class IexCloudApi {
  static async search(term) {
    const result = await axios.get(`${BASE_URL}/search/${term}`, {
      params: {token: APIKEY}
    });
    return result.data;
  }
}

module.exports = IexCloudApi;
