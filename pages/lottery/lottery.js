// pages/lottery/lottery.js
import Util from '../../utils/util';
const app = getApp();
const openId = wx.getStorageSync('openid');
const isSessionOwner = wx.getStorageSync('isSessionOwner');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userCount: 1,
    isSessionOwner: isSessionOwner,
    luckyNumber: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: app.globalData.host + '/session/usercount',
      method: 'GET',
      success: function (res) {
        that.setData({userCount: res.data.retObj})
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },
  checkPickNumber: function (evt, luckyNumber) {
    let pickNumber = evt ? evt.detail.value : luckyNumber;
    let isValid = pickNumber && pickNumber >= 1 && pickNumber <= this.data.userCount;
    if (!isValid) {
      this.setData({errorInputMsg: '请输入正确的抽奖号码'});
    } else {
      this.setData({errorInputMsg: ''});
    }
    return isValid;
  },
  submitLuckyNumber: function (evt) {
    let that = this;
    let pickNumber = evt.detail.value.luckyNumber;
    let isVialid = this.checkPickNumber('', pickNumber);
    if (isVialid) {
      wx.request({
        url: app.globalData.host + '/lottery/bet/' + openId + '/' + pickNumber,
        method: 'GET',
        success: function (res) {
          if (res.data.msg === 'ok') {
            let msg = '抽奖号下注成功';
            Util.showToast(msg, 'success', 2000);
            that.stompClient.connect({}, function (sessionId) {
              that.stompClient.subscribe('/topic/lottery', function (body, headers) {
                console.log('From MQ:', body);
              });
              that.stompClient.send("/app/draw", {}, JSON.stringify({ 'msg': '我是客户端' }));

            });
          }
        },
        fail: function (err) {
          console.log(err);
        }
      });
    }
  },

  launchLottery: function (evt) {
    let that = this;
    wx.request({
      url: app.globalData.host + '/lottery/draw/' + openId,
      method: 'GET',
      success: function (res) {
        if (res.data.msg === 'ok') {
          let finalLuckyNumber = res.data.retObj.luckyNumber;
          that.setData({finalLuckyNumber: finalLuckyNumber});
          console.log(finalLuckyNumber);
        }
        //Util.showToast(msg, 'success', 2000);
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //this.initSocket();
  },

  initSocket: function () {
    let socketOpen = false

    function sendSocketMessage(msg) {
      console.log('send msg:')
      console.log(msg);
      if (socketOpen) {
        wx.sendSocketMessage({
          data: msg
        })
      } else {
        socketMsgQueue.push(msg)
      }
    }

    let ws = {
      send: sendSocketMessage
    }

    wx.connectSocket({
      url: 'ws://118.24.246.184:8090/t2-websocket'
    })
    wx.onSocketOpen(function (res) {
      socketOpen = true
      ws.onopen()
    })

    wx.onSocketMessage(function (res) {
      ws.onmessage(res)
    })

    let Stomp = require('../../utils/stomp.min.js').Stomp;
    Stomp.setInterval = function () { }
    Stomp.clearInterval = function () { }
    this.stompClient = Stomp.over(ws);
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
