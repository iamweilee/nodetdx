const bufferpack = require('bufferpack');
const BaseParser = require('./base');
const {
  // bufferToBytes,
  // bytesToBuffer,
  parsePrice
} = require('../helper');


class ExGetHistoryMinuteTimeData extends BaseParser {
  setParams(market, code, date) {
    const pkg = Buffer.from('010130000101100010000c24', 'hex');
    const pkgParam = bufferpack.pack('<IB9s', [ date, market, code ]);
    this.sendPkg = Buffer.concat([pkg, pkgParam]);
  }

  parseResponse(bodyBuf) {
    //        print('测试', bodyBuf)
    //        fileobj = open('//Users//wy//data//a.bin', 'wb')  // make partfile
    //        fileobj.write(bodyBuf)  // write data into partfile
    //        fileobj.close()
    let pos = 0;
    const [ market, code, , num ] = bufferpack.unpack('<B9s8sH', bodyBuf.slice(pos, pos + 20));
    pos += 20;
    //        print(market, code.decode(), num)
    const result = [];
    for (let i = 0; i < num; i++) {
      const [ rawTime, price, avgPrice, volume, openInterest ] = bufferpack.unpack('<HffII', bodyBuf.slice(pos, pos + 18));

      pos += 18;
      const hour = Math.floor(rawTime / 60);
      const minute = rawTime % 60;

      result.push({
        hour,
        minute,
        price: parsePrice(price),
        avgPrice: parsePrice(avgPrice),
        volume,
        openInterest
      });
    }

    return result;
  }

  setup() {}
}

module.exports = ExGetHistoryMinuteTimeData;
