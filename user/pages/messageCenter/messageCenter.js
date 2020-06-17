// user/pages/messageCenter/messageCenter.js


import util from '../../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    messageList: [],
    allRead: false
  },
  initData() {
    wx.showLoading({
      title: '加载中',
    });
    var that = this;
    util.request('/setting/v1.set/getMesList', {}, 'POST').then(res => {
      wx.hideLoading({
        complete: (res) => {},
      });
      wx.stopPullDownRefresh({
        complete: (res) => {},
      });

      if (res.code == 0) {
        res.data.fast.map((item, index) => {
         if(item.list){
          item.list.created_at = item.list.created_at.replace(/-/g, '/');
         }
        });
        var read_= res.data.fast.every((item, index) => {
            return item.no_num==0
        });

        console.log(read_)

        that.setData({
          messageList: res.data.fast,
          allRead:read_
        });
      }

    });


  },
  allEven(e){

      if(e.currentTarget.dataset.type=='b3'){
          this.setData({
            allRead:true
          });
          this.initData();
          util.request('/setting/v1.set/setAllRead',{},'POST');

      }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
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
      this.initData();
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