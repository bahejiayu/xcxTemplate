// pages/search/search.js
import util from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      type:1,
      hotList:[],
      hotKey:"",
      KeyWord:''
  },
  changeKeyWord(e){
    this.setData({
      KeyWord:e.detail.value
    });
},
enterInp(e){
  var keyWordTxt= e.detail.value;
  if(keyWordTxt.trim()==''){
      wx.showToast({
        title: '请输入关键字',
        icon:'none'
      });
      return false;
  }
  var searchUrl='';
  if(this.data.type==1){
    searchUrl='../librarySearch/librarySearch?keyword='+keyWordTxt;
  }else if(this.data.type==2){
    searchUrl='../auctionSearch/auctionSearch?keyword='+keyWordTxt;
  }else {
    searchUrl='../marketSearch/marketSearch?keyword='+keyWordTxt;
  }
  wx.navigateTo({
    url: searchUrl,
  });
},
goHotSearch(){
  var that=this;
    this.setData({
      KeyWord:that.data.hotKey
    });
    var searchUrl='';
    if(this.data.type==1){
      searchUrl='../librarySearch/librarySearch?keyword='+that.data.hotKey;
    }else if(this.data.type==2){
      searchUrl='../auctionSearch/auctionSearch?keyword='+that.data.hotKey;
    }else {
      searchUrl='../marketSearch/marketSearch?keyword='+that.data.hotKey;
    }
    wx.navigateTo({
      url: searchUrl,
    });


},
  togType(e){
      this.setData({
        type:e.currentTarget.dataset.type
      });
      this.setData({
        hotList:[]
      });
      this.initHotSearch();
  },
  togHuan(){
      this.setData({
        hotList:[]
      });
      this.initHotSearch();
  },
  initHotSearch(){
     
      var that=this;
      util.request('/setting/v1.set/hotWords',{
        type:that.data.type
      },'POST').then(res=>{
            wx.hideLoading();
            console.log(res);
              if(res.code==0){
                  that.setData({
                    hotKey:res.data.keyword,
                    hotList:res.data.list
                  });
              }
      });


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.initHotSearch();
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