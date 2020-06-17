// pages/deposit/deposit.js
import util from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
      depInfo:{},
      userInfo:null,
      moneyP:''
  },
  initInfo(){
        wx.showLoading({
          title: '加载中',
        });
        var that=this;
          util.request('/users/v1.order/EnsureInfo',{

          },'POST').then(res=>{
            wx.hideLoading({
              complete: (res) => {},
            });
              if(res.code==0){
                  that.setData({
                    depInfo:res.data
                  });
              }
          });

  },
  changePri(e){
      this.setData({
        moneyP:e.detail.value
      });
  },
  pay_(e){
    var that=this;
      if(e.currentTarget.dataset.ok=='isOk'){
       
            wx.showLoading({
              title: '支付中',
            });
              util.request('/users/v1.order/addEnsureOrder',{
                type:7,
                price:that.data.moneyP
              },'POST').then(res=>{
                    console.log(res);
                  if(res.code==0){
                    this.setData({
                      moneyP:''
                    });
                          util.request('/api/v1.Applet/pay',{
                            order_no:res.data.order_no
                          },'POST').then(res=>{
                            console.log(res);
                            if(res.code==0){
                              util.wxPay(res.data).then(res=>{
                                  console.log(11)
                                  util.getUserInfo(res=>{
                                    that.setData({
                                      userInfo:res
                                    });
                                });
                                    that.initInfo();
                              });
                            }else{
                              wx.hideLoading();
                              wx.showToast({
                                title: res,msg,
                                icon:'none'
                              });
                            }
                          });
                  }else{
                     
                    wx.hideLoading();
                    wx.showToast({
                      title: res,msg,
                      icon:'none'
                    });
                  }

              });

      }


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    util.getUserInfo(res=>{
        console.log(res)
        that.setData({
          userInfo:res
        });
    });
    this.initInfo();
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
      this.initInfo();
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