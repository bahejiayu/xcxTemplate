// pages/bookShelf/bookShelf.js

import util from '../../utils/util.js'

var startX=0;
var startY=0;
var page=1;
var limit =10;
var hasMore=true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      shelfList:[],
      showPay:false,
      bookId:null,
      bookIndex:0,
      userInfo:''

  },
  goRead(e){
        wx.navigateTo({
          url: e.currentTarget.dataset.url,
        });
  },
  bookPay(e){
    console.log(111)
    var that=this;
    util.getUserInfo(res=>{
       console.log(res)
      that.setData({
        userInfo:res
      });
});
    this.setData({
      needPrice:e.currentTarget.dataset.price,
      showPay:true,
      bookId:e.currentTarget.dataset.id,
      bookIndex:e.currentTarget.dataset.index
    });
},
goBookCoin(){
  this.setData({
    showPay:false
  });
    wx.navigateTo({
      url: '../bookCoin/bookCoin',
    });
},
// bookPay(e){
//     wx.navigateTo({
//       url: e.currentTarget.dataset.url,
//     });
// },
closePay(){
  this.setData({
    showPay:false
  });
},
st: function(e) {
  
  startX= e.touches[0].clientX;
  startY= e.touches[0].clientY;

},
end: function(e) {
  var that = this;
  var jianX = e.changedTouches[0].clientX - startX;
  var jianY = e.changedTouches[0].clientY - startY;
  var obj= this.data.shelfList;
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
    shelfList:obj
   });
},
delItem(e){
    var index_=e.currentTarget.dataset.index;
    var that=this;
    wx.showModal({
      title: '提示',
      content: '是否确认删除',
      success (res) {
        if (res.confirm) {
              util.request('/users/v1.me/deleteBookShelf',{
                id:e.currentTarget.dataset.cid
              },'POST').then(res=>{
                    console.log(res);
                  if(res.code==0){
                        wx.showToast({
                          title: '删除成功',
                          icon:'none'
                        });
                      var arr=that.data.shelfList;
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
                title: '支付成功',
                icon:'none'
              });
              var list_=that.data.shelfList;
              list_[that.data.bookIndex].is_buy=1;
              that.setData({
                shelfList:list_
              });

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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     page=1;
     limit =10;
     hasMore=true;
     var that=this;
     this.initData();
     util.getUserInfo(res=>{
        that.setData({
          userInfo:res
        });
     });
  },
  initData(){
    var that=this;
    page=1;
    limit =10;
    util.request('/users/v1.me/bookShelf',{
        page:page,
        limit:limit
    },'POST').then(res=>{
      wx.stopPullDownRefresh({
        complete: (res) => {},
      });
        console.log(res);
        hasMore=true;

        if(res.code==0){
            if(limit!=res.data.list.length){
                hasMore=false;
            }
            that.setData({
              shelfList:res.data.list
            });
            wx.stopPullDownRefresh({
              complete: (res) => {},
            });
        }

    });


  },
  moreData(){
    var that=this;
    page++;
    util.request('/users/v1.me/bookShelf',{
        page:page,
        limit:limit
    },'POST').then(res=>{
        console.log(res);
        if(res.code==0){
            if(limit!=res.data.list.length){
                hasMore=false;
            }
            that.setData({
              shelfList:that.data.shelfList.concat(res.data.list)
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