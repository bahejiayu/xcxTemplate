// user/pages/myOrder/myOrder.js


import util from '../../../utils/util.js';
var page = 1;
var limit = 8;
var hasMore = true;
var startX=0;
var startY=0;
var once_=true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      orderList:[],
      type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    page = 1;
    limit = 8;
    hasMore = true;
    once_=true;
      this.initData();

  },
  orderPay(){
 
  },
  bohao(){
      wx.makePhoneCall({
        phoneNumber: '02089443264',
      });
  },
  sureGet(e){
    var that=this;
    if(!once_){
      return false;
  }
  once_=false;
    wx.showModal({
      title: '提示',
      content: '是否确认收货',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍等',
          });
          util.request('/market/v1.orders/saveOrder',{
            order_no:e.currentTarget.dataset.no,
            status:4
          },'POST').then(res=>{
            once_=true;
              console.log(res);
              wx.hideLoading();
              if(res.code==0){
                  var list_=that.data.orderList;
                  list_[e.currentTarget.dataset.index].status=2;
                  that.setData({
                    orderList:list_
                  });
      
      
              }else{
                    wx.showToast({
                      title:res.msg,
                      icon:'none'
                    });
              }
          });

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  delCarItem(e){
    var index_=e.currentTarget.dataset.index;
    var that=this;
    wx.showModal({
      title: '提示',
      content: '是否确认删除',
      success (res) {
        if (res.confirm) {
              util.request('/users/v1.car/deleteCar',{
                id:e.currentTarget.dataset.id
              },'POST').then(res=>{
                    console.log(res);
                  if(res.code==0){
                        wx.showToast({
                          title: '删除成功',
                          icon:'none'
                        });
                      var arr=that.data.carList;
                    that.initData();
                  }else{
                    wx.showToast({
                      title: res.msg,
                      icon:'none'
                    });

                  }

              });


        } 
      }
    })


},
  st: function(e) {
  
    startX= e.touches[0].clientX;
    startY= e.touches[0].clientY;

  },
  end: function(e) {
    var that = this;
    var jianX = e.changedTouches[0].clientX - startX;
    var jianY = e.changedTouches[0].clientY - startY;
    var obj= this.data.orderList;
    var index_=e.currentTarget.dataset.index;
    if (jianX < 0 && jianX < -10) {
        if(Math.abs(jianY)<15){
          obj[index_].left=true;
        
        }
    }else if(jianX > 0 && jianX > 10){
      if(Math.abs(jianY)<15){
        obj[index_].left=false;
      }
    }
     that.setData({
      orderList:obj
     });
  },
  initData(){
    console.log(11);
    wx.showLoading({
      title: '加载中',
    });
    var that=this;
      page=1;
    util.request('/users/v1.order/orderList',{
      page:page,
      limit:limit,
      order_type:that.data.type
    },'POST').then(res=>{
        console.log(res);
        wx.hideLoading({
          complete: (res) => {},
        });
        wx.stopPullDownRefresh({
          complete: (res) => {},
        });
        hasMore=true;

          if(res.code==0){
              if(res.data.list.length!=limit){
                    hasMore=false;
              }
              that.setData({
                orderList:res.data.list
              });
          }
    });
    },
    togType(e){
      wx.pageScrollTo({
        scrollTop: 0
      });
      this.setData({
        type:e.currentTarget.dataset.type
      });
      console.log(22)
      this.initData();
  },
  moreData(){
    var that=this;
      page++;
      wx.showLoading({
        title: '加载更多',
      });
    util.request('/users/v1.order/orderList',{
      page:page,
      limit:limit,
      order_type:that.data.type
    },'POST').then(res=>{
        console.log(res);
        wx.hideLoading({
          complete: (res) => {},
        });
          if(res.code==0){
              if(res.data.list.length!=limit){
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
    var that=this;
        if(that.data.back){
          util.request('/users/v1.order/orderList',{
            page:page,
            limit:that.data.orderList.length,
            order_type:that.data.type
          },'POST').then(res=>{
              console.log(res);
                if(res.code==0){
                    that.setData({
                      orderList:res.data.list
                    });
                }
          });
        }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
      this.setData({
        back:false
      });
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