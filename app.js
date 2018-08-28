//app.js
import Util from 'utils/util';
App({
  globalData: {
    // host: 'http://localhost:8090',
    host: 'http://118.24.246.184:8090',
    isSessionOwner: false
  },
  data: {
    appid: 'wx65da69f2afcc249c',
    appsecret: 'bb2ac57a66ac2919a0d59c9a6f001c1d',
    api: 'https://api.weixin.qq.com/sns/jscode2session?'
  },
  onLaunch: function () {
    var openid = wx.getStorageSync('openid');
    if (!openid) {
      var that = this
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            var d = that.data;
            var url = d.api + 'appid=' + d.appid + '&secret=' + d.appsecret + '&js_code=' + res.code + '&grant_type=authorization_code';
            console.log('url: ' + url);
            wx.request({
              url: url,
              method: 'GET',
              success: res => {
                console.log(res.data);
                if (res.data.openid) {
                  wx.setStorageSync('openid', res.data.openid);
                  that.setSessionOwner(res.data.openid);
                }
              }
            })
          }
        }
      })
    }
  },

  onShow: function(){
    var openid = wx.getStorageSync('openid');
    this.setSessionOwner(openid);
  },

  setSessionOwner: function (openid) {
      var currentDate = Util.getCurrentDate();
      console.log('currentDate:' + currentDate);
      var that = this;
      wx.request({
        url: that.globalData.host + '/session/' + currentDate,
        method: 'GET',
        success: function (res) {
          console.log(res.data);
          if (res.data.msg == "ok") {
            var sessionOwner = res.data.retObj.owner;
            if (openid == sessionOwner) {
              that.globalData.isSessionOwner = true
              console.log('global data isSessionOwner:' + that.globalData.isSessionOwner);
            } 
          }
        },
        fail: function (e) {
          console.log('Failed to set session owner');
        }
      })
  }
})