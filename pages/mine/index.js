
const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    userInfo: app.globalData.userInfo,
  },
  onLoad: function (options) {
    this.setData({ userInfo: app.globalData.userInfo})
  },

  onShow: function () {
    this.setData({ userInfo: app.globalData.userInfo })
  },
  feedBack: function() {
    console.log("test")
    wx.navigateToMiniProgram({
      appId: 'wx8abaf00ee8c3202e',  /* 目标为吐个槽社区小程序AppID(固定) */
      extraData: {
        id: '28604',  /* 来源为吐个槽上申请的产品ID ，查看路径：tucao.qq.com ->产品管理->ID */
      }
    })
  },
})