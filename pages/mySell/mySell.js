// pages/mySell/mySell.js
import util from '../../utils/util.js';
var page = 1;
var limit = 6;
var hasMore = true;
var orderNo='';
var orderIndex='';
var once_=true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'0',
    orderList:[],
    orderno:'',
    sellType1:false,
    val:""
  },
  ykjSubmit(e){
    var that=this;
    if(!once_){
        return false;
    }
    once_=false;
      if(e.detail.value.orderno.trim().length<10){
            wx.showToast({
              title: '请输入正确的快递单号',
              icon:'none'
            });
            once_=true;

            return false;
      }
      wx.showLoading({
        title: '提交中',
      });
      util.request('/market/v1.orders/saveOrder',{
        order_no:orderNo,
        express_no:e.detail.value.orderno.trim(),
        status:3
      },'POST').then(res=>{
        once_=true;
          console.log(res);
          wx.hideLoading();
          if(res.code==0){
              var list_=that.data.orderList;
              list_[orderIndex].status=3;
              that.setData({
                sellType1:false,
                orderList:list_,
                orderno:''
              });


          }else{
                wx.showToast({
                  title:res.msg,
                  icon:'none'
                });
          }
      });


  },
  closeSellType1(){
    this.setData({
      sellType1:false,
      orderno:''
    });
  },
  sellType1(){
    this.setData({
      sellType1:true
    });
},
  togType(e){
      this.setData({
        type:e.currentTarget.dataset.type
      });
      wx.pageScrollTo({
        pageScrollTo:0,
        duration:0
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
     once_=true;
     this.initData();
  },
  surePost(e){
    orderNo=e.currentTarget.dataset.no;
    orderIndex=e.currentTarget.dataset.index;
    this.setData({
      sellType1:true
    });

  },
  initData(){
    var that=this;
    wx.showLoading({
      title: '加载中',
    });
    page = 1;
    limit = 6;
    util.request('/users/v1.me/mySellOrder',{
      page:page,
      limit:limit,
      status:that.data.type
    },'POST').then(res=>{
      wx.hideLoading();
      wx.stopPullDownRefresh();
        console.log(res);
        hasMore = true;
            if(res.code==0){
                if(limit!=res.data.list.length){
                    hasMore=false;
                }
                that.setData({
                  orderList:res.data.list
                });
            }
    });
  },
  moreData(){
    var that=this;
    wx.showLoading({
      title: '加载中',
    });
    page++;
    limit = 6;
    util.request('/users/v1.me/mySellOrder',{
      page:page,
      limit:limit,
      status:that.data.type
    },'POST').then(res=>{
      wx.hideLoading();
      wx.stopPullDownRefresh();
        console.log(res);
        hasMore = true;
            if(res.code==0){
                if(limit!=res.data.list.length){
                    hasMore=false;
                }
                that.setData({
                  orderList:that.data.orderList.concat(res.data.list) 
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