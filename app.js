//app.js
import Util from 'utils/util';
App({
  globalData: {
     //host: 'http://localhost:8090',
     // wshost:'localhost:8090',
     host: 'http://118.24.246.184:8090',
     wshost: '118.24.246.184:8090',
     isSessionOwner: false,
     openId:''
  },
  data: {
    appid: 'wx65da69f2afcc249c',
    appsecret: 'bb2ac57a66ac2919a0d59c9a6f001c1d',
    api: 'https://api.weixin.qq.com/sns/jscode2session?'
  },
  onLaunch: function () {
    console.log('app::onLaunch')
    var openid = wx.getStorageSync('openid');
    if (openid == '') {
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
                  that.globalData.openId = res.data.openid
                  wx.setStorageSync('openid', res.data.openid);
                  that.setSessionOwner(res.data.openid);               
                }
              }
            })
          }
        }
      })
    } else {
      this.globalData.openId = openid
    }
  },

  onShow: function(){
    console.log('app::onShow')
    var openid = wx.getStorageSync('openid');
    if(openid){
      this.setSessionOwner(openid);
    }
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
          } else {
            that.globalData.isSessionOwner = false;
          }
        } else {
          that.globalData.isSessionOwner = false;
        }
        console.log('app::onshow::isSessionOwner:' + that.globalData.isSessionOwner)
        if (that.isSessionOwnerCallback) {
          that.isSessionOwnerCallback(that.globalData.isSessionOwner)
        }
      }
    })
  }
})