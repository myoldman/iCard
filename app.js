//app.js
var WXBizDataCrypt = require('utils/RdWXBizDataCrypt.js');
var AppId = 'wxa3c3f18080c0567d'
App({
  onLaunch: function () {
  },
  globalData: {
    userInfo: null,
    width: wx.getSystemInfoSync().windowWidth,
    height: wx.getSystemInfoSync().windowHeight,
    ratio: wx.getSystemInfoSync().pixelRatio,
    urlbase: 'https://www.worklean.cn/icardweb/',
  }
  
})