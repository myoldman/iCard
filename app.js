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
    bgImages: [
      { width:56, height:28, data:"",color:"#FFF"},
      { width: 56, height: 28, data: "", color: "#F8F2E2" },
      { width: 215, height:215, data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANcAAADXBAMAAAB7U9mGAAAAGFBMVEXw8PDy8vL09PT29vbt7e3r6+v4+Pj7+/v9bAgbAAAOsUlEQVR42rxaS5cyNRC9VQm4rUqacVuVbsZtukHX6QZ1C+PoGsbHWv3/C8/xddTxNSLfD4ADSe6j7i0AGNe+0AU2gA5Aqh1maZ657w9cNJJPBUHCZxTYEwslk7XjwVTWulgWrnaESqXMaUZ39pF0Z8RzKGXNzBOmXDFsBSJQW2OjulaHfUsukpl6CSeFf5SSmHazDZ3WknSridal2Bm8HFFT0dXjwJZmG21BSIWTKuIwTIma8r5JeoR/THICkWCvH5FQgM270Op3e4S8UoY/FomjgE2vQl35kNL0BDfb1Rdf0tj1R0OCUGZK4+BpkeL87B0gi8p5IjLTMaTEJjs0PdkASHcASEGQsB+HTtPYezGR/iufQB8CZJDO6UlYHyKGWVyu/FBo6gJA8zNExLQfHaRbW60F3XPKc74opHLMdR/eyw1jPeFS0mVVzhIBI55EJ+CBH6pNGD82nuKyUrJCZ1FwjbkwTXhsSIxZ5r6oIJSUpb9wG3Kww35UeXz5GEV0H60O2jzl7+WSDHgHp5dpllSLCDQ9dB0VnHO1klM4ZLukskrsIPb3TKTDATp+WKs3NH9o55IxiYQiIyk7hnkfEaHDGO0ZW2yF0fgkPJJ9BVL9wNeKlovgYUODqVauHLCc7MsX1i1OQbkLCSxJ5LzSIUnB81wP3pCYlOgap5cFKmQz0kjwEBYW6a6coNNCKNNcGPYgakh8gaugiCwsRSBaVfl7vxiirVrzyqaQC4KtrW3TJ6rXXmyVbKRz3zMLzfalPStMasUT5cipoA6E8xUqu01T1pEfE0/ZXUHALK5CxFaYaX04NGAcCo09YnnMUuK3cNJKI3fEz4UoYU5Cg43CAusi1ovYV+McmxG3/gGcWqn2Z9eDN3z21qut+LgbISUnlJlIZ7YDo+4KnnViHhVrqBqj7JjmPYqRnPun5LZX/8xYkSSIhFK3z7MAc0A5QrvNYFA69Yv4riLJx3TKAG4Czko1ka6CSvHz4uDUT50eJ5bUY/4jEwKmERDu0TWW8TxsFwd7NpQgsSrMpXwms3mGlPN04Ksc7GsoyoJYSis+MBVVhtAzJfVkKJ+cpTsfhNhH40FEOymxGkZFkXgan+jjbAmpVOwrrWSJnaKwFNVGbHviray7G8lNleYADfioRarxs3igajIQYEgbLS6FssI5doQVkJzXUD1mKF1PaSHN6GE1bnn9kXk6rTCKt9Hg5LSSc5qdbXXMcRIoN5iLCMZ00PejI83OJA2EUukID5u0PBdB0QlsIw4kzMrbMSbWSrzNQ33UOK1PJDwYljJwSc2Sqxhh09STFvBwwc/HGcJkqzmb9Sq4kCYY99W63LhAV+lDLynMaTPBhRwjYer586MCUSoPjXR+WkCy4b1z3oE8njZUIViusn/IZLEBcXfhZFySz327CFNKmaOEi4o1gY3/36VWJK/BCZMHUSnCx9waGqWDLKvGJz7DIraEXtK6QTV9L1eJNHlfjlEoyDSLYuG0onZBEN7p7KKf5SErzRKGsZuANO9CEFxhI7+IiAorC2umqhCuOpOP8vH/+ICAe/sOUhd3JlMSvGLB+wkckKCUYwWxsp674/kghSYuYyvpcH2eYBownp9gspGJMSKGtpkF7G2JewoqZ05JJn9fOTbSs/uBT7XxOmHREkgxX8fHhVjwpw5vU0zbIiVGWs9wKUSP5Vi49k7pUM+oRkQUD+ViZHknqaHrmY9/j1rcgBuSjF1aBvuwDPmEU1xIVAF9GLpsIkya9sqqEClsZjgHk9k2/O1Gnh7YH/G0VTQwpHfKBrr4lxwsdE/o7WhnSWwbJUGPeTLLxl+BzKLGNLkCk/vIH2HguU5xd1Dlb4YTO+W2AHdRLkJ81DBfa8IRSjWMQ1nCCb8Q19dK99ZRwz+p3v+Iw4pqacSHJJyv7kx6TDzPmd3TWU1eSlkJhqEFKi5PL63QkEKKhrGYuwqW5eDWkfRHonLh7qQrQBSalJNYItEBQ5DxSBXVhlkGMCsRgg6jfrsIDUnuIeE3atWbrhym2r8j7wj8hS9P09BmyBgGJYnmdurWwIh+7JLSZpzmUTrFdNCDgYZc69iorEgxopannRUslbRlptYn+HO02fAneHgq84dY4WhKKiB9meeJ6H84A8h2MVGL6khLUDiYWsNXzutDJ0eGDDxe4AP3TOrXuSVb6Y7ZR9uP05qKna0IpMj3RNRipZw/C9whsn61+p0246avepvMCwgvQi+kuHaFRvQ/ykSAVh+EPk5ZNE+QQaZiF7Pegu/Ay/mpUBedrTX5SljZJL0Mi/U8iQ67lQSGiMhxemQk2o00gBpWEt1MpPclxtrU8wh1S10hOsNHRen/L1OEP9E4HUtyzfV/j0iAOImK0OdISs2ADlWuWjRKr7vU0a6Sn2PiSV0d0zQC2/gRt25IRb4QDvLoRKRwcbjWTELoqZOUNZ5VOqkkNXyFJniDkbgVkQ1/OwWre102xbhKDlAOUCirzc0E2wrC6ElTHpMe5UwP2pAOs0tymiN9JEZIXloNKJFIQC1qZK1l2tfi0lIuhhEfVqlFzaHlf3uvgv8n4FhU/9lfGNj3krTR2qzMSsVM9Fzik0J43iqzcqdoiCrkMx/1tAiRhH70FJmLmYmDyichP1Y2NJ+knWYqOwTyakzGc2efEqECSYnejYICVK3j0XjTlpg6RCpYWo/iFM3ZQZRJ5YPywMCC58gZhYTWwISXyOfhqg9pZJxLkE2aqjm6tJ5WszCFgJVpbV4scBPcj+tf6119Z+zRnb3ezy2+PjEg9ZjfWXRr7xBo8JHe1SADdNLylSFU0hBQ2ZrouuBw7MBFxKaeUPJM3kFemAeVVJhok+xjF8KQzmIuPksEZkXqZJg30SGKaZfUmpXCTCxI9m5n6jeg59a00PDb7KBDspNKkMDbfmKLPbT7/ygGeDW63PH94w31ys1vFncLxl4PG4IbiOit1G243+N7HdLgVoJ4wzUAv/c/Lxb3c0Nx4lCq/N+e4W+CrdS4jaFrmZ4JoW8W59QvKgojmWj8DKtdkjfkUXgXU6A3tGTR4IvJRjircKmHj+AFxUuX9muCqXu1GR+RciRwyCrs+DhsrDtPZFR6hAPkHG2ehc3ZtYOU0KSccZ3pWAEVCGF3SHO7AUlvTmoa/t8oTL7a74GQFsupYinXke1TsGhGFsMrqr8f2tod+5fXdI5QI22YG9VOqWcnRNeNTBQTnT6g88r/vwoW96tgXvfL2Ly7PAn4G1zM2qcpFSL+aMmGfAISiBbZOFwvjY/KuhZ/seytAt2mERFT2iWBpiecrqCPZ/+15McbOOnWjFygQOmiHZqMuhJ3D0W/EztCNyl1dRsi7GrRk1WV+JDTVyZOOXlR3QEI8tLZA5gbugrq/2aSNfz7aHLTBNOecdSydyVhaLC8qfhsdDISrQdAXHyjx4+7kS1b6Tv24aPNwZikAnebpF8nP4YbqvY3hwx4hab7bWsAwFnVVE6jctl0ReBl53N3MKdSoxIo4UJnlWsSfu+mEfwONfFf9prAx/VYMxM3AYP8nIqy6SgsNjfBCVTELqTdXEluW7GQG3jhzcs/F+y8IoCNNwkOrDoCsyQ8EbuQQv+/2M7wSqDuWJUgeRb4k0ihu//JO87sr8u3V3XLPaGA+8XPr3kJX73L7viGn/5WSj3hDfbi1oYSYFjCoEv8ViQweut2mqQPa1GlqtawcfOPVcZD244ayg2tA94m9bdJLd5ho2W37CuexTi9OA4KFHpQ6NKftN8aJw67dem812W/gIyg1dTw6uTvBziBvMPFK7xSnftFnfKGvOHmmUDwn8qp/N/cBIzpSglkj2DVlHL0p4KeqFYSqyQknmLHBP4MkJDU1Xfq3bwSvXagYZ+UivybRBZvWGi6OZTET93n8i5WDIC7Lau9ThqAN/jqW1kFuMdsFH7o5eyR24aBKPwtJKVegJLrBamkpmTPpKWlmdRS7APYk/vfIelQgKORYi4OoB+ABPD2vW+x21kQua7MVsr0Iu8R+i38txO1D2N4kAtmahdUT5T9wd0zGHED2Ws/6IKj61e7G81g/U1Unkk7fbUhp5h0NQxKuJw/9nJ67fNm6VTovth+Edsamp0vYQR/w7YIVwqN0wC6nRO9XqgNZe78RT9VOuC4Jzfrmtr1pjNz4gaOKtWz9HOnodXGGJMoN1PYZfOuy0J0joWjnA8xh3H8lKidpDXyO4XtNa62L+Et6tGu4OLAzTuvyhLo8+rfCEPMP/M36W+YpZCCdHrI1ot7KmPcUZ4O6RT3OfT6/RQnZJ3jpjN9/F9ecPna+cFPbAPItJJvMWV9DYfukKfOSSvg3l5RViVz+Mv+43D8Q886dHm9WWsaRsbUfdkLMkps7C4gR/zj8HLg4Vch1TmZfx5YfH/FH0YtqrbYrw2IW6ojyi/+NIpQcWfmFPf3vQg8hdjsFZloRn53TNzdOLlFzKLqk55/7E0iaa0yqAYdXyyL/NJs0u1Nw7BPNue/GTdxkTwt2RUBLgHnvBemzOHOTqm84u7HFfJHKWW4P3FediD/JkUrRUqD0J/qc35RyUQl5B0RCtyCnlryGhYUrpNiWWxj2keiinLOEoXdRbIupmPxx1xKgxNFk/hfpYEL6zqvaqjoAcfzDR4si08piITj1qbzWlJ8VklJ7qQ/wQ9eqMtnbjXELRwKTcwVR15BOdXCcBwolfXmSNSj7fQ3+HVb1nOOv0It9jypXQQPlThzLHpbhYK2STbC/Bx7AHtGcVb9KTZqY9ft52l6BVUN6/i14Btl42tQypdpcndDRhoShxdKmuWPsNGJSquFjTtkXnZMKPrLPYeHL9SUj7IWSrNAK26gHBjut8spb6vQKqoe/arNOmAxKqHpJ0hAGhr7JVH0L52MMgD/KJ6GsK1RhQx+Bb2i0kzM0Vak3tLNCzdVGW6Ko36pR/xd9kK5VseHZ3MkLsnc/KJRRm129wlUiYDjVY4sfLvJ5kklrg7vornT/tOGfExR0djnYMR2FfyE2xOqTysFRnrytYVXjMZmS42/6wlkWhnJgfEAAAAASUVORK5CYII=', color: "" },
    ],
    currentBg: 1,
    maxBg: 3,
    userInfo: null,
    width: wx.getSystemInfoSync().windowWidth,
    height: wx.getSystemInfoSync().windowHeight,
  }
})