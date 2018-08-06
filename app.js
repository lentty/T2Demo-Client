//app.js
App({
  globalData: {
    host: 'http://localhost:8090'
  },
  data: {
    appid: 'wxb0f25ab0f0fe1a2f',
    appsecret: 'df5cd9d92cd000596b1ba7e76c363fce',
    api: 'https://api.weixin.qq.com/sns/jscode2session?'
  },
  onLaunch: function () {
   var that = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.code){
          var d =  that.data;
          var url = d.api+ 'appid=' + d.appid + '&secret=' + d.appsecret + '&js_code=' + res.code + '&grant_type=authorization_code';
          console.log('url: '+url);
          wx.request({
            url: url,
            method: 'GET',
            success: res => {
              console.log(res.data);   
              if(res.data.openid){
                wx.setStorageSync('openid', res.data.openid); 
              }   
            }
          })
        }
      }
    })
  }
})