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
      wx.setStorageSync('userInfo', e.detail.userInfo); 
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      this.addUserInfo();
    } else {
      console.log(e.detail.errMsg)
    }
  },

  addUserInfo: function(){
    var that = this;
    var d = that.data;
    var openid = wx.getStorageSync('openid');
    console.log('openid: '+openid)
    if(openid){
       d.userInfo.id = openid;
       wx.request({
         url: 'http://localhost:8080/user/save',
         method: 'POST',
         data: d.userInfo,
         success: function (res) {
           console.log(res.data);
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