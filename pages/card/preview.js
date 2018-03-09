//logs.js

const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    bgColor: app.globalData.bgImages[app.globalData.currentBg-1].color,
    width: app.globalData.width,
    height: app.globalData.height,
    canvasHeight: app.globalData.height,
    content: '',
    autoHeight: true
  },
  onLoad: function (options) {
    this.setData({
      bgColor: app.globalData.bgImages[app.globalData.currentBg-1].color,
      content: options.content,
    })
    
  },
  calcCanvasHeight : function(contents, ctx) {
    // 先循环一次计算总高度
    ctx.setFillStyle('black')
    ctx.setTextAlign('start')
    ctx.setFontSize(16)
    var totalWidth = app.globalData.width
    var fontSpace = 32
    var initY = fontSpace
    for (var k = 0; k < contents.length; k++) {
      var line = contents[k]
      var lineWidth = 0;
      var initX = 18
      var lastSubStrIndex = 0;
      for (var z = 0; z < line.length; z++) {
        lineWidth += ctx.measureText(line[z]).width;
        if (lineWidth > totalWidth - 2 * initX) {//减去initX,防止边界出现的问题
          line.substring(lastSubStrIndex, z),
          initY += fontSpace
          lineWidth = 0;
          lastSubStrIndex = z;
        }
        if (z == line.length - 1) {
          line.substring(lastSubStrIndex, z + 1)
        }
      }
      initY += fontSpace;
    }
    console.log(initY)
    initY = initY +  200;
    console.log(initY)
    if (initY > this.data.canvasHeight) {
      this.setData({
        canvasHeight: initY,
      })
    }
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
    var totalHeight = app.globalData.height
    var bgWidth = currentBgObj.width
    var bgHeight = currentBgObj.height
    var color = currentBgObj.color
    var data = currentBgObj.data
    var contents = content.split("\n")
    
    this.calcCanvasHeight(contents, ctx)

    console.log(this.data.canvasHeight)
    if (color.length > 0) {
      ctx.rect(0, 0, totalWidth, this.data.canvasHeight)
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

    
    var fontSpace = 32;
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
          ctx.fillText(line.substring(lastSubStrIndex, z), initX, initY);
          ctx.draw(true)
          initY += fontSpace
          lineWidth = 0;
          lastSubStrIndex = z;
        }
        if (z == line.length - 1) {
          ctx.fillText(line.substring(lastSubStrIndex, z + 1), initX, initY);
          ctx.draw(true)
        }
      }
      initY += fontSpace;
    }
    ctx.setTextAlign('center')
    ctx.fillText("测试一下", totalWidth/2, initY);
    
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