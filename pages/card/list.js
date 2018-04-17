//logs.js
var WXBizDataCrypt = require('../../utils/RdWXBizDataCrypt.js');
var AppId = 'wx6136481aa72e3ce3'
const util = require('../../utils/util.js')
function getGroup(groupList, groupTitle) {
  for (var i = 0; i < groupList.length; i++) {
    if (groupList[i].title == groupTitle) {
      return groupList[i]
    }
  }
  return null
}

function isEmptyObject(e) {
  var t;
  for (t in e)
    return !1;
  return !0
}

const app = getApp()
Page({
  data: {
    initLeft: 12,
    delBtnWidth: 20 + 20 + 32,
    startX: 0,
    ratio: app.globalData.ratio,
    width: app.globalData.width,
    noMore: false,
    noData: false,
    showFooter: false,
    popMenuShow: false,
    confirmShow: false,
    pageIndex: 1,
    pageCount: 8,
    opacity: 1,
    cardList: [
      // { title:"本月", cards:[
      //   {id:1, content:"# 张大春谈秋夜", update_date:"2018-04-06 10:11:12"},
      //   { id: 2, content: "# 张大春谈秋夜", update_date: "2018-04-06 9:11:12" }
      // ]},
      // { title: "3月", cards: [{ id: 3, content: "# 张大春谈秋夜", update_date: "2018-03-06 10:11:12" },]},
      // { title: "2月", cards: [{ id: 4, content: "# 张大春谈秋夜", update_date: "2018-02-06 10:11:12" },]},
    ],
    userInfo: app.globalData.userInfo,
    height: app.globalData.height,
    bottomLoading: false,
    currentSelectedCard: 0,
  },
  checkStatus: function () {
    var that = this;
    // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
    wx.getSetting({
      success: function success(res) {
        var authSetting = res.authSetting;
        if (isEmptyObject(authSetting)) {
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
                            url: 'https://www.worklean.cn/icard/userInfo',
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
  createCard: function () {
    wx.navigateTo({
      url: '../card/create'
    })
  },

  hidePopup: function () {
    this.setData({ opacity: 1, currentSelectedCard: 0, popMenuShow: false, confirmShow: false });
  },

  deleteCard: function (e) {
    var cardId = e.currentTarget.id
    var that = this
    wx.showModal({
      title: '删除卡片',
      content: '卡片删除后无法找回，确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除卡片',
          })
          wx.request({
            url: 'https://www.worklean.cn/icard/userInfo/deleteUserCard',
            data: { cardId: cardId },
            method: 'POST',
            dataType: 'json',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              wx.hideLoading()
              wx.startPullDownRefresh()
            },
            fail: function (res) {
              wx.hideLoading()
              wx.startPullDownRefresh()
            },
            complete: function (res) {
            }
          });
        } else if (res.cancel) {

        }
      }
    })

  },

  initDisplay: function () {
    var cardList = this.data.cardList
    for (var i = 0; i < cardList.length; i++) {
      var group = cardList[i]
      for (var j = 0; j < group.cards.length; j++) {
        group.cards[i].leftWidth = this.data.width - 12 * 2;
        group.cards[i].rightWidth = 0;
      }
    }
    this.setData({ cardList: cardList })
  },

  editCard: function (e) {
    wx.navigateTo({
      url: 'create?cardId=' + e.currentTarget.dataset.id,
    })
  },

  loadCards: function () {
    var that = this
    wx.request({
      url: 'https://www.worklean.cn/icard/userInfo/getUserCards',
      data: { userid: app.globalData.userInfo.id, pageIndex: this.data.pageIndex, pageCount: this.data.pageCount },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.stopPullDownRefresh()
        var origCardList = that.data.cardList
        if (res.data.res == 0) {
          for (var i = 0; i < res.data.cardList.length; i++) {
            var group = res.data.cardList[i];
            var existGroup = getGroup(origCardList, group.title)
            if (existGroup) {
              for (var j = 0; j < group.cards.length; j++) {
                existGroup.cards.push(group.cards[j])
              }
            } else {
              origCardList.push(group)
            }
          }
          that.setData({ cardList: origCardList });
        }

        var totalCards = res.data.totalCards;
        var currentCards = res.data.cards;
        if (totalCards < 4 && totalCards > 0) {
          that.setData({ noMore: false, noData: false, showFooter: true });
        } else if (currentCards < that.data.pageCount && totalCards > 0) {
          that.setData({ noMore: true, noData: false, showFooter: false });
        } else if (totalCards == 0) {
          that.setData({ noData: true, noMore: false, showFooter: true });
        }
        if (that.data.bottomLoading) {
          that.setData({ bottomLoading: false });
        }
      },
      fail: function (res) {
        wx.stopPullDownRefresh()
        if (that.data.bottomLoading) {
          that.setData({ bottomLoading: false });
        }
      },
      complete: function (res) {
        wx.stopPullDownRefresh()
        if (that.data.bottomLoading) {
          that.setData({ bottomLoading: false });
        }
      }
    });
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
        url: 'https://www.worklean.cn/icard/userInfo/getIndexInfo',
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
          wx.startPullDownRefresh({});
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
      app.useInfoDenyCallBack = res => {
        wx.hideLoading()
        this.setData({
          userInfo: null,
          hasUserInfo: false,
        })
        this.checkStatus()
        app.useInfoDenyCallBack = null
      }
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res,
          hasUserInfo: true
        })
        wx.request({
          url: 'https://www.worklean.cn/icard/userInfo/getIndexInfo',
          data: res,
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
            console.log(res.data)
            that.setData({ userInfo: app.globalData.userInfo })
            wx.startPullDownRefresh({})
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

  onShow: function () {
    if (this.data.userInfo != null && this.data.userInfo.id != null && this.data.userInfo.id > 0) {
      wx.startPullDownRefresh({
      })
    } else if (this.data.userInfo == null) {
      this.checkStatus()
    }
  },

  onPullDownRefresh: function () {
    this.setData({ cardList: [], pageIndex: 1, noMore: false });
    this.loadCards()
  },
  onReachBottom: function () {
    if (this.data.noMore) {
    } else {
      this.setData({
        bottomLoading: true,
      });
      this.setData({ pageIndex: this.data.pageIndex + 1 })
      this.loadCards();
    }
  },

  cardTouchStart: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置  
        startX: e.touches[0].clientX
      });
    }
  },

  cardTouchMove: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置  
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值  
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变  
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离  
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度  
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项 
      var index = e.currentTarget.dataset.index;
      var group = e.currentTarget.dataset.group;
      var cardList = this.data.cardList;

      if (cardList[group]) {
        cardList[group].cards[index].txtStyle = txtStyle
      }
      //更新列表的状态  
      this.setData({
        cardList: cardList
      });
    }
  },

  cardTouchEnd: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置  
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离  
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮  
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index;
      var group = e.currentTarget.dataset.group;
      var cardList = this.data.cardList;
      if (cardList[group]) {
        cardList[group].cards[index].txtStyle = txtStyle
      }
      //更新列表的状态  
      this.setData({
        cardList: cardList
      });
    }
  },

  onShareAppMessage: function () {
    return {
      title: '卡片创作助手',
      path: '/pages/card/list'
    }
  },
})