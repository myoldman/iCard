//logs.js

const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    imageUrl: '',
    showImage: false,
    showCanvas: true,
    bgColor: app.globalData.bgImages[app.globalData.currentBg-1].color,
    width: app.globalData.width,
    height: app.globalData.height,
    canvasHeight: app.globalData.defaultCanvasHeight,
    content: '',
    autoHeight: true
  },
  onLoad: function (options) {
    this.setData({
      bgColor: app.globalData.bgImages[app.globalData.currentBg-1].color,
      content: options.content,
    })
    this.setData({
      bgColor: app.globalData.bgImages[app.globalData.currentBg - 1].color,
    })
  },
  onReady: function() {
    wx.showLoading({
      title: '正在生成图片',
      mask: true,
    })
    var content = this.data.content
    var ctx = wx.createCanvasContext('cardCanvas')
    var currentBgObj = app.globalData.bgImages[app.globalData.currentBg - 1]
    var totalWidth = app.globalData.width
    var totalHeight = app.globalData.defaultCanvasHeight
    var bgWidth = currentBgObj.width
    var bgHeight = currentBgObj.height
    var color = currentBgObj.color
    var data = currentBgObj.data
    var contents = content.split("\n")
    this.calcCanvasHeight(contents, ctx)

    if (color.length > 0) {
      ctx.setFillStyle(color)
      ctx.fillRect(0, 0, totalWidth, this.data.canvasHeight)
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
        lineWidth += ctx.measureText(line[z]).width
        if (lineWidth > totalWidth - 2.2 * initX) {//减去initX,防止边界出现的问题
          ctx.fillText(line.substring(lastSubStrIndex, z), initX, initY)
          initY += fontSpace
          lineWidth = 0
          lastSubStrIndex = z
        }
        if (z == line.length - 1) {
          ctx.fillText(line.substring(lastSubStrIndex, z + 1), initX, initY)
        }
      }
      initY += fontSpace;
    }

    var footerTextWidth = ctx.measureText(app.globalData.footerText).width
    var footerLineWidth = footerTextWidth + 2 * app.globalData.footerLineMargin
    ctx.setLineWidth(app.globalData.footerLineWidth)
    ctx.setStrokeStyle(app.globalData.footerLineColor)
    ctx.moveTo((totalWidth - footerLineWidth) / 2, this.data.canvasHeight - fontSpace - 18 - 2 * app.globalData.footerLineWidth)
    ctx.lineTo((totalWidth - footerLineWidth) / 2 + footerLineWidth, this.data.canvasHeight - fontSpace - 18 - 2 * app.globalData.footerLineWidth)
    ctx.stroke()

    ctx.setFillStyle(app.globalData.footerLineColor)
    ctx.setTextAlign('center')
    ctx.fillText(app.globalData.footerText, totalWidth / 2, this.data.canvasHeight - fontSpace)

    var that = this
    ctx.draw(false, function (e) {
      wx.canvasToTempFilePath({
        canvasId: 'cardCanvas',
        complete: function (res) {
          console.log(res)
        },
        success: function (res) {
          console.log(res)
          var filepath = res.tempFilePath
          that.setData({ imageUrl: filepath, showImage: true, showCanvas: false })
        }
      })
      console.log('draw callback')
    })

    wx.hideLoading()
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
    initY = initY + app.globalData.footerHeight;
    if (initY > this.data.canvasHeight) {
      this.setData({
        canvasHeight: initY,
      })
    }
  },
  
  onShow: function () {
    
  },

  previewCard: function() {
    var that = this
    wx.previewImage({
      current: this.data.imageUrl,
      urls: [this.data.imageUrl],
      fail:function() {
        //wx.showToast({
          //title: "failt:" + res,
        //})
      },
      success:function(res) {
        //wx.showToast({
          //title: "success:" + res,
        //})
      }
    })
  },

  editCard: function (e) {
    wx.navigateBack()
  },

  saveCard: function (e) {
    var that = this
    // wx.canvasToTempFilePath({
    //   canvasId: 'cardCanvas',
    //   complete: function (res) {
    //     console.log(res)
    //   },
    //   success: function (res) {
    //     console.log(res)
    //     var filepath = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: this.data.imageUrl,
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
    //   }
    // })
  },
})