//logs.js

const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    error: '',
    imageUrl: '',
    showImage: true,
    bgColor: app.globalData.bgImages[app.globalData.currentBg - 1].color,
    bg: app.globalData.bgImages[app.globalData.currentBg - 1].bg,
    bgImg: app.globalData.bgImages[app.globalData.currentBg - 1].img,
    width: app.globalData.width,
    height: app.globalData.height,
    imgHeight: app.globalData.height - 45 - 45,
    canvasHeight: app.globalData.defaultCanvasHeight,
    ratio: app.globalData.ratio,
    userInfo: app.globalData.userInfo,
    content: '',
    autoHeight: true
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '正在生成图片',
      mask: true,
    })
    // 如果有tabbar，app.js里面取到的高度会扣除tabbar的高度，所以非tabbar页面那需要重新获取当前页面高度
    var sysInfo = wx.getSystemInfoSync()

    this.setData({
      bgColor: app.globalData.bgImages[app.globalData.currentBg - 1].color,
      bg: app.globalData.bgImages[app.globalData.currentBg - 1].bg,
      bgImg: app.globalData.bgImages[app.globalData.currentBg - 1].img,
      content: options.content,
      userInfo: app.globalData.userInfo,
      height: sysInfo.windowHeight,
      width: sysInfo.windowWidth,
      imgHeight: sysInfo.windowHeight - 45 - 45,
    })

    var that = this
    wx.request({
      url: app.globalData.urlbase + 'transPng', //仅为示例，并非真实的接口地址
      data: {
        content: this.data.content,
        bgcolor: this.data.bgColor,
        bg: this.data.bg,
        bgimg: this.data.bgImg,
        width: this.data.width,
        height: this.data.height,
        ratio: this.data.ratio,
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          imageUrl: res.data.url,
        })
      },
      complete: function (res) {
        wx.hideLoading()
      }
    })

  },
  onReady: function () {
    
  },

  onShow: function () {

  },

  previewImageLoaded: function (event) {
    console.log(event)
    var imgHeight = event.detail.height
    var imgWidth = event.detail.width
    if (imgHeight / this.data.ratio < (this.data.height - 45 - 45)) {
      this.setData({ imgHeight: imgHeight / this.data.ratio })
    }
  },
  previewCard: function () {
    var that = this
    wx.previewImage({
      current: '',
      urls: [this.data.imageUrl],
    })
  },

  editCard: function (e) {
    wx.navigateBack()
  },

  saveCard: function (e) {
    var that = this
    wx.showLoading({
      title: '正在保存图片',
      mask: true,
    })
    wx.downloadFile({
      url: that.data.imageUrl,
      success: function (res) {
        if (res.statusCode === 200) {
          wx.hideLoading()
          var filePath = res.tempFilePath
          console.log(res.tempFilePath)
          wx.saveImageToPhotosAlbum({
            filePath: filePath,
            success:
            function (data) {
              wx.showToast({
                title: '保存图片成功',
              })
            },
            fail:
            function (err) {
              wx.showToast({
                title: '保存卡片失败:' + err,
              })
              console.log(err);
            }
          })
        }
      },
      complete: function (res) {
        wx.hideLoading()
      }
    })
  },
})