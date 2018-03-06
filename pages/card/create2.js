//logs.js

const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    showView: false,
    showMain: true,
    showGen: true,
    showShare: false,
    showSave: false,
    sharePath: '',
    currentBgCss: 'main1',
    nextBgCss: 'main1',
    currentCss:  '',
    nextCss: 'next_right',
    currentStyle:'',
    nextStyle:'',
    currentBg: 'current',
    currentAnimationData:'',
    nextAnimationData: '',
    width: app.globalData.width,
    height: app.globalData.height,
    lastX: 0,
    lastY: 0,
    currentGesture: 0,
  },
  onLoad: function () {
    this.setData({
      showView: false,
      showMain: true,
      showGen: true,
      showShare: false,
      showSave: false,
      sharePath: '',
    })
  },
  onShow:function() {
    var currentAnimation = wx.createAnimation({
    })

    var nextAnimation = wx.createAnimation({
    })

    this.currentAnimation = currentAnimation
    this.nextAnimation = nextAnimation
  },
  onShareAppMessage: function () {
    console.log(this.data.sharePath)
    return {
      title: '我的卡片',
    }
  },
  beforeGen: function (e) {
    this.setData({
      showView: true,
      showMain: false,
      showGen: false,
      showShare: true,
      showSave: true,
      text: '',
    });
  },
  onSubmit: function (e) {
    wx.showLoading({
      title: '正在生成图片',
      mask: true,
    })
    var that = this
    this.setData({
      showView: true,
      showMain: false,
      showGen: false,
      showShare: true,
      showSave: true,
    });

    const ctx = wx.createCanvasContext('cardCanvas')
    const CANVAS_W = 300
    const CANVAS_H = 375
    var totalWidth = app.globalData.width
    var totalHeight = app.globalData.height
    var bgWidth = app.globalData.bgWidth
    var bgHeight = app.globalData.bgHeight

    var widthMod = parseInt(totalWidth / bgWidth) + 2
    var heightMod = parseInt(totalHeight / bgHeight) + 2
    console.log(widthMod)
    console.log(heightMod)
    for (var j = 0; j < heightMod; j++) {
      for (var i = 0; i < widthMod; i++) {
        ctx.drawImage(app.globalData.bgImages[0], bgWidth * i, bgHeight * j, 56, 28)
      }
    }
    ctx.draw(true)
    ctx.setTextAlign('center')
    ctx.setFontSize(15)
    ctx.fillText(e.detail.value.content, 50, 50)
    ctx.draw(true)
    wx.hideLoading()
  },

  saveCard: function (e) {
    var that = this
    wx.canvasToTempFilePath({
      canvasId: 'cardCanvas',
      complete: function (res) {
      },
      success: function (res) {
        var filepath = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: filepath,
        })
      }
    })


  },
  drawImage: function (content) {

  },
  handletouchmove: function (event) {
    if (this.data.currentGesture != 0) {
      return
    }
    let currentX = event.touches[0].pageX
    let currentY = event.touches[0].pageY
    let tx = currentX - this.data.lastX
    let ty = currentY - this.data.lastY
    let text = ""
    //左右方向滑动
    if (Math.abs(tx) > Math.abs(ty)) {
      if (tx < 0) {
        text = "向左滑动"
        this.data.currentGesture = 1
      }
      else if (tx > 0) {
        text = "向右滑动"
        this.data.currentGesture = 2
      }

    }
    //上下方向滑动
    else {
      if (ty < 0) {
        text = "向上滑动"
        this.data.currentGesture = 3

      }
      else if (ty > 0) {
        text = "向下滑动"
        this.data.currentGesture = 4
      }

    }

    //将当前坐标进行保存以进行下一次计算
    this.data.lastX = currentX
    this.data.lastY = currentY
    this.setData({
      text: text,
    });
  },
  leftScroll:function() {
    var leftScrollStyle = 'transition: transform 500ms linear 0ms; transform: translateX(' + this.data.width + 'px); transform-origin: 50% 50% 0px;'
    if (this.data.currentBg == 'current') {
      this.setData({
        currentBg: 'next',
        nextBgCss: 'main' + app.globalData.currentBg,
        nextCss: 'pre_left',
        currentCss: '',
        currentStyle: '',
        nextStyle: '',
      });
      setTimeout(function () {
        this.setData({
          currentStyle: leftScrollStyle,
          nextStyle: leftScrollStyle,
        });
      }.bind(this), 100);
    } else {
      this.setData({
        currentBg: 'current',
        currentBgCss: 'main' + app.globalData.currentBg,
        currentCss: 'pre_left',
        nextCss: '',
        currentStyle: '',
        nextStyle: '',
      });
      setTimeout(function () {
        this.setData({
          currentStyle: leftScrollStyle,
          nextStyle: leftScrollStyle,
        });
      }.bind(this), 100);
    }
  },
  rightScroll:function() {
    var rightScrollStyle = 'transition: transform 500ms linear 0ms; transform: translateX(-' + this.data.width + 'px); transform-origin: 50% 50% 0px;'
    if (this.data.currentBg == 'current') {
      this.setData({
        currentBg: 'next',
        nextBgCss: 'main' + app.globalData.currentBg,
        nextCss: 'next_right',
        currentCss: '',
        currentStyle: '',
        nextStyle: '',
      });
      setTimeout(function () {
        this.setData({
          currentStyle: rightScrollStyle,
          nextStyle: rightScrollStyle,
        });
      }.bind(this), 100);
    } else {
      this.setData({
        currentBg: 'current',
        currentBgCss: 'main' + app.globalData.currentBg,
        currentCss: 'next_right',
        nextCss: '',
        currentStyle: '',
        nextStyle: '',
      });
      setTimeout(function () {
        this.setData({
          currentStyle: rightScrollStyle,
          nextStyle: rightScrollStyle,
        });
      }.bind(this), 100);
    }
  },
  handletouchtart: function (event) {
    this.data.lastX = event.touches[0].pageX
    this.data.lastY = event.touches[0].pageY
  },
  handletouchend: function (event) {
    console.log(this.data.currentGesture)
    console.log(app.globalData.currentBg)
    if (this.data.currentGesture == 1) {
      if (app.globalData.currentBg >= app.globalData.maxBg) {
        console.log(app.globalData.currentBg)
        app.globalData.currentBg = 1
        this.rightScroll();
      } else {
        app.globalData.currentBg++
        this.rightScroll();
      }
    } else if (this.data.currentGesture == 2) {
      if (app.globalData.currentBg <= 1) {
        app.globalData.currentBg = app.globalData.maxBg
        this.leftScroll();
      } else {
        app.globalData.currentBg-- 
        this.leftScroll();
      }
    }
    this.data.currentGesture = 0
    this.setData({
      text: "没有滑动",
    });
  },
})