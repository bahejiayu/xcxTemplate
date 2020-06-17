// pages/tiXian/tiXian.js
import util from '../../utils/util.js'
var once=true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',
    fwf:'0.00',
      accountData:null,
      userAccountInfo:{}
  },
  pay_(e){
    var that=this;
      if(e.currentTarget.dataset.ok=='isOk'){
            wx.showLoading({
              title: '提交中',
            });
            util.request('/users/v1.me/setPullCash',{
              price:that.data.money,
              ser_price:that.data.fwf,
              cash_id:that.data.accountData.id
            },'POST').then(res=>{
                wx.hideLoading({
                  complete: (res) => {},
                });
                if(res.code==0){
                  wx.showModal({
                    title: '提示',
                    content: '提现申请已提交,请耐心等待',
                    success (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  });
                  that.userAccountInfo();
                    that.setData({
                        fwf:'0.00',
                        money:'',
                        price:''
                    });

                }

            });


      }
  },
  changeMoney(e){
      this.setData({
        money:e.detail.value
      });
      var that=this;
      util.request('/users/v1.me/getCashSer',{
        price:e.detail.value,
        cash_type:1
      },'POST').then(res=>{
          console.log(res);
          if(res.code==0){
              that.setData({
                    fwf:res.data.list.ser_price
              });
          }
      });


  },
  initAccount(){
    var that=this;
    if(!once){
        return false;
    }
    once=true;
    wx.showLoading({
      title: '加载中',
    });
    util.request('/users/v1.me/getCashList',{},'POST').then(res=>{
        console.log(res);
        wx.hideLoading({
          complete: (res) => {},
        });
        if(res.code==0){
          once=true;
             var accountData=    res.data.list.filter((item,index)=>{
                      return  item.default==1;
                  });
                  console.log(accountData);
                 that.setData({
                  accountData:accountData[0]||null
                 }); 
                 if(wx.getStorageSync('chkAcc')){
                  that.setData({
                    accountData:wx.getStorageSync('chkAcc')
                  });
              }
        }
    });

  },
  userAccountInfo(){
    var that=this;
    util.request('/users/v1.order/EnsureInfo',{},'POST').then(res=>{
      console.log(res);
      wx.hideLoading({
        complete: (res) => {},
      });
      if(res.code==0){
               that.setData({
                userAccountInfo:res.data
               }); 
      }
  });
  },
  goAccount(){
    var url_;
    if(this.data.accountData){
      url_= '../chooseAccount/chooseAccount?type=1&id='+this.data.accountData.id;
    }else{
      url_= '../chooseAccount/chooseAccount?type=1';

    }

      wx.navigateTo({
        url: url_,
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    once=true;
      // this.initAccount();
      this.userAccountInfo();
      wx.removeStorageSync('chkAcc');

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
    this.initAccount();
     


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