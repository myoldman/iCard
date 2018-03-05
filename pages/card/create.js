//logs.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    showView: false,
    showMain: true,
    showGen: true,
    showShare: false,
    showSave : false,
    sharePath: '',
    bgCss :'main0',
    currentBg:0,
    maxBg : 3,
    lastX: 0,
    lastY: 0,
    text: "没有滑动",
    currentGesture: 0,
  },
  onLoad: function () {
    this.setData({
      showView: false,
      showMain: true,
      showGen: true,
      showShare : false,
      showSave: false,
      sharePath:'',
    })
  },
  onShareAppMessage:function() {
    console.log(this.data.sharePath)
    return {
      title: '我的卡片',
      //imageUrl: this.data.sharePath
    }
  },
  beforeGen:function(e) {
    this.setData({
      showView: true,
      showMain: false,
      showGen: false,
      showShare: true,
      showSave: true,
    });
  },
  onSubmit:function(e){
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

    var widthMod =  parseInt(totalWidth / bgWidth) + 2
    var heightMod = parseInt(totalHeight / bgHeight) + 2
    console.log(widthMod)
    console.log(heightMod)
    for (var j = 0; j < heightMod; j++){
      for(var i = 0; i< widthMod; i++){
        ctx.drawImage(app.globalData.bgImages[0], bgWidth * i, bgHeight*j, 56, 28)
      }
    }
    ctx.draw(true)
    ctx.setTextAlign('center')
    ctx.setFontSize(15)
    ctx.fillText(e.detail.value.content, 50, 50)
    ctx.draw(true)
    wx.hideLoading()
  },

  saveCard : function(e){
    var that = this
    wx.canvasToTempFilePath({
      canvasId: 'cardCanvas',
      complete: function (res) {
        //console.log(res);
      },
      success: function (res) {
        var filepath = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: filepath,
        })
      }
    })
   
  
  },
  drawImage: function(content) {
    
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

  handletouchtart: function (event) {
    this.data.lastX = event.touches[0].pageX
    this.data.lastY = event.touches[0].pageY
  },
  handletouchend: function (event) {
    console.log(this.data.currentGesture )
    console.log(this.data.currentBg)
    if (this.data.currentGesture == 1)
    {
      if (this.data.currentBg >= (this.data.maxBg-1)) {
        this.setData(
          {
            currentBg: 0,
            bgCss: 'main0'
          }
        )
      }  else {
        this.setData(
          {
            currentBg: this.data.currentBg + 1,
            bgCss: 'main' + (this.data.currentBg + 1)
          }
        )
      }
    } else if(this.data.currentGesture == 2) {
      if (this.data.currentBg <= 0) {
        this.setData(
          {
            currentBg: (this.data.maxBg-1),
            bgCss: 'main' + (this.data.maxBg-1)
          }
        )
      } else {
        this.setData(
          {
            currentBg: this.data.currentBg - 1,
            bgCss: 'main' + (this.data.currentBg - 1)
          }
        )
      }
    }
    this.data.currentGesture = 0
    this.setData({
      text: "没有滑动",
    });
  },
})