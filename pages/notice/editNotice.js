// pages/notice/editNotice.js
import Util from '../../utils/util';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({content: options.noticeCont});
  },

  saveNotice: function (evt) {
    let content = evt.detail.value.noticeCont;
    wx.request({
      url: app.globalData.host + '/announcement/edit',
      method: 'POST',
      data: {
        content: 'leetcode 208',
        createdBy: app.globalData.openId,
        lastModifiedBy: app.globalData.openId
      },
      success: function (res) {
        if (res.data.msg === 'ok') {
          Util.showToast('保存成功', 'success', 1000);
          setTimeout(function () {
            wx.redirectTo({
              url: 'notice',
            })
          }, 1000);
        }
      },
      fail: function (error) {
        console.log(error);
      }
    })
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