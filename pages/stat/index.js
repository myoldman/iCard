import initCalendar, { getSelectedDay, jumpToToday } from '../../template/calendar/index';
const util = require('../../utils/util.js')

const app = getApp()
function getNoRepeat(s) {
    return s.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g, "$1$2$4").replace(/,,+/g, ",").replace(/,$/, "").split(",");
} 
function getPreDay(s) {
  var day = new Date(s);
  var y = day.getFullYear();
  var m = day.getMonth() + 1;
  var d = day.getDate();
  var pre = new Date(y, m-1, d - 1);
  var yy = pre.getFullYear();
  var mm = pre.getMonth() + 1;
  var dd = pre.getDate();
  mm = mm > 10 ? mm : "0" + mm;
  dd = dd > 10 ? dd : "0" + dd;
  return yy + "-" + mm + "-" + dd;
}

function GetDateStr(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期 
  var d = dd.getDate();
  m = m > 10 ? m : "0" + m;
  d = d > 10 ? d : "0" + d;
  return y + "-" + m + "-" + d;
} 

Page({
  data: {
    userInfo: app.globalData.userInfo,
    loading : true,
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
  },

  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({ userInfo: app.globalData.userInfo })
    if (this.data.userInfo != null && this.data.userInfo.id != null && this.data.userInfo.id > 0) {
      var that = this
      wx.request({
        url: app.globalData.urlbase + 'userInfo/getUserStat',
        data: { userid: this.data.userInfo.id },
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.res == 0 && res.data.cardStats.length > 0) {
            var cardStats = res.data.cardStats;
            var totalLength = 0;
            var dayLength = 0;
            var totalDays = 0;
            var latestDays = 0;
            var selectedDays = [];
            var selectedDaysNorepeat = [];
            const date = new Date();
            const todayYear = date.getFullYear();
            const todayMonth = date.getMonth() + 1;
            const todayDate = date.getDate();
            var last_date = "";
            for(var i = 0;i< cardStats.length; i++) {
              var cardStat = cardStats[i]
              if(i == 0 ) {
                latestDays++;
              } else {
                var preDay = getPreDay(cardStat.create_date)
                if (preDay == last_date){
                  latestDays++
                } else if (last_date == cardStat.create_date)
                {
                  // 同一天写了多个文章不做处理
                } else {
                  latestDays = 1
                }
              }
              last_date = cardStat.create_date;
              totalLength += cardStat.card_length;
              var ceateDate = new Date(cardStat.create_date)
              if (todayYear == ceateDate.getFullYear() && todayMonth == ceateDate.getMonth() + 1 && todayDate == ceateDate.getDate()) {
                dayLength += cardStat.card_length;
              }
              var selectedDay = {
                day: ceateDate.getDate(),
                choosed: true,
                year: ceateDate.getFullYear(),
                month: ceateDate.getMonth() + 1,
              }
              selectedDays.push(selectedDay)
              selectedDaysNorepeat.push(cardStat.create_date)
            }
            var todayStr = GetDateStr(0)
            var yesterdayStr = GetDateStr(-1)
            if (last_date != todayStr && last_date != yesterdayStr) {
              latestDays = 0;
            }
            selectedDaysNorepeat = getNoRepeat(selectedDaysNorepeat);
            totalDays = selectedDaysNorepeat.length;
            that.setData({ totalDays: totalDays, totalLength: totalLength, dayLength: dayLength, "calendar.selectedDay": selectedDays, latestDays: latestDays})
            initCalendar({
              multi: true,
              allSelectedDays: [],
              afterTapDay: (currentSelect, allSelectedDays) => {
                console.log('当前点击的日期', currentSelect);
                allSelectedDays && console.log('选择的所有日期', allSelectedDays);
                console.log('getSelectedDay方法', getSelectedDay());
              },
            });
          } else {
            that.setData({ latestDays:0, totalDays: 0, totalLength: 0, dayLength: 0, "calendar.selectedDay": [] })
          }
          wx.hideLoading();
          that.setData({ loading: false})
        },
        fail: function (res) {
          wx.hideLoading();
          that.setData({ loading: false })
        },
        complete: function (res) {
        }
      })
    }

  },
  /**
   * 跳转至今天
   */
  jump() {
    jumpToToday();
  }
})