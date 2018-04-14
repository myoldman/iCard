//logs.js

const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    cardId: 0,
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
    genButtonWidth: Math.floor((app.globalData.width - 55 ) *0.55),
    saveButtonWidth: Math.floor((app.globalData.width - 55) * 0.45),
    bgImgWidth:0,
    bgImageHeight:0,
    bgImgUrl: '',
    lastX: 0,
    lastY: 0,
    currentGesture: 0,
    userInfo: app.globalData.userInfo,
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
          //wx.hideLoading();
        }
      });
    }
    this.setData(
      {
        cardId: cardId,
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
        userInfo: app.globalData.userInfo,
      }
    )
  },

  onShow:function() {
  },

  preivewCard: function (e) {
    var that = this
    if (!e.detail.value.content || e.detail.value.content.length <= 0 || e.detail.value.content.length > 2000){
      wx.showToast({
        title: '输入内容最少20\n最多1000个字符',
        icon:'none',
      })
      return;
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
            wx.navigateTo({
              url: 'preview?content=' + e.detail.value.content,
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
        //wx.hideLoading();
      }
    });
  },

  handletouchmove: function (event) {
    console.log("move:" + this.data.currentGesture)

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
        this.setData(
        {
          currentGesture : 1,
        })
      }
      else if (tx > 0) {
        text = "向右滑动"
        this.setData(
        {
            currentGesture: 2,
        })
      }
    }
    //上下方向滑动
    else {
      if (ty < 0) {
        text = "向上滑动"
        this.setData(
        {
          currentGesture: 3,
        })
      }
      else if (ty > 0) {
        text = "向下滑动"
        this.setData(
        {
          currentGesture: 4,
        })
      }
    }

    //将当前坐标进行保存以进行下一次计算
    this.setData({
      lastX: currentX,
      lastY: currentY,
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

  handletouchcancel: function(event) {
    console.log("cancel:" + event)
  },

  handletouchtart: function (event) {
    console.log("start:" + event.touches[0].pageX)

    this.setData({
      lastX: event.touches[0].pageX,
      lastY: event.touches[0].pageY,
    });
  },

  handletouchend: function (event) {
    console.log("end:" + event)
    console.log("end:" + this.data.currentGesture)
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
    var bgImgUrl = ''
    if (app.globalData.bgImages[app.globalData.currentBg - 1].img && app.globalData.bgImages[app.globalData.currentBg - 1].img.length > 0) {
      bgImgUrl = "../image/" + app.globalData.bgImages[app.globalData.currentBg - 1].img
    }
    this.setData({
      currentGesture: 0,
      bgImgWidth: app.globalData.bgImages[app.globalData.currentBg - 1].width,
      bgImgHeight: app.globalData.bgImages[app.globalData.currentBg - 1].height,
      bgImgUrl: bgImgUrl,
      text: "没有滑动",
    });
  },
})