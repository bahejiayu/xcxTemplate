// user/pages/fans/fans.js
import util from '../../../utils/util.js';
var page = 1;
var limit =  15;
var hasMore = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    list_:[]
  },
  concernEvent(e){
    var that=this;
    var type_=e.currentTarget.dataset.type;
        wx.showLoading({
          title:'取消关注',
        })
      util.request('/users/v1.me/setFollow',{
        uid_be:e.currentTarget.dataset.uid,
        status:0
      },'POST').then(res=>{
          console.log(res);
          wx.hideLoading({
            complete: (res) => {},
          });
          if(res.code==0){
              wx.showToast({
                title: '取消成功',
                icon:'none'
              });
               that.initData();
          }

      });
  },
  initData() {
    var data_={};
    var that=this;
    page=1;
    data_.page=page;
    data_.limit=limit;
    data_.type=that.data.type;
   util.request( data_.type==1?'/users/v1.me/myUserBe':'/users/v1.me/myFollow',data_,'POST').then(res=>{
      console.log(res);
      wx.stopPullDownRefresh();
      hasMore=true;

      if(res.code==0){
        if(res.data.list!=limit){
              hasMore=false;
        }
          that.setData({
            list_:res.data.list
          });
      }
   });
  },
  moreData() {
    var data_={};
    var that=this;
    page++;
    data_.page=page;
    data_.limit=limit;
    data_.type=that.data.type;
   util.request(data_.type==1?'/users/v1.me/myUserBe':'/users/v1.me/myFollow',data_,'POST').then(res=>{
      console.log(res);
      if(res.code==0){
        if(res.data.list!=limit){
          hasMore=false;
    }
          that.setData({
            list_:that.data.list_.concat(res.data.list)  
          });
      }
   });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 1) {
      wx.setNavigationBarTitle({
        title: '我的粉丝'
      });

    } else {
      wx.setNavigationBarTitle({
        title: '我的关注'
      });
      this.setData({
        type: 2
      });
    }
    page = 1;
    limit = 15;
    hasMore = true;
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
      if(hasMore){
        this.initData();

      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})