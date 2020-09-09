/*API calls to iexcloud.io */
const axios = require("axios");
const { IEX_KEY, TIINGO_KEY } = require("../Apikey");

const IEX_URL = "https://cloud.iexapis.com/stable";
const TIINGO_URL = "https://api.tiingo.com/tiingo";

class IexCloudApi {
  static async search(term) {
    const result = await axios.get(`${TIINGO_URL}/utilities/search`, {
      params: {token: TIINGO_KEY, limit: 5, query: term}
    });
    return result.data;
  }

  static async getStockDescription(ticker) {
    const res = await axios.get(`${TIINGO_URL}/daily/${ticker}`, {
      params: {token: TIINGO_KEY}
    });
    return res.data;
  }

  static async getStockNews(ticker) {
    const res = await axios.get(`${IEX_URL}/stock/${ticker}/news/last/3`, {
      params: {token: IEX_KEY}
    });
    return res.data;
  }
  
  static async stockDetails(ticker) {
    let requests = [];
    requests.push(this.getStockDescription(ticker));
    requests.push(this.getStockNews(ticker));
    const stock = await Promise.all(requests);
    return {
      ticker: stock[0].ticker,
      name: stock[0].name,
      description: stock[0].description,
      articles: stock[1]
    };
  }

  static async stockQuote(ticker, range) {
    const res = await axios.get(`${IEX_URL}/stock/${ticker}/batch`, {
      params: {
        token: IEX_KEY,
        types: "chart",
        range: range,
        filter: "minute,label,open"
      }
    });
    return res.data;
  }
}

module.exports = IexCloudApi;
