//logs.js

const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    currentBgCss: 'main1',
    nextBgCss: 'main1',
    currentCss:  '',
    nextCss: 'next_right',
    currentStyle:'',
    nextStyle:'',
    currentBg: 'current',
    bgImageUrl: '',
    width: app.globalData.width,
    height: app.globalData.height,
    ratio: app.globalData.ratio,
    bgImgWidth:0,
    bgImageHeight:0,
    bgImgUrl: '',
    lastX: 0,
    lastY: 0,
    currentGesture: 0,
  },

  onLoad: function () {
    app.globalData.currentBg = 1
    this.setData(
      {
        currentBgCss: 'main1',
        nextBgCss: 'main1',
        currentCss: '',
        nextCss: 'next_right',
        currentStyle: '',
        nextStyle: '',
        currentBg: 'current',
        bgImageUrl: '',
        width: app.globalData.width,
        height: app.globalData.height,
        ratio: app.globalData.ratio,
        bgImgWidth: 0,
        bgImageHeight: 0,
        bgImgUrl: '',
        lastX: 0,
        lastY: 0,
        currentGesture: 0,
      }
    )
  },

  onShow:function() {
  },

  preivewCard: function (e) {
    wx.navigateTo({
      url: 'preview?content=' + e.detail.value.content,
    })
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
    var leftScrollStyle = 'transition: transform 200ms linear 0ms; transform: translateX(' + this.data.width + 'px); transform-origin: 50% 50% 0px;'
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
    var rightScrollStyle = 'transition: transform 200ms linear 0ms; transform: translateX(-' + this.data.width + 'px); transform-origin: 50% 50% 0px;'
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
    if (this.data.currentGesture == 1) {
      if (app.globalData.currentBg >= app.globalData.maxBg) {
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
    var bgImgUrl = ''
    if (app.globalData.bgImages[app.globalData.currentBg - 1].img && app.globalData.bgImages[app.globalData.currentBg - 1].img.length > 0) {
      bgImgUrl = "../image/" + app.globalData.bgImages[app.globalData.currentBg - 1].img
    }
    this.setData({
      bgImgWidth: app.globalData.bgImages[app.globalData.currentBg - 1].width,
      bgImgHeight: app.globalData.bgImages[app.globalData.currentBg - 1].height,
      bgImgUrl: bgImgUrl,
      text: "没有滑动",
    });
  },
})