
const util = require('../../utils/util.js')
var WXBizDataCrypt = require('../../utils/RdWXBizDataCrypt.js');
var AppId = 'wxa3c3f18080c0567d'

const app = getApp()
Page({
  data: {
    // 是否显示认证页面
    showAuth: false,
    // 是否需要认证,来自后台配置数据
    needAuth: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    width: app.globalData.width,
    height: app.globalData.height,
    ratio: app.globalData.ratio,
    userInfo: app.globalData.userInfo,
    webviewUrl: '',
    title: '青芒卡片',
    authImages: [1, 2, 3, 4],
    authImageWidth: 0,
    authImageHeight: 0,
    authButtonStyle: '',
  },

  onLoad: function (options) {
    // 如果有tabbar，app.js里面取到的高度会扣除tabbar的高度，所以非tabbar页面那需要重新获取当前页面高度
    if (options && options.webviewUrl) {
      console.log(decodeURIComponent(options.webviewUrl))
      this.setData({ webviewUrl: decodeURIComponent(options.webviewUrl) })

    }
    var sysInfo = wx.getSystemInfoSync()
    this.setData({ height: sysInfo.windowHeight, width: sysInfo.windowWidth })
  },

  getCompleteUserInfo: function(userInfo, hideLoading) {
    var that = this
    wx.request({
      url: app.globalData.urlbase + 'userInfo/getIndexInfo',
      data: userInfo,
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        userInfo.id = res.data.id
        userInfo.cards = res.data.cards
        userInfo.maxUser = res.data.maxUser
        that.setData({ userInfo: userInfo , showAuth:false})
        if (that.data.webviewUrl.length <= 0) {
          that.setData({ webviewUrl: app.globalData.urlbase + "userInfo/index?height=" + that.data.height + "&width=" + that.data.width + "&ratio=" + that.data.ratio + "&userId=" + that.data.userInfo.id })
        }
        if (hideLoading)
          wx.hideLoading();
      },
      fail: function (res) {
        if (hideLoading)
          wx.hideLoading();
      },
      complete: function (res) {
      }
    });
  },

  getDecryptUserInfo: function (userInfo) {
    // 登录
    var that = this
    wx.login({
      success: res => {
        //发起网络请求
        wx.request({
          url: app.globalData.urlbase + 'userInfo',
          data: {
            js_code: res.code,
          },
          method: 'POST',
          dataType: 'json',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            var pc = new WXBizDataCrypt(AppId, res.data.session_key)
            var session_key = res.data.session_key
            if (userInfo == null) {
              // userInfo 为空，从页面加载处调用的，需要调用wx.getUserInfo尝试获取用户信息
              wx.getUserInfo({
                withCredentials: true,
                success: function (res) {
                  var data = pc.decryptData(res.encryptedData, res.iv)
                  delete data.watermark;
                  that.getCompleteUserInfo(data, true)
                },
                fail: function (res) {
                  //获取用户信息失败
                  if(that.data.needAuth) {
                    //如果需要授权则显示授权页面
                    that.setData({ showAuth: true})
                    wx.hideLoading()
                  } else {
                    // 不需要授权的话，应该直接进入固定图片列表页面了，这里不需要处理
                  }
                }
              })
            } else {
              //如果userInfo不为空则是用户按钮事件回调
              var data = pc.decryptData(userInfo.encryptedData, userInfo.iv)
              that.getCompleteUserInfo(data, false)
            }
          },
          fail: function (res) { },
          complete: function (res) { }
        });
      }
    })
  },

  onShow: function () {
    wx.showLoading({
      title: '页面加载中',
      mask: true,
    })
    var sysInfo = wx.getSystemInfoSync()
    var that = this
    this.setData({ height: sysInfo.windowHeight, width: sysInfo.windowWidth })
    if (this.data.userInfo == null) {
      // 如果还未获取用户信息

      // 获取认证配置信息
      wx.request({
        url: app.globalData.urlbase + 'userInfo/getAuthConfig',
        data: {},
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.res == 0) {
            var authImages = []
            var needAuth = false
            if (res.data.needAuth == "true") {
              needAuth = true
            }
            var authImageCount = parseInt(res.data.authImageCount.value)
            var authImageSize = res.data.authImageSize.value.split('x')
            var authImageWidth = parseInt(authImageSize[0]);
            var authImageHeight = parseInt(authImageSize[1]);
            var authButtonStyle = res.data.authButtonStyle.value
            for (var i = 0; i < authImageCount; i++) {
              authImages.push((i + 1))
            }
            if (needAuth) {
              // 如果需要认证,先设置页面上的认证参数，然后尝试获取用户信息
              that.setData({ needAuth: needAuth, authImages: authImages, authImageWidth: authImageWidth, authImageHeight: authImageHeight, authButtonStyle: authButtonStyle })
              that.getDecryptUserInfo(null);
            } else {
              // 不需要认证跳转到固定图片列表页面
              that.setData({ needAuth: needAuth, showAuth: false, webviewUrl: app.globalData.urlbase + "userInfo/index?height=" + that.data.height + "&width=" + that.data.width + "&ratio=" + that.data.ratio + "&userId=-1" })
              wx.hideLoading();
            }
          } else {
            // 获取失败当做需要认证处理
            that.setData({ needAuth: true, showAuth: true });
            wx.hideLoading();
          }
        },
        fail: function (res) {
          // 获取失败当做需要认证处理
          that.setData({ needAuth: true, showAuth: true });
          wx.hideLoading();
        },
        complete: function (res) {
        }
      });
    } else {
      //如果已经获取用户信息完毕已经授权，就直接跳转到用户首页
      if (this.data.webviewUrl.length <= 0) {
        this.setData({ showAuth: false, webviewUrl: app.globalData.urlbase + "userInfo/index?height=" + this.data.height + "&width=" + this.data.width + "&ratio=" + this.data.ratio + "&userId=" + this.data.userInfo.id })
      }
      wx.hideLoading();
    }
  },

  recvMessage: function (e) {
    if (e.detail.data[e.detail.data.length - 1].webviewUrl) {
      this.setData({ webviewUrl: e.detail.data[e.detail.data.length - 1].webviewUrl, title: e.detail.data[e.detail.data.length - 1].title })
    }
  },

  onShareAppMessage() {
    console.log('/pages/card/index?webviewUrl=' + encodeURIComponent(this.data.webviewUrl+"&fromshare=yes"));
    return {
      title: this.data.title,
      path: '/pages/card/index?webviewUrl=' + encodeURIComponent(this.data.webviewUrl +"&fromshare=yes") // 分享出去后打开的页面地址
    }
  },

  getUserInfo: function (e) {
    if (e.detail.errMsg.indexOf("ok") >= 0) {
      this.getDecryptUserInfo(e.detail);
    }
  }
})