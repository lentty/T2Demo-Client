// pages/home/home.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var userInfo = wx.getStorageSync('userInfo');
    console.log('userInfo: ' + userInfo);
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    } 
  },

  getUserInfo: function(e) {
    console.log(e)
    if (e.detail.userInfo) {
      this.addUser(e.detail.userInfo);
    } else {
      console.log(e.detail.errMsg)
    }
  },

  addUser: function(user){
    var that = this;
    var openid = wx.getStorageSync('openid');
    console.log('openid: '+openid)
    if(openid){
       user.id = openid;
       wx.request({
         url: app.globalData.host + '/user/save',
         method: 'POST',
         data: user,
         success: function (res) {
           console.log(res.data);
           that.setData({
             userInfo: user,
             hasUserInfo: true
           })
           wx.setStorageSync('userInfo', user);
         },
         fail: function (e) {
           wx.showToast({
             title: '登录失败',
             icon: 'none',
             duration: 2000
           });
         }
       })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})