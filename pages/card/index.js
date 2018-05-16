
const util = require('../../utils/util.js')
var WXBizDataCrypt = require('../../utils/RdWXBizDataCrypt.js');
var AppId = 'wxa3c3f18080c0567d'

const app = getApp()
Page({
  data: {
    needAuth: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    width: app.globalData.width,
    height: app.globalData.height,
    ratio: app.globalData.ratio,
    userInfo: app.globalData.userInfo,
    webviewUrl: '',
    title: '青芒卡片',
    authImages : [1,2,3,4],
    authImageWidth :0,
    authImageHeight: 0,
  },
  onLoad: function (options) {
    // 如果有tabbar，app.js里面取到的高度会扣除tabbar的高度，所以非tabbar页面那需要重新获取当前页面高度
    if (options && options.webviewUrl) {
      this.setData({ webviewUrl: decodeURIComponent(options.webviewUrl) })

    }
    var sysInfo = wx.getSystemInfoSync()
    this.setData({ height: sysInfo.windowHeight, width: sysInfo.windowWidth })
  },

  checkStatus: function () {
    var that = this;
    // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
    wx.getSetting({
      success: function success(res) {
        var authSetting = res.authSetting;
        if (util.isEmptyObject(authSetting)) {
          console.log('首次授权');
        } else {
          console.log('不是第一次授权', authSetting);
          // 没有授权的提醒
          if (authSetting['scope.userInfo'] === false) {
            wx.hideLoading()
            wx.showModal({
              title: '用户未授权',
              content: '如需正常使用卡片功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.openSetting({
                    success: function success(openSettingRes) {
                      // 重新登录
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
                              var openId = res.data.openid
                              wx.getUserInfo({
                                // withCredentials: true,
                                success: function (res) {
                                  var data = pc.decryptData(res.encryptedData, res.iv)
                                  delete data.watermark;
                                  app.globalData.userInfo = data
                                  that.setData({ userinfo: data, hasuserInfo: true })
                                  that.onLoad()
                                },
                                fail: function (res) {
                                  console.log(res)
                                }
                              })
                            },
                            fail: function (res) { },
                            complete: function (res) { }
                          });
                        }
                      })
                    }
                  });
                }
              }
            })
          } else {

          }
        }
      }
    });
  },
  showAuthImage :function() {
    var that = this
    wx.request({
      url: app.globalData.urlbase + 'userInfo/getAuthConfig',
      data: {},
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if(res.data.res == 0) {
          var authImages = []
          var authImageCount = parseInt(res.data.authImageCount.value)
          var authImageSize = res.data.authImageSize.value.split('x')
          var authImageWidth = parseInt(authImageSize[0]);
          var authImageHeight = parseInt(authImageSize[1]);
          for (var i = 0; i < authImageCount; i++) {
            authImages.push((i+1))
          }
          that.setData({authImages: authImages, authImageWidth: authImageWidth, authImageHeight: authImageHeight})
        }
        wx.hideLoading();
      },
      fail: function (res) {
        wx.hideLoading();
      },
      complete: function (res) {
      }
    });
  },
  onShow: function () {
    wx.showLoading({
      title: '页面加载中',
      mask: true,
    })
    var sysInfo = wx.getSystemInfoSync()
    var that = this
    this.setData({ height: sysInfo.windowHeight, width: sysInfo.windowWidth })
    if (app.globalData.userInfo == null) {
      // 如果需要认证并且还未认证
      if (this.data.needAuth) {
        this.showAuthImage()
      } else if (app.globalData.needAuth) {
        console.log("app.js run first")
        that.setData({ needAuth: app.globalData.needAuth })
        this.showAuthImage()
      } else {
        this.setData({ webviewUrl: app.globalData.urlbase + "userInfo/index?height=" + this.data.height + "&width=" + this.data.width + "&ratio=" + this.data.ratio + "&userId=-1" })
      }
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res,
        })
        wx.request({
          url: app.globalData.urlbase + 'userInfo/getIndexInfo',
          data: res,
          method: 'POST',
          dataType: 'json',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            app.globalData.userInfo.id = res.data.id
            app.globalData.userInfo.cards = res.data.cards
            app.globalData.userInfo.maxUser = res.data.maxUser
            that.setData({ userInfo: app.globalData.userInfo })
            if (that.data.webviewUrl.length <= 0) {
              that.setData({ webviewUrl: app.globalData.urlbase + "userInfo/index?height=" + that.data.height + "&width=" + that.data.width + "&ratio=" + that.data.ratio + "&userId=" + that.data.userInfo.id + "&aaa=" })
            }
            wx.hideLoading();
          },
          fail: function (res) {
            wx.hideLoading();
          },
          complete: function (res) {
          }
        });
      }
      app.useInfoDenyCallBack = res => {
        wx.hideLoading();
        if (app.globalData.needAuth) {
          that.setData({ needAuth: app.globalData.needAuth })
          that.showAuthImage()
        }
      }
    } else {
      //如果用户已经授权，就直接取用户的相关数据，对应id，卡片等
      this.setData({
        userInfo: app.globalData.userInfo,
      })
      if (this.data.userInfo.id) {
        if (this.data.webviewUrl.length <= 0) {
          this.setData({ webviewUrl: app.globalData.urlbase + "userInfo/index?height=" + this.data.height + "&width=" + this.data.width + "&ratio=" + this.data.ratio + "&userId=" + this.data.userInfo.id })
        }
        wx.hideLoading();
      } else {
        wx.request({
          url: app.globalData.urlbase + 'userInfo/getIndexInfo',
          data: app.globalData.userInfo,
          method: 'POST',
          dataType: 'json',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            wx.hideLoading();
            app.globalData.userInfo.id = res.data.id
            app.globalData.userInfo.cards = res.data.cards
            app.globalData.userInfo.maxUser = res.data.maxUser
            that.setData({ userInfo: app.globalData.userInfo })
            if (that.data.webviewUrl.length <= 0) {
              that.setData({ webviewUrl: app.globalData.urlbase + "userInfo/index?height=" + that.data.height + "&width=" + that.data.width + "&ratio=" + that.data.ratio + "&userId=" + that.data.userInfo.id })
            }
          },
          fail: function (res) {
            wx.hideLoading();
          },
          complete: function (res) {
          }
        });
      }
    }
  },

  recvMessage: function (e) {
    console.log(e);
    if (e.detail.data[e.detail.data.length - 1].webviewUrl) {
      this.setData({ webviewUrl: e.detail.data[e.detail.data.length - 1].webviewUrl, title: e.detail.data[e.detail.data.length - 1].title })
    }
    if (e.detail.data[0].msg == 'backList') {
      var pages = getCurrentPages()
      var firstPage = pages[0]
      firstPage.setData({ searchText: '' });
    }
  },
  onShareAppMessage() {
    console.log('/pages/card/index?webviewUrl=' + encodeURIComponent(this.data.webviewUrl));
    return {
      title: this.data.title,
      path: '/pages/card/index?webviewUrl=' + encodeURIComponent(this.data.webviewUrl) // 分享出去后打开的页面地址
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    if (e.detail.errMsg.indexOf("ok") >= 0) {
      var pc = new WXBizDataCrypt(AppId, app.globalData.session_key)
      var data = pc.decryptData(e.detail.encryptedData, e.detail.iv)
      delete data.watermark;
      app.globalData.userInfo = data
      var that = this
      wx.request({
        url: app.globalData.urlbase + 'userInfo/getIndexInfo',
        data: data,
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          app.globalData.userInfo.id = res.data.id
          app.globalData.userInfo.cards = res.data.cards
          app.globalData.userInfo.maxUser = res.data.maxUser
          that.setData({ userInfo: app.globalData.userInfo })
          //if (that.data.webviewUrl.length <= 0) {
            that.setData({ webviewUrl: app.globalData.urlbase + "userInfo/index?height=" + that.data.height + "&width=" + that.data.width + "&ratio=" + that.data.ratio + "&userId=" + that.data.userInfo.id, needAuth:false })
          //}
        },
        fail: function (res) {
        },
        complete: function (res) {
        }
      });
    }
  }
})