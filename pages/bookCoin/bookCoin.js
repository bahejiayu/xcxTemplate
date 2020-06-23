// pages/bookCoin/bookCoin.js
import util from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    valueList: [],
    coinMoney: 0,
    chkIndex: 0
  },
  togCoin(e) {
    this.setData({
      chkIndex: e.currentTarget.dataset.index
    });
  },
  getList() {
    wx.showLoading({
      title: '加载中',
    });
    var that = this;
    util.request('/users/v1.my/cz', {}, 'POST').then(res => {
      console.log(res);
      wx.hideLoading({
        complete: (res) => {},
      });
      if (res.code == 0) {
        that.setData({
          valueList: res.data.list,
        });
      }

    });
  },
  coinPay() {
    var that = this;
    var payMoney = that.data.valueList[that.data.chkIndex].price || '0.00';
    if (payMoney == '0.00') {
      wx.showToast({
        title: '请选择充值金额',
        icon: 'none'
      });
      return false;
    }
    wx.showLoading({
      title: '充值中',
    });
    util.request('/users/v1.orders/placeOrder', {
      price: payMoney
    }, 'POST').then(res => {
      console.log(res);
      if (res.code == 0) {
              util.request('/api/v1.Applet/pay',{
                order_no:res.data.order_no
              },'POST').then(res=>{
                    if(res.code==0){
                        util.wxPay(res.data).then(res=>{
                          console.log(111)
                          util.getUserInfo(res=>{
                            that.setData({
                              coinMoney:res.money
                            });
                          });
                        });
                    }else{
                      wx.hideLoading({
                        complete: (res) => {},
                      });
                      wx.showToast({
                        title: res.msg,
                      });
                    }
              });
      } else {
        wx.hideLoading({
          complete: (res) => {},
        });
        wx.showToast({
          title: res.msg,
        });
      }

    });


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
    var that=this;
    util.getUserInfo(res=>{
      that.setData({
        coinMoney: wx.getStorageSync('userInfo').money
      });
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