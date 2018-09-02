// pages/uploadQuestion/uploadQuestion.js
import Util from '../../utils/util';

const app = getApp();
const openId = wx.getStorageSync('openid');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: app.globalData.host + '/question/load/' + openId,
      method: 'GET',
      success: function (res) {
        if(res.data.msg === 'ok') {
          that.setData({ questions: res.data.retObj });
        }
      }
    })
  },

  addQuestion: function () {
    if (this.data.questions.length >=3) {
      Util.showToast('最多只能添加3道题呢', 'none', 2000);
    } else {
      wx.navigateTo({
        url: 'editQuestion',
      })
    }
  },

  editQuestion: function (evt) {
    let quesIndex = evt.target.dataset.quesindex;
    let quesInfoStr = JSON.stringify(this.data.questions[quesIndex]);
    wx.navigateTo({
      url:'editQuestion?quesInfoStr=' + quesInfoStr
    })
  },

  deleteQuestion: function (evt) {
    let that = this;
    let quesIndex = evt.target.dataset.quesindex;
    let quesId = this.data.questions[quesIndex].id;
    wx.request({
      url: app.globalData.host + '/question/delete/' + openId +'/' + quesId,
      method: 'DELETE',
      success: function (res) {
        if (res.data.msg === 'ok') {
          Util.showToast('删除成功', 'success', 2000);
          that.data.questions.splice(quesIndex, 1);
          that.setData({ questions: that.data.questions });
        } else {
          Util.showToast('操作失败', 'none', 2000);
        }
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },

  publishQuestions: function () {
    console.log('publish questions');
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