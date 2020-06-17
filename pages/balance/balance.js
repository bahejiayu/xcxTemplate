// pages/balance/balance.js

import util from '../../utils/util.js';
var page = 1;
var limit = 15;
var hasMore = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type_: '',
    balList: [
    ],
    balInfo: {}
  },
  togType(e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration:0
    });
    this.setData({
      type_: e.currentTarget.dataset.type
    });
    this.initData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1;
    limit = 15;
    hasMore = true;

    this.initData();
  },
  initData() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    page = 1;
    util.request('/users/v1.me/myWallet', {
      page: page,
      limit: limit,
      type: that.data.type_
    }, 'POST').then(res => {
      console.log(res)
      wx.hideLoading({
        complete: (res) => {},
      });
      wx.stopPullDownRefresh({
        complete: (res) => {},
      });
      hasMore = true;


      if (res.code == 0) {
        if (res.data.list.length != limit) {
          hasMore = false;
        }
        res.data.list.map((item,index)=>{
                item.created_at= item.created_at.replace(/-/g,'/');
        });
        that.setData({
          balInfo: res.data,
          balList: res.data.list
        });
      }
    });

  },
  moreData() {
    var that = this;
    wx.showLoading({
      title: '加载更多',
    });
    page++;
    util.request('/users/v1.me/myWallet', {
      page: page,
      limit: limit,
      type: that.data.type_
    }, 'POST').then(res => {
      console.log(res)
      wx.hideLoading({
        complete: (res) => {},
      });
      wx.stopPullDownRefresh({
        complete: (res) => {},
      });
      if (res.code == 0) {
        if (res.data.list.length != limit) {
          hasMore = false;
        }
        that.setData({
          balInfo: res.data,
          balList:that.data.balList.concat(res.data.list) 
        });
      }
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
    var that=this;
    util.request('/users/v1.me/myWallet', {
      page: page,
      limit: limit,
      type: that.data.type_
    }, 'POST').then(res => {
      if (res.code == 0) {
        that.setData({
          balInfo: res.data,
        });
      }
    });
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
    this.initData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      if(hasMore){
            this.moreData();
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})