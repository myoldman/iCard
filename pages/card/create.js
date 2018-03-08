//logs.js

const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    showMain: true,
    showGen: true,
    showCanvas: false,
    showEdit: false,
    showSave: false,
    showConfirm: false,
    currentBgCss: 'main1',
    nextBgCss: 'main1',
    currentCss:  '',
    nextCss: 'next_right',
    currentStyle:'',
    nextStyle:'',
    currentBg: 'current',
    width: app.globalData.width,
    height: app.globalData.height,
    lastX: 0,
    lastY: 0,
    currentGesture: 0,
  },
  onLoad: function () {
    this.setData({
      showMain: true,
      showGen: true,
      showCanvas: false,
      showEdit: false,
      showSave: false,
    })
  },
  onShow:function() {
  },
  beforeGen: function (e) {
    this.setData({
      showMain: false,
      showGen: false,
      showCanvas: true,
      showEdit: true,
      showSave: true,
      text: '',
    });
  },
  editCard: function (e) {
    this.setData({
      showMain: true,
      showGen: true,
      showCanvas: false,
      showEdit: false,
      showSave: false,
      text: '',
    });
  },
  saveCard: function (e) {
    var that = this
    wx.canvasToTempFilePath({
      canvasId: 'cardCanvas',
      complete: function (res) {
        console.log(res)
      },
      success: function (res) {
        console.log(res)
        var filepath = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: filepath,
          success:
          function (data) {
            wx.showToast({
              title: '保存卡片成功',
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
    })
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
      showEdit: true,
      showSave: true,
    });
    var content = e.detail.value.content
    setTimeout(function () {
      //if (that.data.showView){
        var ctx = wx.createCanvasContext('cardCanvas')
        var currentBgObj = app.globalData.bgImages[app.globalData.currentBg - 1]
        var totalWidth = app.globalData.width
        var totalHeight = app.globalData.height - 90
        var bgWidth = currentBgObj.width
        var bgHeight = currentBgObj.height
        var color = currentBgObj.color
        var data = currentBgObj.data
        if (color.length > 0) {
          ctx.rect(0, 0, totalWidth,totalHeight)
          ctx.setFillStyle(color)
          ctx.fill()
          ctx.draw(true)
        }
        if (data.length > 0) {
          var widthMod = parseInt(totalWidth / bgWidth) + 1
          var heightMod = parseInt(totalHeight / bgHeight) + 1
          for (var j = 0; j < heightMod; j++) {
            for (var i = 0; i < widthMod; i++) {
              ctx.drawImage(data, bgWidth * i, bgHeight * j, bgWidth, bgHeight)
            }
          }
          //ctx.draw(true)
        }
        var contents = content.split("\n")
        var fontSpace = 18;
        console.log(contents)
        ctx.setFillStyle('black')
        ctx.setTextAlign('start')
        ctx.setFontSize(15)
        var initY = fontSpace;
        for (var k = 0; k < contents.length; k++) {
          var line = contents[k]
          var lineWidth = 0;
          var initX = fontSpace
          var lastSubStrIndex = 0; 
          for (var z = 0; z < line.length; z++) {
            lineWidth += ctx.measureText(line[z]).width;
            
            if (lineWidth > totalWidth - 2*initX) {//减去initX,防止边界出现的问题
              console.log(initX)
              console.log(initY)
                ctx.fillText(line.substring(lastSubStrIndex, z), initX, initY);
                ctx.draw(true)
                initY += fontSpace;
                lineWidth = 0;
                lastSubStrIndex = z;
            }
            if (z == line.length - 1) {
              console.log(initX)
              console.log(initY)
              ctx.fillText(line.substring(lastSubStrIndex, z + 1), initX, initY);
              ctx.draw(true)
            }
          }
          initY += fontSpace;

          //ctx.fillText(contents[k], fontSpace, fontSpace*(k+1))
          
        }
        ctx.draw(true, function (e) {
          console.log('draw callback')
        })
        wx.hideLoading()
      //} else {
      //  console.log("not show view")
      //}
      }.bind(this), 100);
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
    this.setData({
      text: "没有滑动",
    });
  },
})