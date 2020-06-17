// car/pages/order/order.js
import util from '../../../utils/util.js'
var once=true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remarks:'',
      book_arr:[],
      goodsTotal:0,
      addressInfo:null,
      freight:0,
      type:'',
      comFreight:true
  },
  changeRemarks(e){
      this.setData({
        remarks:e.detail.value
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    once=true;
    var that=this;
      this.setData({
        book_arr:wx.getStorageSync('book_arr'),
        type:options.type,
        freight:options.yf||''
      });
      that.computTotal();

  },
  downOrder(){
      if(!this.data.addressInfo){
            wx.showToast({
              title: '请选择收货地址',
              icon:'none'
            });
            return false;
      }
    if(!once){
        return false;
    }
    once=false;
      var postData={};
      var that=this;
      postData.type=that.data.type;
      postData.freight=that.data.freight;
      postData.remarks=that.data.remarks;
      postData.addr_id=that.data.addressInfo.id;
      postData.book_arr=that.data.book_arr.map((item,index)=>{
          var obj={};
          obj.doc_id=item.doc_id;
          obj.num=item.num;
          return obj;
      });
        console.log(postData);
      wx.showLoading({
        title: '正在下单',
      });
      util.request('/users/v1.order/addOrder',postData,'POST').then(res=>{
          console.log(res);
         
          wx.hideLoading();
          if(res.code==0){
            var orderId=res.data.oid;
              util.request('/api/v1.Applet/pay',{
                order_no:res.data.order_no
              },'POST').then(res=>{
                console.log(res)
                once=true;
                if(res.code==0){
                  util.wxPay(res.data).then(res=>{
                    wx.redirectTo({
                      url: '../../../user/pages/orderDetail/orderDetail?id='+orderId+'&type='+that.data.type
                    });
                  });
                }
              }).then(res=>{

              });
          }else{
            once=true;
            wx.showToast({
              title: res.msg,
              icon:'none'
            });
          }

      });


  },
  computTotal(){
      var list_=this.data.book_arr;
      var total_=0;
      list_.forEach((item,index)=>{
        total_+=item.num*item.price
      });
      this.setData({
        goodsTotal:(total_*1).toFixed(2)
      });
  },
  // 获取默认地址并计算运费
  getAddressList(){
    var that=this;
      util.request('/users/v1.Address/carList',{},'POST').then(res=>{
          if(res.code==0){
          var address_= res.data.list.filter((item,index)=>{
                  return item.default==1;
              });
              console.log(address_);
              if(address_[0]){
                that.computFreight(address_[0].province.split('-')[0]);
                address_[0].adTxt=address_[0].province.replace(/-/g,"");
              }
              that.setData({
                addressInfo:address_[0]||null
              });
          }
      });
  },
  computFreight(area){
      var areaTyp=1;
      var that=this;
      if(/香港/.test(area)){
        areaTyp=2
      }else if(/澳门/.test(area)){
        areaTyp=3
      }else if(/台湾/.test(area)){
        areaTyp=4
      }else if(/新疆/.test(area)){
        areaTyp=4
      }
      var bookList=that.data.book_arr.map((item,index)=>{
          var obj={
            doc_id:item.doc_id,
            doc_num:item.num
          }
          return obj;
      });
      if(that.data.type!=4){
        util.request('/setting/v1.set/getShiFreight',{
          erea_id:areaTyp,
          bookData:bookList
        },'POST').then(res=>{
            if(res.code==0){
              that.setData({
                freight:res.data
              });
            }else{
              that.setData({
                freight:0
              });
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
      this.getAddressList();
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