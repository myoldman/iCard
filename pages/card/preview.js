//logs.js

const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    error : '',
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

    var fontSpace = app.globalData.textSpace;
    ctx.setFillStyle(app.globalData.textColor)
    ctx.setTextAlign('start')
    ctx.setFontSize(app.globalData.textSize)
    var initY = fontSpace;

    for (var k = 0; k < contents.length; k++) {
      var line = contents[k]
      var lineWidth = 0;
      var initX = app.globalData.hMargin
      var lastSubStrIndex = 0;
      for (var z = 0; z < line.length; z++) {
        lineWidth += ctx.measureText(line[z]).width
        if (lineWidth > (totalWidth - 2 * initX) ) {//减去initX,防止边界出现的问题
          var tempText = line.substring(lastSubStrIndex, z + 1)
          ctx.fillText(tempText, initX, initY)
          initY += fontSpace
          lineWidth = 0
          lastSubStrIndex = z+1
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
    ctx.moveTo((totalWidth - footerLineWidth) / 2, this.data.canvasHeight - fontSpace - app.globalData.textSize - 2 * app.globalData.footerLineWidth)
    ctx.lineTo((totalWidth - footerLineWidth) / 2 + footerLineWidth, this.data.canvasHeight - fontSpace - app.globalData.textSize - 2 * app.globalData.footerLineWidth)
    ctx.stroke()

    ctx.setFillStyle(app.globalData.footerLineColor)
    ctx.setTextAlign('center')
    ctx.fillText(app.globalData.footerText, totalWidth / 2, this.data.canvasHeight - fontSpace)

    var that = this
    ctx.draw(false, function (e) {
      wx.canvasToTempFilePath({
        canvasId: 'cardCanvas',
        complete: function (res) {
          //console.log(res)
          //var filepath = res.tempFilePath
          //that.setData({ error: res.errMsg})
          //wx.hideLoading()
        },
        fail: function (res) {
          //console.log(res)
          var filepath = res.tempFilePath
          that.setData({ error: res.errMsg })
          wx.hideLoading()
        },
        success: function (res) {
          console.log(res)
          var filepath = res.tempFilePath
          //wx.showToast({
          //  title: 'success:' + that.data.canvasHeight,
          //})
          that.setData({ imageUrl: filepath, showImage: true, showCanvas: false })
          wx.hideLoading()
        }
      })
      console.log('draw callback')
    })

    
  },

  calcCanvasHeight : function(contents, ctx) {
    // 先循环一次计算总高度
    ctx.setFillStyle(app.globalData.textColor)
    ctx.setTextAlign('start')
    ctx.setFontSize(app.globalData.textSize)
    var totalWidth = app.globalData.width
    var fontSpace = app.globalData.textSpace
    var initY = fontSpace
    for (var k = 0; k < contents.length; k++) {
      var line = contents[k]
      var lineWidth = 0;
      var initX = app.globalData.hMargin
      var lastSubStrIndex = 0;
      for (var z = 0; z < line.length; z++) {
        lineWidth += ctx.measureText(line[z]).width;
        if (lineWidth > totalWidth - 2 * initX ) {//减去initX,防止边界出现的问题
          line.substring(lastSubStrIndex, z + 1),
          initY += fontSpace
          lineWidth = 0;
          lastSubStrIndex = z + 1;
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
      current: '',
      urls: [this.data.imageUrl],
      fail:function() {
        //wx.showToast({
          //title: "failt:" + res,
        //})
      },
      success:function(res) {
        //wx.showToast({
        //  title: "success:" + res,
        //})
        return;
          wx.canvasToTempFilePath({
            canvasId: 'cardCanvas',
            complete: function (res) {
              //console.log(res)
              //var filepath = res.tempFilePath
              //that.setData({ imageUrl: filepath })
              //wx.showToast({
              //  title: 'c:' + filepath,
              //})
            },
            success: function (res) {
              console.log(res)
              wx.showToast({
                title: 's:' + that.data.canvasHeight,
              })
            }
          })
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