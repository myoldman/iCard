//logs.js
var WXBizDataCrypt = require('../../utils/RdWXBizDataCrypt.js');
//var AppId = 'wx6136481aa72e3ce3'
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
    showClear: false,
    searchText: '',
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
    searchFocus: false,
    pageIndex: 1,
    pageCount: 8,
    opacity: 1,
    noDataText: '还没有卡片',
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

  createCard: function () {
    wx.navigateTo({
      url: '../card/createMd'
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
            url: app.globalData.urlbase + 'userInfo/deleteUserCard',
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

  viewCard: function(e) {
    wx.navigateTo({
      url: 'view?cardId=' + e.currentTarget.dataset.id,
    })
  },
  
  loadCards: function () {
    var that = this
    wx.request({
      url: app.globalData.urlbase + 'userInfo/getUserCards',
      data: { userid: app.globalData.userInfo.id, pageIndex: this.data.pageIndex, pageCount: this.data.pageCount, searchText: this.data.searchText },
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
          var noDataText = '还没有卡片'
          if (that.data.searchText.length > 0) {
            noDataText = '没有搜索到卡片'
          }
          that.setData({ noDataText: noDataText, noData: true, noMore: false, showFooter: true });
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
    var sysInfo = wx.getSystemInfoSync()
    this.setData({ height: sysInfo.windowHeight, width: sysInfo.windowWidth })
  },
  getCompleteUserInfo: function (userInfo, hideLoading) {
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
        app.globalData.userInfo = userInfo;
        wx.startPullDownRefresh({})
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
            console.log(res);
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
                  if (that.data.needAuth) {
                    //如果需要授权则显示授权页面
                    that.setData({ showAuth: true })
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
      that.getDecryptUserInfo(null);
    } else {
      wx.startPullDownRefresh({})
      wx.hideLoading();
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

  bindKeyInput: function (e) {
    this.setData({
      searchText: e.detail.value
    })
    var inputLength = e.detail.value.length;
    inputLength == 0 ? this.setData({ showClear: false }) : this.setData({ showClear: true })
  },
  // 清空输入框的内容
  // 聚焦函数:如果字符串长度为0，则不显示清空图标，否则显示清空图标。
  bindKeyFocus: function (e) {
    var inputLength = e.detail.value.length;
    inputLength == 0 ? this.setData({ showClear: false }) : this.setData({ showClear: true })
    this.data.searchText == 0 ? this.setData({ showClear: false }) : this.setData({ showClear: true })
  },
  // 非聚焦函数：隐藏清空图标
  bindKeyBlur: function (e) {
    //this.setData({ showClear: false});
    //if(e.detail.value.length > 0) {
    //}
  },
  // 点击图标清空
  clearInput: function (e) {
    console.log("clear")
    this.setData({ searchFocus: true, searchText: '', showClear: false })
  },

  searchCards: function (e) {
    this.setData({
      searchText: e.detail.value
    })
    //if (e.detail.value.length > 0) {
    wx.startPullDownRefresh({
    })
    //}
  }
})