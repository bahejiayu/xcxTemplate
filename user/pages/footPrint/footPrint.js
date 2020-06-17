// user/pages/footPrint/footPrint.js
import util from '../../../utils/util.js';
var page = 1;
var limit = 5;
var hasMore = true;
var startX=0;
var startY=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      footType:2,
      footList:[],
      isShow:true
  },
  togType(e){
    wx.pageScrollTo({
      scrollTop: 0,
      duration:0
    });
      this.setData({
        footType:e.currentTarget.dataset.type
      });
      this.getData();
  },
  goDetail(e){
    var event_=e.currentTarget.dataset;
    if(event_.status==0){
        wx.navigateTo({
          url: event_.url,
        });
    }else{
          wx.showToast({
            title: '物品已结束',
            icon:'none'
          });
    }


},
  getData(){
    var that=this;
    wx.showLoading({
      title: '加载中',
    });
    var data_={};
    page=1;
    data_.page=page;
    data_.limit=limit;
    data_.type=that.data.footType;
    this.setData({
      isShow:false
    });
      util.request('/users/v1.me/footPrint',data_,'POST').then(res=>{
          console.log(res);
          wx.hideLoading();
          hasMore=true;

            if(res.code==0){
              if(that.data.footType==1){
                res.data.list.map((item,index)=>{
                  item.bean.map((t2,i2)=>{
                    t2.auction_time= util.formatTime2(new Date(t2.auction_time.replace(/-/g,'/')).getTime(),'/');
                    var price_=t2.transaction_price;
                    if(!/[0-9]/.test(price_)){
                      t2.transaction_price='流拍'
                    }
                    if(t2.logo){
                      t2.logo=t2.logo.replace(/\s/g,'%20');
                      t2.logo=t2.logo.replace(/'/g,'%27');
                    }
                     

                  });
                }); 
              }
          


                  if(limit!=res.data.list.length){
                    hasMore=false;
                  }
                  that.setData({
                    footList:res.data.list
                  });
                  setTimeout(() => {
                    that.setData({
                      isShow:true
                    });
                  }, 200);
            }
      });
  },
  moreData(){
    var that=this;
    wx.showLoading({
      title: '加载更多',
    });
    var data_={};
    page++;
    data_.page=page;
    data_.limit=limit;
    data_.type=that.data.footType;
      util.request('/users/v1.me/footPrint',data_,'POST').then(res=>{
          console.log(res);
          wx.hideLoading();
            if(res.code==0){
              if(that.data.footType==1){
                res.data.list.map((item,index)=>{
                  item.bean.map((t2,i2)=>{
                    t2.auction_time= util.formatTime2(new Date(t2.auction_time.replace(/-/g,'/')).getTime(),'/');
                    var price_=t2.transaction_price;
                    if(!/[0-9]/.test(price_)){
                      t2.transaction_price='流拍'
                    }
                    if(t2.logo){
                      t2.logo=t2.logo.replace(/\s/g,'%20');
                      t2.logo=t2.logo.replace(/'/g,'%27');
                    }
                  

                  });
                }); 
              }
                  if(limit!=res.data.list.length){
                    hasMore=false;
                  }
                  that.setData({
                    footList:that.data.footList.concat(res.data.list) 
                  });
            }
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1;
    limit = 5;
    hasMore = true;
      this.getData();
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