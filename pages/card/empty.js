
const util = require('../../utils/util.js')
var WXBizDataCrypt = require('../../utils/RdWXBizDataCrypt.js');
var AppId = 'wx6136481aa72e3ce3'

const app = getApp()
Page({
  data: {
    needAuth: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cardId: 0,
    width: app.globalData.width,
    height: app.globalData.height,
    ratio: app.globalData.ratio,
    userInfo: app.globalData.userInfo,
    webviewUrl: '',
  },
  onLoad: function (options) {
  
  },

  onShow :function() {
    wx.navigateTo({
      url: 'index',
    })
  },

  onShareAppMessage() {
    return {
      title: '分享标题',
      path: '/pages/index/index' // 分享出去后打开的页面地址
    }
  }
})