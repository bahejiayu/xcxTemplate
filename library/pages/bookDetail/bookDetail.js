// library/pages/bookDetail/bookDetail.js
import util from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    needPrice:0,
      bannerIndex:1,
      bookId:'',
      showPay:false,
      bookInfo:{},
      userInfo:null,
  },
  pevImg(e){
  
        wx.previewImage({
          urls: [e.currentTarget.dataset.url],
          current:e.currentTarget.dataset.url
        });
  },
  shiPay(){
    util.isAouth();
    if(!util.isAouth()){
      return false;
    }
    var that=this;
    var data_=that.data.bookInfo.info;
      var orderData=[{
        doc_id:that.data.bookId,
        num:1,
        name:data_.name,
        author:data_.author,
        cbs_id:data_.cbs_id,
        logo:data_.logo,
        price:data_.discount_pice&&data_.discount_pice!='0.00'?data_.discount_pice:data_.price
      }]
      
      wx.setStorageSync('book_arr', orderData);
      wx.navigateTo({
        url: '../../../car/pages/order/order?type='+that.data.bookInfo.info.attribute,
      });


  },
  // 书币支付
  coinPay(){
  wx.showLoading({
    title: '支付中',
  });
  var that=this;
    util.request('/doc/v1.orders/placeOrderDoc',{
      id:that.data.bookId
    },'POST').then(res=>{
      wx.hideLoading({
        complete: (res) => {},
      });
        console.log(res);
        if(res.code==0){
          wx.showToast({
            title: '购买成功',
          });
            that.getBookDetail();
            that.setData({
              showPay:false
            });
        }else{
          wx.showModal({
            title: '提示',
            showCancel:false,
            content: res.msg
          });
        }

    });

  },
  addCar(){
    var that=this;
    util.isAouth();
    if(!util.isAouth()){
      return false;
    }
    wx.showLoading({
      title: '加入中',
    });
    util.request('/users/v1.car/addCar',{
      doc_id:that.data.bookId
    },'POST').then(res=>{
      wx.hideLoading({
        complete: (res) => {},
      });
      console.log(res);
        if(res.code==0){
            wx.showToast({
              title: '加入成功',
            });
        }else{
            wx.showToast({
              title: res.msg,
              icon:'none'
            });
        }

    });


  },
  // 加入书架
  addBookSelf(){
    var that=this;
    util.isAouth();
    if(!util.isAouth()){
      return false;
    }
    wx.showLoading({
      title: '加入中',
    });
    util.request('/users/v1.me/addBookShelf',{
      doc_id:that.data.bookId
    },'POST').then(res=>{
      wx.hideLoading({
        complete: (res) => {},
      });
      console.log(res);
        if(res.code==0){
            wx.showToast({
              title: '加入成功',
            });
        }else{
            wx.showToast({
              title: res.msg,
              icon:'none'
            });
        }

    });

  },
  // 切换收藏
  togCollect(e){
    var that=this;
    util.isAouth();
    if(!util.isAouth()){
      return false;
    }
    var collectType=e.currentTarget.dataset.type;
          util.request('/doc/v1.pages/getCollection',{
            doc_id:that.data.bookId,
            is_collect:collectType==0?1:0
          },'POST').then(res=>{
                  console.log(res);
                  if(res.code==0){
                    var obj =that.data.bookInfo;
                    obj.is_collect=collectType==0?1:0;
                    that.setData({
                      bookInfo:obj
                    });
                      if(collectType==0){
                            wx.showToast({
                              title: '收藏成功',
                              icon:'none'
                            });
                      }else{
                        wx.showToast({
                          title: '取消成功',
                          icon:'none'
                        });
                      }

                  }else{
                        wx.showToast({
                          title: res.msg,
                          icon:'none'
                        });
                  }

          });

  },
  bookPay(){
    util.isAouth();
    if(!util.isAouth()){
      return false;
    }
      this.setData({
        showPay:true
      });
  },
  closePay(){
    this.setData({
      showPay:false
    });
  },
  swiperChange(e){
      this.setData({
        bannerIndex:e.detail.current+1
      });
  },
  getBookDetail(){
    var that=this;
    wx.showLoading({
      title: '加载中',
    });
      util.request('/doc/v1.pages/info',{
          id:that.data.bookId
      },'POST').then(res=>{
          wx.hideLoading();
          if(res.code==0){

              if(res.data.info.publication_time!='0000-00-00'){
                var time_= res.data.info.publication_time.replace(/-/g,'/');
                var myDate= new Date(time_)
                 res.data.info.publication_time=`${myDate.getFullYear()}年${myDate.getMonth()+1}月${myDate.getDate()}日`;
   
              }
        


                that.setData({
                  bookInfo:res.data
                });
          }
          console.log(res.data);
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        bookId:options.id
      });
      this.getBookDetail();
     
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
    util.getUserInfo(res=>{
        console.log(res)
        that.setData({
          userInfo:res
        });
  });

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