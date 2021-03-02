// const logger = require('./log');
const BaseSocketClient = require('./baseSocketClient');
const ExSetupCmd1 = require('./parser/exSetupCommands');
const ExGetInstrumentCount = require('./parser/exGetInstrumentCount');
const ExGetMarkets = require('./parser/exGetMarkets');
const ExGetInstrumentInfo = require('./parser/exGetInstrumentInfo');
const ExGetInstrumentQuote = require('./parser/exGetInstrumentQuote');
const ExGetInstrumentQuoteList = require('./parser/exGetInstrumentQuoteList');
const ExGetInstrumentBars = require('./parser/exGetInstrumentBars');
const ExGetMinuteTimeData = require('./parser/exGetMinuteTimeData');
const ExGetTransactionData = require('./parser/exGetTransactionData');
const ExGetHistoryMinuteTimeData = require('./parser/exGetHistoryMinuteTimeData');
const ExGetHistoryTransactionData = require('./parser/exGetHistoryTransactionData');
const ExGetHistoryInstrumentBarsRange = require('./parser/exGetHistoryInstrumentBarsRange');

const { exMarketHosts } = require('./config/hosts');
class TdxExMarketApi extends BaseSocketClient {

  doPing() {
    return this.getGateways(exMarketHosts);
  }

  doHeartbeat() {
    return this.getInstrumentCount();
  }

  async setup() {
    await new ExSetupCmd1(this.client).callApi();
  }

  // api list

  async getMarkets() {
    const cmd = new ExGetMarkets(this.client);
    return await cmd.callApi();
  }

  async getInstrumentCount() {
    const cmd = new ExGetInstrumentCount(this.client);
    return await cmd.callApi();
  }

  async getInstrumentQuote(market, code) {
    const cmd = new ExGetInstrumentQuote(this.client);
    cmd.setParams(market, code);
    return await cmd.callApi();
  }

  async getInstrumentBars(category, market, code, start = 0, count = 700) {
    const cmd = new ExGetInstrumentBars(this.client);
    cmd.setParams(category, market, code, start, count);
    return await cmd.callApi();
  }

  async getMinuteTimeData(market, code) {
    const cmd = new ExGetMinuteTimeData(this.client);
    cmd.setParams(market, code)
    return await cmd.callApi();
  }


  async getHistoryMinuteTimeData(market, code, date) {
    const cmd = new ExGetHistoryMinuteTimeData(this.client);
    cmd.setParams(market, code, date);
    return await cmd.callApi();
  }


  async getTransactionData(market, code, start = 0, count = 1800) {
    const cmd = new ExGetTransactionData(this.client);
    cmd.setParams(market, code, start, count);
    return await cmd.callApi();
  }


  async getHistoryTransactionData(market, code, date, start = 0, count = 1800) {
    const cmd = new ExGetHistoryTransactionData(this.client);
    cmd.setParams(market, code, date, start, count);
    return await cmd.callApi();
  }


  async getHistoryInstrumentBarsRange(market, code, start, end) {
    const cmd = new ExGetHistoryInstrumentBarsRange(this.client);
    cmd.setParams(market, code, start, end);
    return await cmd.callApi();
  }


  async getInstrumentInfo(start, count = 100) {
    const cmd = new ExGetInstrumentInfo(this.client);
    cmd.setParams(start, count);
    return await cmd.callApi();
  }


  async getInstrumentQuoteList(market, category, start = 0, count = 80) {
    const cmd = new ExGetInstrumentQuoteList(this.client);
    cmd.setParams(market, category, start, count);
    return await cmd.callApi();
  }

}

Object.getOwnPropertyNames(TdxExMarketApi.prototype).forEach(name => {
  const property = TdxExMarketApi.prototype[name];
  if (typeof property === 'function' && /^get/.test(name)) {
    TdxExMarketApi.prototype[name] = new Proxy(
      TdxExMarketApi.prototype[name],
      {
        apply (target, thisArg, argumentsList) {
          return new Promise((resolve) => {
            thisArg.reqQueue.push([resolve, target, thisArg, argumentsList]);
            thisArg.checkQueue();
          });
        }
      }
    )
  }
});

module.exports = TdxExMarketApi;
