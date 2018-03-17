//logs.js

const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    error : '',
    imageUrl: '',
    showImage: true,
    showCanvas: false,
    bgColor: app.globalData.bgImages[app.globalData.currentBg-1].color,
    bg: app.globalData.bgImages[app.globalData.currentBg - 1].bg,
    bgImg: app.globalData.bgImages[app.globalData.currentBg - 1].img,
    width: app.globalData.width,
    height: app.globalData.height,
    canvasHeight: app.globalData.defaultCanvasHeight,
    ratio: app.globalData.ratio,
    content: '',
    autoHeight: true
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '正在生成图片',
      mask: true,
    })
    this.setData({
      bgColor: app.globalData.bgImages[app.globalData.currentBg - 1].color,
      bg: app.globalData.bgImages[app.globalData.currentBg - 1].bg,
      bgImg: app.globalData.bgImages[app.globalData.currentBg - 1].img,
      content: options.content,
    })
    console.log(this.data)
    var that = this
    wx.request({
      url: 'https://www.worklean.cn/icard/transPng', //仅为示例，并非真实的接口地址
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
      complete:function(res) {
        wx.hideLoading()
      }
    })
    
  },
  onReady: function() {
    return;
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
    var initY = 50;

    for (var k = 0; k < contents.length; k++) {
      var line = contents[k]
      var lineWidth = 0;
      var initX = app.globalData.hMargin
      var lastSubStrIndex = 0;
      for (var z = 0; z < line.length; z++) {
        lineWidth += ctx.measureText(line[z]).width
        if (lineWidth > (totalWidth  - app.globalData.textSize*0.6 - 2 * initX) ) {//减去initX,防止边界出现的问题
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

    ctx.setFillStyle(app.globalData.footerTextColor)
    ctx.setTextAlign('center')
    ctx.setFontSize(app.globalData.footerTextSize)
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
    var initY = 50
    for (var k = 0; k < contents.length; k++) {
      var line = contents[k]
      var lineWidth = 0;
      var initX = app.globalData.hMargin
      var lastSubStrIndex = 0;
      for (var z = 0; z < line.length; z++) {
        lineWidth += ctx.measureText(line[z]).width;
        if (lineWidth > totalWidth - app.globalData.textSize * 0.6 - 2 * initX ) {//减去initX,防止边界出现的问题
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
    })
  },

  editCard: function (e) {
    wx.navigateBack()
  },

  saveCard: function (e) {
    var that = this
    wx.showLoading({
      title: '正在保存卡片',
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
      },
      complete:function(res) {
        wx.hideLoading()
      }
    })
  },
})