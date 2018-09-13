// pages/notice/notice.js
import Util from '../../utils/util';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: app.globalData.host + '/announcement/list',
      method: 'GET',
      success: function (res) {
        if (res.data.msg === 'ok') {
          that.setData({ notice: res.data.retObj[0]})
        }
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },

  editAnnouncement: function () {
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo.status === 2) {
      wx.navigateTo({
        url: 'editNotice?noticeCont=' + this.data.notice.content,
      })
    }
    wx.navigateTo({
      url: 'editNotice?noticeCont=' + this.data.notice.content,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
