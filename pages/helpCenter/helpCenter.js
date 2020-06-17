// pages/helpCenter/helpCenter.js
import util from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
      helpList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
      util.request('/api/v1.opt/new_helper',{},'POST').then(res=>{
          console.log(res);
          if(res.code==0){
            res.data.list.map((item,index)=>{
                item.name=item.title.substr(2,item.title.length);
            });
              console.log(res.data.list);
              that.setData({
                helpList:res.data.list
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