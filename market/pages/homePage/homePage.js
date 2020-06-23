// market/pages/homePage/homePage.js
import util from '../../../utils/util.js';

var page = 1;
var limit = 8;
var hasMore = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    st:0,
    userData: {},
    uid: '',
    userList: [],
    navType: 1,
    height_: 0,
    showY:true
  },
  refresh(){
      console.log(111);
  },
  concernEvent(e){
    var that=this;
    util.isAouth();
<<<<<<< HEAD
    if(!util.isAouth()){
      return false;
    }
=======
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
    var type_=e.currentTarget.dataset.type;
        wx.showLoading({
          title:type_==0?'正在关注':'取消关注',
        })
      util.request('/users/v1.me/setFollow',{
        uid_be:that.data.uid,
        status:type_==0?1:0
      },'POST').then(res=>{
          console.log(res);
          wx.hideLoading();
          if(res.code==0){
              wx.showToast({
                title:type_==0?'关注成功':'取消成功',
                icon:'none'
              });
              that.getInfo();
          }else{
            wx.showToast({
              title: res.msg,
              icon:'none'
            });
          }

      });
  },
  togType(e){
      this.setData({
        navType:e.currentTarget.dataset.type,
        showY:false,
        st:0
      });
      this.initDetail();
  },
  initDetail() {
    var data_={};
    var that=this;
    page=1;
    hasMore=true;
    data_.page=page;
    data_.limit=limit;
    data_.uid=that.data.uid;
    var url= that.data.navType==1?'/market/v1.product/market_pull':'/market/v1.product/bookShelf';
wx.showLoading({
  title: '加载中',
});
    util.request(url,data_,'POST').then(res=>{
        console.log(res);
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if(res.code==0){
     
          setTimeout(() => {
            that.setData({
              showY:true
            });
          }, 300);
                if(res.data.list.length!=limit){
                      hasMore=false;
                }
              that.setData({
                userList:res.data.list
              });

        }

    });


  },
  aa(){
        console.log(1)
  },
  moreDetail(){
    var data_={};
    var that=this;
    page++;
    data_.page=page;
    data_.limit=limit;
    data_.uid=that.data.uid;
    var url= that.data.navType==1?'/market/v1.product/market_pull':'/market/v1.product/bookShelf';
    util.request(url,data_,'POST').then(res=>{
        console.log(res);
        if(res.code==0){
          if(res.data.list.length!=limit){
            hasMore=false;
      }
              that.setData({
                userList:that.data.userList.concat(res.data.list) 
              });

        }

    });
  },
  getInfo() {
    var that = this;
    util.request('/market/v1.product/market_user', {
      uid: that.data.uid
    }, 'POST').then(res => {
      console.log(res);
      if (res.code == 0) {
        that.setData({
          userData: res.data
        });
        setTimeout(() => {
          util.getBox('#box', res => {
            console.log(res);
            that.setData({
              height_: res
            });
          });
        }, 200);
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    page = 1;
    limit = 8;
    hasMore = true;
    this.setData({
      uid: options.uid
    });
    this.getInfo();
    this.initDetail();
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
      this.initDetail();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this;
        if(hasMore){
            that.moreDetail();
        }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})