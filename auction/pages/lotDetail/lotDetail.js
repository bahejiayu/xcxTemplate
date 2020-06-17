// library/pages/bookDetail/bookDetail.js
import util from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moduleData:{

    },
    showAuctionxQ:false,
    showModule:false,
      bannerIndex:1,
      showPay:false,
      pId:'',
      pData:{}
  },
  pevImg(e){
    var that=this;
    wx.previewImage({
      urls: that.data.pData.pics,
      current:e.currentTarget.dataset.url
    });
},
  closeAll(){
    this.setData({
      showAuctionxQ:false,
      showModule:false
    });
  },
 
  goAuction(){
    var that=this;
      wx.navigateTo({
        url: '../auctionDetail/auctionDetail?id='+that.data.pData.info.title_id,
      });
  },
  // showAuctionEven
  showModuleEven(e){
    var that=this;
    var title_=e.currentTarget.dataset.title;
    var html_='';
    if(title_=='拍品详情'){
      html_=util.formatRichText(that.data.pData.info.paipin_content);
    }else if(title_=='品相报告'){
      html_=util.formatRichText(that.data.pData.info.condition_content);
    }else if(title_=='来源/著录'){
      html_=util.formatRichText(that.data.pData.info.source_content);
    }

      this.setData({
        showModule:true,
        moduleData:{
          title:title_,
          html:html_
        }
      });
  },
   // 切换收藏
   togCollect(e){
     util.isAouth();
    var that=this;
    var collectType=e.currentTarget.dataset.type;
          util.request('/goods/v2.home/setCollect',{
            goods_id:that.data.pId,
            iscollect:collectType==0?1:0
          },'POST').then(res=>{
                  console.log(res);
                  if(res.code==0){
                    var obj =that.data.pData;
                    obj.iscollect=collectType==0?1:0;
                    that.setData({
                      pData:obj
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
  initDetail(){
    wx.showLoading({
      title: '加载中',
    });
    var that=this;
      util.request('/goods/v1.pages/detail',{
        id:that.data.pId
      },'POST').then(res=>{
          console.log(res);
          wx.hideLoading({
            complete: (res) => {},
          });
          if(!/[0-9]/.test(res.data.info.transaction_price)){
            res.data.info.transaction_price='流拍'
          }
          res.data.info.size=res.data.info.size.replace(/&nbsp;/g,' ');
          res.data.pics.map((item,index)=>{
            if(item){
              item=item.replace(/\s/g,'%20');
              item=item.replace(/'/g,'%27');
            }
           
          });
          if(res.code==0){
              that.setData({
                pData:res.data
              });
          }
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      pId:options.id
    });
    this.setData({
      userInfo:wx.getStorageSync('userInfo')
    });
    this.initDetail();
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
    this.setData({
      userInfo:wx.getStorageSync('userInfo')
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