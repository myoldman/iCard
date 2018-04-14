//app.js
var WXBizDataCrypt = require('utils/RdWXBizDataCrypt.js');
var AppId = 'wx6136481aa72e3ce3'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this
    // 登录
    wx.login({
      success: res => {
        //发起网络请求
        wx.request({
          url: 'https://www.worklean.cn/icardtest/userInfo',
          data: {
            js_code: res.code,
          },
          method: 'POST',
          dataType: 'json',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            var pc = new WXBizDataCrypt(AppId, res.data.session_key)
            wx.getUserInfo({
              success: function (res) {
                var data = pc.decryptData(res.encryptedData, res.iv)
                delete data.watermark;
                that.globalData.userInfo = data
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (that.userInfoReadyCallback) {
                  that.userInfoReadyCallback(data)
                }
              }
            })
          },
          fail: function (res) { },
          complete: function (res) { }
        });
      }
    })
   
  },
  globalData: {
    defaultCanvasHeight:450,
    bgImages: [
      { width: 56, height: 28, data: "", color: "FFF", bg: '', img:''},
      { width: 56, height: 28, data: "", color: "F8F2E2", bg: '', img: ''},
      { width: 56, height: 28, data: "", color: '', bg: "bg3.png", img: '' },
      { width: 210, height: 240, data: "", color: 'F1EEE7', bg: "", img: 'bgimg4.png' },
    ],
    textColor: '#282A2D',
    textSize:16,
    textSpace:32,
    hMargin:20,
    
    footerText:"使用小程序\"卡片创作助手\"制作",
    footerTextColor: '#B7BABF',
    footerTextSize:13,
    footerTextSpace:38,

    footerLineColor: '#E4E5E7',
    footerLineWidth:1,
    footerLineMargin:10,

    footerHeight:60,

    currentBg: 1,
    maxBg: 4,
    userInfo: null,
    width: wx.getSystemInfoSync().windowWidth,
    height: wx.getSystemInfoSync().windowHeight,
    ratio: wx.getSystemInfoSync().pixelRatio,
  }
})