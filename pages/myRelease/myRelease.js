// pages/myRelease/myRelease.js
import util from '../../utils/util.js';

var page = 1;
var limit = 6;
var hasMore = true;


Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: '0',
    reList: []
  },
  delItem(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除',
      success(res) {
        wx.showLoading({
          title: '删除中',
        });
        if (res.confirm) {
          util.request('/users/v1.me/deleteRelease', {
            id: e.currentTarget.dataset.id
          }, 'POST').then(res => {
            wx.hideLoading();
            if (res.code == 0) {
              wx.showToast({
                title: '删除成功',
                icon: "none"
              });
              that.initData();
            } else {
              wx.showToast({
                title: res.msg,
                icon: "none"
              });
            }
          });


        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  togType(e) {
    this.setData({
      type: e.currentTarget.dataset.type
    });
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    this.initData();


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1;
    limit = 6;
    hasMore = true;
    this.initData();
  },
  initData() {
    page = 1;
    hasMore = true;
    wx.showLoading({
      title: '加载中'
    });
    var that = this;
    util.request('/users/v1.me/myRelease', {
      page: page,
      limit: limit,
      book_status: that.data.type
    }, 'POST').then(res => {
      console.log(res);
      wx.hideLoading();
      wx.stopPullDownRefresh({
        complete: (res) => {},
      });
      if (res.code == 0) {
        res.data.list.map((item, index) => {
          item.created_at = item.created_at.replace(/-/g, '/');
          var tip = '';
          if (that.data.type == 3) {
            tip = '草稿箱'
          } else {
            if (item.is_pass == '0') {
              tip = '审核中';
            } else if (item.is_pass == '1') {
              if (item.is_show == 1) {
                if (item.status == 1) {
                  tip = item.type == 1 ? '一口价' : '竞拍中';
                } else {
                  tip = item.type == 1 ? '已售出' : '已结拍'
                }
              } else {
                tip = '已下架';
              }
            } else {
              tip = '审核失败';
            }
          }
          item.tip = tip;
        });
        if (res.data.list.length != limit) {
          hasMore = false;
        }
        that.setData({
          reList: res.data.list
        });

      }
    });
  },
  togSx(e){
      var even_=e.currentTarget.dataset;
    util.request('/users/v1.me/showThat',{
      is_show:even_.show==1?'0':'1',
      id:even_.id
    },'POST').then(res=>{
        console.log(res);
    });
    var list_=this.data.reList;
    list_[even_.index].is_show=even_.show==1?'0':'1';
    list_[even_.index].tip=even_.show==1?'已下架':'一口价';
    this.setData({
      reList:list_
    });

  },
  moreData() {
    page++;
    wx.showLoading({
      title: '加载更多'
    });
    var that = this;
    util.request('/users/v1.me/myRelease', {
      page: page,
      limit: limit,
      book_status: that.data.type
    }, 'POST').then(res => {
      console.log(res);
      wx.hideLoading();
      if (res.code == 0) {
        res.data.list.map((item, index) => {
          item.created_at = item.created_at.replace(/-/g, '/');
          var tip = '';
          if (that.data.type == 3) {
            tip = '草稿箱'
          } else {
            if (item.is_pass == '0') {
              tip = '审核中';
            } else if (item.is_pass == '1') {
              if (item.is_show == 1) {
                if (item.status == 1) {
                  tip = item.type == 1 ? '一口价' : '竞拍中';
                } else {
                  tip = item.type == 1 ? '已售出' : '已结拍'
                }
              } else {
                tip = '已下架';
              }
            } else {
              tip = '审核失败';
            }
          }
          item.tip = tip;
        });
        if (res.data.list.length != limit) {
          hasMore = false;
        }
        that.setData({
          reList: that.data.reList.concat(res.data.list)
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
    if (hasMore) {
      this.moreData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})