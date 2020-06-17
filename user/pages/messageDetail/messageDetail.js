// user/pages/messageDetail/messageDetail.js
import util from '../../../utils/util.js';
var page = 1;
var limit = 8;
var hasMore = true;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    messageList: []
  },
  initList() {
    var that = this;
    page = 1;
    hasMore = true;
    wx.showLoading({
      title: '加载中',
    });
    util.request('/users/v1.me/getMyMessage', {
      page: page,
      limit: limit,
      type: that.data.type
    }, 'POST').then(res => {
      wx.hideLoading({
        complete: (res) => {},
      });
      wx.stopPullDownRefresh({
        complete: (res) => {},
      });
      if (res.code == 0) {
        if (limit != res.data.list.length) {
          hasMore = false;
        }
        res.data.list.map((item, index) => {
          item.created_at = item.created_at.replace(/-/g, '/');
        });

        that.setData({
          messageList: res.data.list
        });

      }
    });
  },
  moreList() {
    var that = this;
    page++;
    wx.showLoading({
      title: '加载更多',
    });
    util.request('/users/v1.me/getMyMessage', {
      page: page,
      limit: limit,
      type: that.data.type
    }, 'POST').then(res => {
      wx.hideLoading({
        complete: (res) => {},
      });
      if (res.code == 0) {
        if (limit != res.data.list.length) {
          hasMore = false;
        }
        res.data.list.map((item, index) => {
          item.created_at = item.created_at.replace(/-/g, '/');
        });
        that.setData({
          messageList: that.data.messageList.concat(res.data.list)
        });

      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1;
    limit = 8;
    hasMore = true;
    this.setData({
      type: options.type
    });
    if (options.type == 1) {
      wx.setNavigationBarTitle({
        title: '系统消息',
      });
    } else if (options.type == 2) {
      wx.setNavigationBarTitle({
        title: '今日推荐',
      });
    } else {
      wx.setNavigationBarTitle({
        title: '交易信息',
      });
    }

    this.initList();
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
    this.initList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (hasMore) {
      this.moreList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})