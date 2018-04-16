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
    bgImageUrl: '',
    width: app.globalData.width,
    height: app.globalData.height,
    ratio: app.globalData.ratio,
    genButtonWidth: Math.floor((app.globalData.width - 55 ) *0.55),
    saveButtonWidth: Math.floor((app.globalData.width - 55) * 0.45),
    bgImgWidth:0,
    bgImageHeight:0,
    bgImgUrl: '',
    bgImages: app.globalData.bgImages,
    currentBgImage: app.globalData.bgImages[0],
    userInfo: app.globalData.userInfo,
    showGenBar: false,
    content :'',
  },
  onLoad: function (options) {
    app.globalData.currentBg = 1
    var cardId = options.cardId ? options.cardId: 0;
    var that = this
    if(cardId != 0) {
      wx.showLoading({
        title: '卡片加载中',
      })
      wx.request({
        url: 'https://www.worklean.cn/icardtest/userInfo/getUserCard',
        data: {cardId: cardId},
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
        bgImageUrl: '',
        width: app.globalData.width,
        height: app.globalData.height,
        ratio: app.globalData.ratio,
        bgImgWidth: 0,
        bgImageHeight: 0,
        bgImgUrl: '',
        userInfo: app.globalData.userInfo,
        showGenBar: false,
      }
    )
  },

  onShow:function() {
  },
  
  hideGenBar:function() {
    if(this.data.showGenBar) {
      this.setData({ showGenBar: false});
    }
  },

  preivewCard: function (e) {
    var that = this
    if (!e.detail.value.content || e.detail.value.content.length < 5 || e.detail.value.content.length > 1000){
      wx.showToast({
        title: '请输入5-1000个字',
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
    var queryUrl ='https://www.worklean.cn/icardtest/userInfo/saveUserCard'
    if(this.data.cardId != 0) {
      queryUrl = 'https://www.worklean.cn/icardtest/userInfo/updateUserCard'
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
          wx.showToast({
            title: '保存卡片成功',
          })
          if(that.data.cardId == 0)
            that.setData({cardId: res.data.id})
          if (e.detail.target.id == "genButton") {
            that.setData({ showGenBar: true});
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

  changeBackground:function(e) {
    var index = e.currentTarget.dataset.index
    app.globalData.currentBg = index + 1
    var bgImgUrl = ''
    if (app.globalData.bgImages[index].img && app.globalData.bgImages[index].img.length > 0) {
      bgImgUrl = "../image/" + app.globalData.bgImages[index].img
    }
    this.setData({
      currentBgCss: 'main' + app.globalData.currentBg,
      currentBgImage: app.globalData.bgImages[index],
      bgImgWidth: app.globalData.bgImages[index].width,
      bgImgHeight: app.globalData.bgImages[index].height,
      bgImgUrl: bgImgUrl,
    });
  },
})