// pages/articleView/articleView.js
import util from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
      wx.setNavigationBarTitle({
        title: options.title||'古今艺览',
      });
      wx.showLoading({
        title: '加载中',
      });
      util.request('/api/v1.opt/about',{
      },'POST').then(res=>{
        wx.hideLoading();
          console.log(res);
          if(res.code==0){

          var  articleData=util.formatRichText(res.data.content);
              that.setData({
                articleData:articleData
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