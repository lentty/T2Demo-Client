//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    rankingList: []
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: app.globalData.host + '/ranking/list',
      method: 'GET',
      success: function (res){
        console.log(res.data);
        that.setData({
          rankingList: res.data
        });
      },
      fail: function (e) {
        wx.showToast({
          title: '数据获取失败',
          icon: 'none',
          duration: 2000
        });
      }
    })
  }
})
