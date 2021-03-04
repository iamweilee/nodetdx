const { TdxMarketApi, constant, logger } = require('../index');
const { MARKET_SH, MARKET_SZ } = constant;
logger.level = 'INFO';
const api = new TdxMarketApi({ heartbeatInterval: 30000, idleTimeout: 60000 });

(async() => {
  if (await api.connect('101.133.214.242', 7709)) {
    // let num = await api.getSecurityCount('SZ');
    // logger.info('0 api.getSecurityCount', num)
    // num = await api.getSecurityCount('SH');
    // logger.info('1 api.getSecurityCount', num)
    // const list = await api.getSecurityList('SH', 0);
    // logger.info(list);
    // const quotes = await api.getSecurityQuotes(['000001.SZ', '600300.SH', '000002.SZ', '000008.SZ', '000011.SZ', '000012.SZ', '000014.SZ', '000016.SZ', '000017.SZ', '002351.SZ', '600520.SH']);  // 84, 165, 246
    // const quotes = await api.getSecurityQuotes(['600520.SH']);  // 84, 165, 246
    // const quotes = await api.getSecurityQuotes('600520.SH');  // 84, 165, 246
    // logger.info(JSON.stringify(quotes, null, 2))
    // const financeInfo = await api.getFinanceInfo('000001.SZ');
    // logger.info(financeInfo);
    // const exRightInfo = await api.getExRightInfo('000001.SZ');
    // logger.info(exRightInfo);
    // let bars = await api.getSecurityBars('D', '000001.SZ', 0, 10);
    // logger.info(bars)
    // bars = await api.getSecurityBars('D', '000001.SZ', 10, 10);
    // logger.info(bars)
    // bars = await api.getSecurityBars('D', '000001.SZ', 20, 10);
    // logger.info(bars)
    // const indexBars = await api.getIndexBars('D', '000001.SH', 0, 100);
    // logger.info(indexBars);
    // const timeData = await api.getMinuteTimeData('000001.SZ');
    // logger.info(timeData);
    // const hisTimeData = await api.getHistoryMinuteTimeData('000001.SZ', 20161209)
    // logger.info(hisTimeData)
    // const hisTransData = await api.getHistoryTransactionData('000001.SZ', 0, 10, 20170209)
    // logger.info(hisTransData)
    // const transData = await api.getTransactionData('000001.SZ', 0, 10);
    // logger.info(transData)
    // const companyCategory = await api.getCompanyInfoCategory('000001.SZ');
    // logger.info(companyCategory)
    // const companyInfo = await api.getCompanyInfoContent('000001.SZ', '000001.txt', 0, 20000);
    // logger.info(companyInfo);
    // const bars = await api.findSecurityBars('D', '000001.SZ', '2021-02-19', '2021-02-26')
    // logger.info(JSON.stringify(bars));
    // api.disconnect()
    let c = 0;

    async function getSecurityQuotes () {
      c++;
      const t = Date.now();
      const quotes = await api.getSecurityQuotes('600300.SH');
      const { price, bid1, ask1, bidVol1, askVol1, serverTime } = quotes[0]
      logger.info(JSON.stringify({
        price,
        bid1,
        ask1,
        bidVol1,
        askVol1,
        serverTime,
        'rsp - req': Date.now() - t,
        c
      }));

      if (c < 20) {
        setTimeout(() => getSecurityQuotes(), 1000);
      }
      else {
        c = 0;
        setTimeout(() => getSecurityQuotes(), 200000);
      }

      // getSecurityQuotes();
    }

    getSecurityQuotes();

    // api.getSecurityQuotes('600520.SH').then(quote => console.log(quote));
    // api.getSecurityQuotes('600300.SH').then(quote => console.log(quote));
    // api.getSecurityQuotes('000001.SZ').then(quote => console.log(quote));

    // api.findIndexBars('D', '000001.SH', '2021-02-19', '2021-02-26').then(bars => console.log(JSON.stringify(bars))); // 上证指数
    // api.findSecurityBars('D', '000001.SZ', '2021-02-19', '2021-02-26').then(bars => console.log(JSON.stringify(bars))); // 中国平安

    let st = Date.now();

    process.on('unhandledRejection', (e) => {
      logger.info('unhandledRejection diff ', Date.now() - st);
      throw e;
    });
  }
})();
