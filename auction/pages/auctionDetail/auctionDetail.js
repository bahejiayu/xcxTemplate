// auction/pages/auctionDetail/auctionDetail.js
import util from '../../../utils/util.js'

var page = 1;
var limit = 10;
var hasMore = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    postData: {
      lot: '',
      price: ''
    },
    pList: [],
    auctionInfo: {}
  },
  errorImg:function(e){
    console.log(11111);
        util.errImg(e,this);
  },
  loadOK(){
      console.log(222)
  },
  lotSort(e){
    var obj=this.data.postData;
    var key_=e.currentTarget.dataset.type;
    if(obj[key_]==''){
      obj[key_]='desc';
    }else  if(obj[key_]=='desc'){
      obj[key_]='asc';
    }else if(obj[key_]=='asc'){
      obj[key_]='desc';
    }
    this.setData({
      postData:obj
    });
    this.initData();

  },
  initData() {
    wx.showLoading({
      title: '加载中',
    });
    page=1;
    hasMore=true;
    var that = this;
    var data_ = this.data.postData;
    data_.id = that.data.id;
    data_.page = page;
    data_.limit = limit;
    util.request('/goods/v2.home/paiInfo', data_, 'POST').then(res => {
      wx.hideLoading({
        complete: (res) => {},
      });
      if (res.code == 0) {
   
        res.data.info.pass_time = util.formatTime2(new Date(res.data.info.pass_time.replace(/-/g, '/')).getTime(), '/');
        if(res.data.info.list.length!=limit){
              hasMore=false;
        }
        res.data.info.list.map((item, index) => {
          var price_ = item.transaction_price;
          if (!/[0-9]/.test(price_)) {
            item.transaction_price = '流拍'
          }
          console.log(item.logo)
          if(item.logo){
            item.logo=item.logo.replace(/\s/g,'%20');
            item.logo=item.logo.replace(/'/g,'%27');
          }
          item.cn_name=item.cn_name.trim();
        });
        if(res.data.info.logo_pic){
          res.data.info.logo_pic=res.data.info.logo_pic.replace(/\s/g,'%20');
          res.data.info.logo_pic=res.data.info.logo_pic.replace(/'/g,'%27');
        }
    
        that.setData({
          auctionInfo: res.data.info,
          pList: res.data.info.list
        });
      }
      console.log(res);
    });
  },
  moreData() {
    wx.showLoading({
      title: '加载更多',
    });
    page++;
    var that = this;
    var data_ = this.data.postData;
    data_.id = that.data.id;
    data_.page = page;
    data_.limit = limit;
    util.request('/goods/v2.home/paiInfo', data_, 'POST').then(res => {
      wx.hideLoading({
        complete: (res) => {},
      });
      if (res.code == 0) {
    
        res.data.info.pass_time = util.formatTime2(new Date(res.data.info.pass_time.replace(/-/g, '/')).getTime(), '/');
        if(res.data.info.list.length!=limit){
              hasMore=false;
        }
        res.data.info.list.map((item, index) => {
          var price_ = item.transaction_price;
          if (!/[0-9]/.test(price_)) {
            item.transaction_price = '流拍'
          }
          if(item.logo){
            item.logo=item.logo.replace(/\s/g,'%20');
            item.logo=item.logo.replace(/'/g,'%27');
          }
          item.cn_name=item.cn_name.trim();
       
        });
        that.setData({
          auctionInfo: res.data.info,
          pList:that.data.pList.concat(res.data.info.list)
        });
      }
      console.log(res);
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     page = 1;
     limit = 10;
     hasMore = true;
    this.setData({
      id: options.id
    })
    this.initData();

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