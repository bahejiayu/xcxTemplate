// pages/artNews/artNews.js
import util from '../../utils/util.js';
var page = 1;
var limit = 5;
var hasMore = true;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [],
    dataList:[],
    curNav: ''
  },
  togNav(e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    this.setData({
      curNav: e.currentTarget.dataset.id
    });
    this.initData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1;
    limit = 5;
    hasMore = true;
    var that = this;
    util.request('/news/v1.cats/myLists', {}, 'POST').then(res => {
      console.log(res)
      if (res.code == 0) {
        if (res.data.list.length > 0) {
          that.setData({
            curNav: res.data.list[0].id
          });

            

        }
        that.setData({
          navList: res.data.list
        });
        that.initData();
      }

    });
  },
  initData(){
    var that=this;
      page=1;
      wx.showLoading({
        title: '加载中',
      });
      util.request('/news/v1.pages/myLists',{
        page:page,
        limit:limit,
        cat_id:that.data.curNav
      },'POST').then(res=>{
          console.log(res);
          wx.hideLoading()
            if(res.code==0){  
              hasMore=true;
              res.data.list.map((item,index)=>{
                item.updated_at=item.updated_at.replace(/-/g,'/');
              });
                if(res.data.list.length!=limit){
                    hasMore=false;
                }
                that.setData({
                  dataList:res.data.list
                });
            }
      });


  },
  moreData(){
    var that=this;
      page++;
      wx.showLoading({
        title: '加载中',
      });
      util.request('/news/v1.pages/myLists',{
        page:page,
        limit:limit,
        cat_id:that.data.curNav
      },'POST').then(res=>{
          console.log(res);
          wx.hideLoading()
            if(res.code==0){  
              hasMore=true;
              res.data.list.map((item,index)=>{
                item.updated_at=item.updated_at.replace(/-/g,'/');
              });
                if(res.data.list.length!=limit){
                    hasMore=false;
                }
                that.setData({
                  dataList:that.data.dataList.concat(res.data.list)  
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