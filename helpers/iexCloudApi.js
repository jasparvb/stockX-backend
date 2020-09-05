/*API calls to iexcloud.io */
import APIKEY from './Apikey'

const BASE_URL = "https://sandbox.iexapis.com/stable"

class IexCloudApi {
  static async search(term) {
    const result = await axios.get(`${BASE_URL}/search/${term}`, {token: APIKEY});
    console.log(result);
    return result;
  }
}

module.exports = IexCloudApi;
