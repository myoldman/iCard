//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    createShow: 'none',
    width: app.globalData.width,
    height: app.globalData.height,
    userId: 0,
  },
  onShow: function() {
    /*
    if (app.globalData.userInfo) {
      console.log("test")
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.request({
        url: 'https://www.worklean.cn/icardtest/userInfo/getIndexInfo',
        data: app.globalData.userInfo,
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          wx.hideLoading();
          console.log(res);
          app.globalData.userInfo.id = res.data.id
          if (res.data.cards > 0) {
            wx.redirectTo({
              url: '../card/list',
            })
          } else {
            that.setData({ userId: res.data.id, createShow: 'block' });
          }
        },
        fail: function (res) {
          wx.hideLoading();
        },
        complete: function (res) {
        }
      });
    }*/
  },
  createCard: function() {
    wx.navigateTo({
      url: '../card/create'
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '登录中',
    })
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.request({
        url: 'https://www.worklean.cn/icardtest/userInfo/getIndexInfo',
        data: app.globalData.userInfo,
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          wx.hideLoading();
          console.log(res);
          app.globalData.userInfo.id = res.data.id
          //if (res.data.cards > 0) {
            wx.redirectTo({
              url: '../card/list',
            })
          //} else {
          //  that.setData({ userId: res.data.id, createShow: 'block' });
          //}
        },
        fail: function (res) { 
          wx.hideLoading();
        },
        complete: function (res) { 
        }
      });
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res,
          hasUserInfo: true
        })
        wx.request({
          url: 'https://www.worklean.cn/icardtest/userInfo/getIndexInfo',
          data: res,
          method: 'POST',
          dataType: 'json',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            wx.hideLoading();
            console.log(res);
            app.globalData.userInfo.id = res.data.id
            //if (res.data.cards > 0) {
              wx.redirectTo({
                url: '../card/list',
              })
            //} else {
            //  that.setData({ userId: res.data.id, createShow: 'block' });
            //}
          },
          fail: function (res) {
            wx.hideLoading();
          },
          complete: function (res) { 
          }
        });
      }
    }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   console.log("index");
    //   console.log(app.globalData.userInfo);
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
