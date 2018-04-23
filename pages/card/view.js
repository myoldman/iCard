// pages/card/view.js
var MdParse = require('../../utils/mdParser.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentBgCss: 'main1',
    bgImgWidth: 0,
    bgImgHeight: 0,
    bgImgUrl: '',
    bgImages: app.globalData.bgImages,
    currentBgImage: app.globalData.bgImages[0],
    width: app.globalData.width,
    height: app.globalData.height,
    ratio: app.globalData.ratio,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cardId = options.cardId ? options.cardId : 0;
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
          }
        },
        fail: function (res) {
          wx.hideLoading();
        },
        complete: function (res) {
        }
      });
    }
    //var article = '######## 张大春 谈秋夜 \r\n\r\n#张大春曾点评过鲁迅那**两株著名的枣树**：\r\n\r\n> 秋夜》篇首这一株还有一株的枣树示范了白话文运动发轫之际的一种独特要求，作者有意识的通过描述程序展现观察程序，为了使作者对世界的观察活动准确无误的复印在读者的心象之中，描述的目的便不只在告诉读者看什么，而是怎么看，**鲁迅奇怪而冗赘的句子不是为了让读者看到两株枣树，而是暗示读者以适当的速度在后园中向墙外转移目光经过一株枣树，再经过一株枣树，然后延展向一片奇怪而高的夜空。**aaaa\r\n他还曾提到过\r\n- 列表不带加粗字体不换行时\r\n- 列表不带加粗字体换行换行换行换行换行换行换行时行换行时行换行时行换行时行换行时行换行时\r\n- 列表带**加粗字体**不换行时*哈哈哈**baaaaab**哈哈哈哈a**嘿嘿嘿1**aaaab';
    //var that = this;
  
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
  
  }
})