//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    showView: false,
    showMain: true,
    showGen: true,
    showShare: false,
    showSave : false,
    sharePath: '',
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
    ctx.setTextAlign('center')
    ctx.setFontSize(15)
    ctx.fillText(e.detail.value.content, 50, 50)
    ctx.save()
    ctx.draw()
    wx.hideLoading()
  },

  saveCard : function(e){
    var that = this
    wx.canvasToTempFilePath({
      canvasId: 'cardCanvas',
      complete: function (res) {
        console.log(res);
      },
      success: function (res) {
        console.log("aaaaaaaaa")
        console.log(res.tempFilePath)
        var filepath = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: filepath,
        })
      }
    })
   
  
  },
  drawImage: function(content) {
    
  }
})