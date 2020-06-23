import util from '../../utils/util.js'
var postkey = '';
var page = 1;
var limit = 8;
var hasMore = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    KeyWord: "",
    shelfList: []
  },
  itemTap(e){
    var item_=this.data.shelfList[e.currentTarget.dataset.index];
    wx.showLoading({
      title: '请稍等',
    });
      if(e.currentTarget.dataset.mian==1){
          util.request('/setting/v1.set/getDocKey',{
            doc_id:item_.doc_id,
            page_num:item_.page_num
          },'POST').then(res=>{
            wx.hideLoading();
              console.log(res);
                if(res.code==0){
                  // changeURLParam('page', Math.ceil(page_ / 50));
                  // changeURLParam('go', page_ % 50==0?50:page_ % 50);
                    var page_=Math.ceil(res.data / 50);
                    var go_=res.data % 50==0?50:res.data % 50;
                    console.log(page_,go_);
                    wx.navigateTo({
                      url: `/pages/readH/readH?id=${item_.doc_id}&go=${go_}&page=${page_}`,
                    })


                }
          });
      }else{
            wx.navigateTo({
              url: e.currentTarget.dataset.url,
            });
      }
  },
  changeKeyWord(e) {
    this.setData({
      KeyWord: e.detail.value
    });
  },
  enterInp(e) {
    var keyWordTxt = e.detail.value;
    if (keyWordTxt.trim() == '') {
      wx.showToast({
        title: '请输入关键字',
        icon: 'none'
      });
      return false;
    }
    postkey= e.detail.value;
    wx.pageScrollTo({
      scrollTop:0,
      duration:0
    });
    this.initData();
  },
  initData() {
    var that=this;
      page=1;
      wx.showLoading({
        title: '搜索中',
      });
    util.request('/users/v1.orders/vipSearch',{
        page:page,
        limit:limit,
        keyword:postkey
    },'POST').then(res=>{
        console.log(res);
        hasMore=true;
        wx.hideLoading();
        if(res.code==0){
              if(limit!=res.data.list.length){
                  hasMore=false;
              }
              that.setData({
                shelfList:res.data.list
              });
        }
    });     
  },
  moreData() {
    var that=this;
      page++;
      wx.showLoading({
        title: '加载更多',
      });
    util.request('/users/v1.orders/vipSearch',{
        page:page,
        limit:limit,
        keyword:postkey
    },'POST').then(res=>{
        console.log(res);
        hasMore=true;
        wx.hideLoading();
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      KeyWord: options.keyword || ""
    });
    postkey = options.keyword || "";
    page = 1;
    limit = 8;
    hasMore = true;
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