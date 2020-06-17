// library/pages/catalog/catalog.js
import util from '../../../utils/util.js'
var page = 1;
var limit = 18;
var hasMore=true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId:'',
    isBuy:false,
    list:[]
  },
  cataEven(e){
    var that=this;
   
      if(e.currentTarget.dataset.iock=='iock'){
          wx.showToast({
            title: '请购买书籍',
            icon:'none'
          });
      }else{
        wx.navigateTo({
          url: '../logDetail/logDetail?url='+e.currentTarget.dataset.url,
        });
         

      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData({
      bookId:options.id,
      isBuy:options.isBuy,
      canLook:options.canLook
    });
     page = 1;
     limit = 18;
     hasMore=true;
    wx.showLoading({
      title: '加载中',
    });
    var that=this;
    util.request('/goods/v2.home/applet_catalog',{
      doc_id:that.data.bookId,
      page:1,
      limit:limit
    },'POST').then(res=>{
      wx.hideLoading();
      if(res.code==0){
        if(limit!=res.data.list.length){
            hasMore=false;
        }
          that.setData({
            list:res.data.list
          });
      }
      console.log(res);
    });

  },
moreData(){
  var that=this;
  page++;
 wx.showLoading({
   title: '加载中',
 });
 var that=this;
 util.request('/goods/v2.home/applet_catalog',{
   doc_id:that.data.bookId,
   page:page,
   limit:limit
 },'POST').then(res=>{
  hasMore=true;
   wx.hideLoading();
   if(res.code==0){
     if(limit!=res.data.list.length){
         hasMore=false;
     }
       that.setData({
         list:that.data.list.concat(res.data.list) 
       });
   }
   console.log(res);
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