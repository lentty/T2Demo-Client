//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    normalUser: true,
    myRanking: {},
    rankingList: []
  },
  onLoad: function () {
    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo.status == 1){
      this.setData({normalUser: false});
    }
    var that = this;
    wx.request({
      url: app.globalData.host + '/ranking/list',
      method: 'GET',
      success: function (res){
        console.log(res.data);
        that.setData({
          rankingList: res.data
        });
        that.findMyRanking();
      },
      fail: function (e) {
        wx.showToast({
          title: '数据获取失败',
          icon: 'none',
          duration: 2000
        });
      }
    })
  },
  findMyRanking: function () {
    let myId = wx.getStorageSync('userInfo').id; 
    let status = wx.getStorageSync('userInfo').status; 
    if(status == 1){
      let myRanking = this.data.rankingList.filter(item => item.userId === myId)[0];
      this.setData({
        myRanking: myRanking
      });
    }
  }
})
