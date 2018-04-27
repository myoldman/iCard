//logs.js

const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    cardId: 0,
    currentBgCss: 'main1',
    currentCss:  '',
    currentStyle:'',
    currentBg: 'current',
    width: app.globalData.width,
    height: app.globalData.height,
    ratio: app.globalData.ratio,
    genButtonWidth: Math.floor((app.globalData.width - 55 ) *0.55),
    saveButtonWidth: Math.floor((app.globalData.width - 55) * 0.45),
    userInfo: app.globalData.userInfo,
    content :'',
  },
  onLoad: function (options) {
    app.globalData.currentBg = 1
    var cardId = options.cardId ? options.cardId: 0;
    this.setData({ cardId: cardId })
  },

  onShow:function() {
    var cardId = this.data.cardId
    var that = this
    if (cardId != 0) {
      wx.showLoading({
        title: '卡片加载中',
      })
      wx.request({
        url: app.globalData.urlbase + 'userInfo/getUserCard',
        data: { cardId: cardId },
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.res == 0) {
            that.setData({ content: res.data.card.content })
          }
        },
        fail: function (res) {
          wx.hideLoading();
        },
        complete: function (res) {
        }
      });
    }
    this.setData(
      {
        cardId: cardId,
        currentBgCss: 'main1',
        currentCss: '',
        currentStyle: '',
        currentBg: 'current',
        width: app.globalData.width,
        height: app.globalData.height,
        ratio: app.globalData.ratio,
        userInfo: app.globalData.userInfo,
      }
    )
  },

  preivewCard: function (e) {
    var that = this
    if (!e.detail.value.content || e.detail.value.content.length < 5 || e.detail.value.content.length > 2000){
      wx.showToast({
        title: '请输入5-2000个字',
        icon:'none',
      })
      return;
    }
    if (e.detail.target.id == "genPicButton") {
      wx.navigateTo({
        url: 'preview?content=' + e.detail.value.content,
      })
      return
    }
    wx.showLoading({
      title: '卡片保存中',
    })
    var queryParam = { userid: app.globalData.userInfo.id, content: e.detail.value.content };
    var queryUrl = app.globalData.urlbase +'userInfo/saveUserCard'
    if(this.data.cardId != 0) {
      queryUrl = app.globalData.urlbase +'/userInfo/updateUserCard'
      queryParam = { cardId: this.data.cardId, content: e.detail.value.content };
    } 
    wx.request({
      url: queryUrl,
      data: queryParam,
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.res == 0) {
          // wx.showToast({
          //   title: '保存卡片成功',
          // })
          var orginalId = that.data.cardId
          if(that.data.cardId == 0)
            that.setData({cardId: res.data.id})
          
          var pages = getCurrentPages()
          console.log(pages)
          var firstPage = pages[0]
          firstPage.setData({searchText:''});
          // 返回首页
          if (orginalId <= 0) {
            wx.navigateBack({
              delta:99
            })
          } else {
            wx.navigateBack({
            })
          }
        }
      },
      fail: function (res) {
        wx.hideLoading();
      },
      complete: function (res) {
      }
    });
  },

  
})