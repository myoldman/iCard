
const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    cardId: 0,
    width: app.globalData.width,
    height: app.globalData.height,
    ratio: app.globalData.ratio,
    userInfo: app.globalData.userInfo,
    webviewUrl: '',
  },
  onLoad: function (options) {
    var cardId = options.cardId ? options.cardId : 0;
    this.setData({ cardId: cardId })
    if (this.data.userInfo == null)
      this.setData({ userInfo: app.globalData.userInfo })
  },

  onShow: function () {
    if (this.data.userInfo == null)
      this.setData({ userInfo: app.globalData.userInfo })
    var cardId = this.data.cardId
    this.setData({ webviewUrl: app.globalData.urlbase + "userInfo/markdownEdit?height=" + this.data.height + "&width=" + this.data.width + "&ratio=" + this.data.ratio + "&cardId=" + this.data.cardId + "&userId=" + this.data.userInfo.id })
  },

  recvMessage: function(e) {
    if (e.detail.data[0].msg == 'backList') {
      var pages = getCurrentPages()
      var firstPage = pages[0]
      firstPage.setData({ searchText: '' });
    }
  },
})