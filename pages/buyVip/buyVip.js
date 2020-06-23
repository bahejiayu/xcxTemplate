// pages/buyVip/buyVip.js
import util from '../../utils/util.js';
var once=true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo:null,
      vipList:[],
      vipIndex:0
  },
  togIndex(e){  
      this.setData({
        vipIndex:e.currentTarget.dataset.index
      });
  },
  vipPay(){
    var that=this;
      if(once){
        once=false;
        var id_=that.data.vipList[that.data.vipIndex].id||false;
        if(!id_){
          once=true;
          return false;
        }
         wx.showLoading({
           title: '请稍等',
         });
         util.request('/users/v1.orders/placeOrderVipOnle',{
           id:id_
         },'POST').then(res=>{
            console.log(res);
       
             if(res.code==0){
                util.request('/api/v1.Applet/pay',{
                  order_no:res.data.order_no
                },'POST').then(res=>{
                  once=true;

                  if(res.code==0){
                    util.wxPay(res.data).then(res=>{
                      wx.hideLoading({
                        complete: (res) => {},
                      });
                      wx.showToast({
                        title: '开通成功',
                        icon:'none'
                      });
                      util.getUserInfo(res=>{
                        res.vip_end_time=util.vipTime(res.vip_end_time*1000);
                        that.setData({
                          userInfo:res
                        });
                      });
                });
                  }else{
                    once=true;

                  }

            

                });
                
       
             }else{
              once=true;
              wx.hideLoading({
                complete: (res) => {},
              });
              wx.showToast({
                title: res.msg,
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
    once=true;
        util.getUserInfo(res=>{
          res.vip_end_time=util.vipTime(res.vip_end_time*1000);
            that.setData({
              userInfo:res
            });
        });
<<<<<<< HEAD

        util.request('/goods/v2.home/setAppletVip',{},'POST').then(res=>{
          console.log(res);
            if(res.data!=0){
              this.initVipList();
            }else{
              that.setData({
                  vipTxt:'IOS暂不支持开通会员'
              });
            }
        });

=======
        this.initVipList();
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
  },
  initVipList(){
      var that=this;
      util.request('/users/v1.orders/getVipPayList',{

      },'POST').then(res=>{
        console.log(res);
          if(res.code==0){

            res.data.list.map((item,index)=>{
                item.price=item.price*1;
                item.cost_price=item.cost_price*1;
                item.pj=(item.price/(item.vip_time/30)).toFixed(1);
            });

                that.setData({
                  vipList:res.data.list
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