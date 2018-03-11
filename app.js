//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    defaultCanvasHeight:450,
    bgImages: [
      { width:56, height:28, data:"",color:"#FFF"},
      { width: 56, height: 28, data: "", color: "#F8F2E2" },
      { width: 56, height: 28, data: "", color: "#F3F2F7" },
    ],
    textColor: '#282A2D',
    textSize:16,
    textSpace:32,
    
    footerText:"使用小程序\"卡片创作助手\"制作",
    footerTextColor: '#B7BABF',
    footerTextSize:13,
    footerTextSpace:38,

    footerLineColor: '#E4E5E7',
    footerLineWidth:1,
    footerLineMargin:10,

    footerHeight:60,

    currentBg: 1,
    maxBg: 3,
    userInfo: null,
    width: wx.getSystemInfoSync().windowWidth,
    height: wx.getSystemInfoSync().windowHeight,
  }
})