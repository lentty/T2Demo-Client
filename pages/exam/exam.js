// pages/exam/exam.js
import Util from '../../utils/util';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions: [],
    answers: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: app.globalData.host + '/exam/load/question/' + options.sessionId,
      method: 'GET',
      success: function (res) {
        if (res.data.msg === 'ok') {
          that.setData({ questions: res.data.retObj });
        }
      }
    })
  },
  handleAnswerChange: function (evt) {
    let quesIndex = evt.currentTarget.dataset.quesindex;
    let questionId = this.data.questions[quesIndex].id;
    let answer = evt.detail.value;
    this.data.answers[questionId] = answer;
    this.setData({answers: this.data.answers});
    // strore my answer
    this.data.questions[quesIndex].myAnswer = answer;
  },
  submitExam: function () {
    let that = this;
    let isValid = this.validateAnswers();
    if (!isValid) {
      Util.showToast('还有题目未作答', 'none', 2000);
    } else {
      wx.request({
        url: app.globalData.host + '/exam/submit',
        method: 'POST',
        data: {
          userId: app.globalData.openId,
          answerMap: this.data.answers
        },
        success: function (res) {
          if (res.data.msg === 'ok') {
            let msg = '答对题数: ' + res.data.retObj.points;
            Util.showToast(msg, 'success', 2000);
            that.setData({correctAnswerMap: res.data.retObj.answerMap})

            // put correct answer into this.data.questions
            that.data.questions = that.data.questions.map((question) => {
              question.correctOption = that.data.correctAnswerMap[question.id];
              return question;
            });
            that.setData({ questions: that.data.questions});
          }
        },
        fail: function (error) {
          console.log(error);
        }
      })
    }
    console.log(this.data);
  },

  validateAnswers: function () {
    let isValid = true;
    for (let i=0; i<this.data.questions.length; i++) {
      let question = this.data.questions[i];
      if (!this.data.answers.hasOwnProperty(question.id)) {
        isValid = false;
        break;
      }
    }
    return isValid;
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
