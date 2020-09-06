/*API calls to iexcloud.io */
const axios = require("axios");
const { IEX_KEY, TIINGO_KEY } = require("../Apikey");

const IEX_URL = "https://cloud.iexapis.com/stable";
const TIINGO_URL = "https://api.tiingo.com/tiingo";

class IexCloudApi {
  static async search(term) {
    const result = await axios.get(`${TIINGO_URL}/utilities/search/${term}`, {
      params: {token: TIINGO_KEY}
    });
    return result.data;
  }
}

module.exports = IexCloudApi;
