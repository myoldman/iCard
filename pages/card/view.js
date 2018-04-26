// pages/card/view.js
var MdParse = require('../../utils/mdParser.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardId : 0,
    currentBgCss: 'main1',
    bgImgWidth: 0,
    bgImgHeight: 0,
    bgImgUrl: '',
    bgImages: app.globalData.bgImages,
    currentBgImage: app.globalData.bgImages[0],
    width: app.globalData.width,
    height: app.globalData.height,
    ratio: app.globalData.ratio,
    showGenBar: false,
    showHomeBar: false,
    showViewBar: true,
    content:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cardId = options.cardId ? options.cardId : 0;
    var that = this
    if (cardId != 0) {
      this.setData({ cardId: cardId})
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
            MdParse.mdParse('card', res.data.card.content, that, '#FFFFFF', '', '');
            if (res.data.card.userid != app.globalData.userInfo.id){
              that.setData({ showHomeBar: true, showViewBar: false, showGenBar: false })
            }
          }
         
        },
        fail: function (res) {
          wx.hideLoading();
        },
        complete: function (res) {
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
            MdParse.mdParse('card', res.data.card.content, that, '#FFFFFF', '', '');
            if (res.data.card.userid != app.globalData.userInfo.id) {
              that.setData({ showHomeBar: true, showViewBar:false, showGenBar:false })
            }
          }
        },
        fail: function (res) {
          wx.hideLoading();
        },
        complete: function (res) {
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: app.globalData.userInfo.nickName+"分享了一张卡片",
    }
  },

  editCard:function() {
    wx.navigateTo({
      url: 'create?cardId=' + this.data.cardId
    })
  },
  previewCard:function() {
    this.setData({ showHomeBar: false, showViewBar: false, showGenBar: true })
  },
  genCard:function() {
    wx.navigateTo({
      url: 'preview?content=' + this.data.content,
    })
  },

  backHome:function() {
    wx.redirectTo({
      url: 'list',
    })
  },

  changeBackground: function (e) {
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