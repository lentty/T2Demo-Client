// pages/home/home.js
import Util from '../../utils/util';
const app = getApp();
const openId = wx.getStorageSync('openid');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    isSessionOwner: false,
    isCheckinModalHidden: true,
    isGenerateCodeModal: true,
    checkinCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      isSessionOwner: app.globalData.isSessionOwner
    });
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    if (e.detail.userInfo) {
      this.addUser(e.detail.userInfo);
    } else {
      console.log(e.detail.errMsg)
    }
  },

  addUser: function (user) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    console.log('openid: ' + openid)
    if (openid) {
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

  generateCode: function (event) {
    var that = this;
    let isValidTime = this.validateCheckinTime();
    if (isValidTime) {
      wx.request({
        url: app.globalData.host + '/checkin/code/' + openId,
        method: 'GET',
        success: function (res) {
          console.log(res.data);
          if (res.data.msg == "ok") {
            var code = res.data.retObj;
            that.setData({ checkinCode: code });
            that.setData({ isGenerateCodeModal: false });
          }
        },
        fail: function (e) {
          console.log('Failed to get checkin code');
        }
      })
    } else {
      wx.showToast({
        title: '别慌，还没到签到时间',
        icon: 'none',
        duration: 1000
      })
    }
  },

  changeCheckinCode: function () {
    let that = this;
    wx.request({
      url: app.globalData.host + '/checkin/code/' + openId,
      method: 'GET',
      success: function (res) {
        console.log(res.data);
        if (res.data.msg == "ok") {
          var code = res.data.retObj;
          that.setData({ checkinCode: code });
        }
      },
      fail: function (e) {
        console.log('Failed to get checkin code');
      }
    });
  },

  saveChenkinCode: function () {
    let that = this;
    this.setData({ isGenerateCodeModal: true });
    wx.request({
      url: app.globalData.host + '/checkin/confirm/' + openId + '/' + that.data.checkinCode,
      method: 'GET',
      success: function (res) {
        if (res.data.msg === 'ok') {
          wx.showToast({
            title: '操作成功',
            duration: 2000
          })
        } else if (res.data.msg === 'checked_in') {
          wx.showToast({
            title: '口令已生成，请勿重复操作',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '操作失败，请重试',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (error) {
        wx.showToast({
          title: '操作失败，请重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  cancelGenerateCode: function () {
    this.setData({ isGenerateCodeModal: true });
  },

  checkIn: function () {
    let isValidTime = this.validateCheckinTime();
    if (isValidTime) {
      this.setData({ 'isCheckinModalHidden': false });
    } else {
      wx.showToast({
        title: '别慌，还没到签到时间',
        icon: 'none',
        duration: 1000
      })
    }
  },
  // valid time: Tuesday 12:30 ~ 13:30
  validateCheckinTime: function () {
    let isValid = true;
    let date = new Date();
    if (date.getDay() !== 2) {
      isValid = false;
    } else if (date.getHours() < 12 || date.getHours() > 13) {
      isValid = false;
    } else if (date.getHours() === 12 && date.getMinutes() < 30) {
      isValid = false;
    }
    return isValid;
  },
  cancelCheckin: function () {
    this.setData({ isCheckinModalHidden: true });
  },
  submitCheckinCode: function () {
    let that = this;
    this.setData({ isCheckinModalHidden: true });
    if (openId) {
      wx.request({
        url: app.globalData.host + '/checkin/' + openId + '/' + that.data.checkinCode,
        method: 'GET',
        success: function (res) {
          if (res.data.msg === 'ok') {
            wx.showToast({
              title: '签到成功',
              duration: 2000
            })
          } else if (res.data.msg === 'checked_in') {
            wx.showToast({
              title: '已签到，请勿重复操作',
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '签到失败，请核对口令',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function (error) {
          wx.showToast({
            title: '签到失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  onCodeInputBlur: function (evt) {
    this.setData({ checkinCode: evt.detail.value })
  },
  validateLotteryDrawTime: function () {
    let isValid = true;
    let date = new Date();
    if (date.getDay() !== 2) {
      isValid = false;
    } else if (date.getHours() < 13 || date.getHours() > 14) {
      isValid = false;
    }
    return isValid;
  },
  handleLotteryClick: function () {
    let isTimeValid = this.validateLotteryDrawTime();
    if (!isTimeValid) {
      let msg = '还未到抽奖时间';
      Util.showToast(msg, 'none', 2000);
      return;
    }
    wx.request({
      url: app.globalData.host + '/lottery/validate/' + openId,
      method: 'GET',
      success: function (res) {
        if (res.data.retObj) {
          wx.navigateTo({
            url: '../lottery/lottery',
          })
        } else {
          let errMsg = '签到完再来抽奖哦';
          Util.showToast(errMsg, 'none', 2000);
        }
      },
      fail: function (err) {
        console.log(err);
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