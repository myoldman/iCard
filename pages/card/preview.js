//logs.js

const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    bgColor: app.globalData.bgImages[app.globalData.currentBg-1].color,
    width: app.globalData.width,
    height: app.globalData.height,
    content: ''
  },
  onLoad: function (options) {
    this.setData({
      bgColor: app.globalData.bgImages[app.globalData.currentBg-1].color,
      content: options.content,
    })
    
  },

  onShow: function () {
    this.setData({
      bgColor: app.globalData.bgImages[app.globalData.currentBg-1].color,
    })
    wx.showLoading({
      title: '正在生成图片',
      mask: true,
    })
    var content = this.data.content
    var ctx = wx.createCanvasContext('cardCanvas')
    var currentBgObj = app.globalData.bgImages[app.globalData.currentBg - 1]
    var totalWidth = app.globalData.width
    var totalHeight = app.globalData.height - 90
    var bgWidth = currentBgObj.width
    var bgHeight = currentBgObj.height
    var color = currentBgObj.color
    var data = currentBgObj.data
    if (color.length > 0) {
      ctx.rect(0, 0, totalWidth, totalHeight)
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
    }

    var contents = content.split("\n")
    var fontSpace = 32;
    console.log(contents)
    ctx.setFillStyle('black')
    ctx.setTextAlign('start')
    ctx.setFontSize(16)
    var initY = fontSpace;
    for (var k = 0; k < contents.length; k++) {
      var line = contents[k]
      var lineWidth = 0;
      var initX = 18
      var lastSubStrIndex = 0;
      for (var z = 0; z < line.length; z++) {
        lineWidth += ctx.measureText(line[z]).width;
        if (lineWidth > totalWidth - 2 * initX) {//减去initX,防止边界出现的问题
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
    }
    ctx.draw(true, function (e) {
      console.log('draw callback')
    })
    wx.hideLoading()
  },

  editCard: function (e) {
    wx.navigateBack()
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
})