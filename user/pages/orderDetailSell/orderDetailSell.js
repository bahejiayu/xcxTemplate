// user/pages/orderDetail/orderDetail.js
import util from '../../../utils/util.js';
var payOcne=true;
var once_=true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:{},
    addressInfo:{},
    type:null,
    back:false,
    id:'',
    sellType1:false,
    orderno:'',

  },
  surePost(e){
    this.setData({
      sellType1:true
    });

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
        order_no:that.data.orderInfo.order_no,
        express_no:e.detail.value.orderno.trim(),
        status:3
      },'POST').then(res=>{
        once_=true;
          console.log(res);
          wx.hideLoading();
          if(res.code==0){
              that.setData({
                sellType1:false,
                orderno:'',
                back:true
              });
              
              that.initData();
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
  initData(){ 
        wx.showLoading({
          title: '加载中',
        });
        var that=this;
        util.request('/users/v1.order/orderInfo',{
            id:that.data.id
        },'POST').then(res=>{
          wx.hideLoading({
            complete: (res) => {},
          });
          res.data.log.map((item,index)=>{
              item.created_at=item.created_at.replace(/-/g,'/');
          });
         res.data.address.atxt= res.data.address.province.replace(/-/g,"");
          res.data.goods_data.map((item,index)=>{
            if(item.v_time){
              item.jsTime=util.sf(item.v_time*1000-new Date().getTime());
            }
           
        });


            if(res.code==0){
                that.setData({
                  orderInfo:res.data
                });
            }
            console.log(res);
        });


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    payOcne=true;
    once_=true;
      this.setData({
        id:options.id,
        type:options.type||''
      });
      this.initData();
  },
  orderPay(){
    var that=this;
      if(payOcne){
        payOcne=false;
         wx.showLoading({
           title: '正在支付',
           icon:'none'
         });
         util.request('/api/v1.Applet/pay',{
          order_no:that.data.orderInfo.order_no
         },'POST').then(res=>{
            if(res.code==0){
                util.wxPay(res.data).then(res=>{
                    that.initData();
                    payOcne=true;
                    that.setData({
                      back:true
                    });
                });
            }else{
              payOcne=true;
            }

         });



      }
  


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
    var that = this;
    if(that.data.type==4){
      wx.switchTab({
        url: '../../../pages/market/market'
      });
    }else{
      var pages = getCurrentPages(); 
      var prevPage = pages[pages.length - 2];   //上一页
      prevPage.setData({
        back: that.data.back
      });
    }

  
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