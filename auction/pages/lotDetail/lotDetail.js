// library/pages/bookDetail/bookDetail.js
import util from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moduleData:{

    },
<<<<<<< HEAD
    showZs:false,
=======
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
    showAuctionxQ:false,
    showModule:false,
      bannerIndex:1,
      showPay:false,
      pId:'',
      pData:{}
  },
<<<<<<< HEAD
  priceBtn(){

      util.isAouth();
      if(!util.isAouth()){
        return false;
      }
      var that=this;

      if(that.data.userInfo.is_vip==1){
          wx.navigateTo({
            url: '../priceZs/priceZs?id='+that.data.pId,
          });
      }else{
        wx.navigateTo({
          url: '/pages/buyVip/buyVip',
        });
       
      }



  },
  errimg(e){
    var obj=this.data.pData;
    obj.pics[e.currentTarget.dataset.index]='/images/showGood.png';
    this.setData({
      pData:obj
    });

  },
=======
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
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
<<<<<<< HEAD
     if(!util.isAouth()){
      return false;
    }
=======
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
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
<<<<<<< HEAD
      util.axiosRequest('/goods/v1.pages/detail',{
=======
      util.request('/goods/v1.pages/detail',{
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
        id:that.data.pId
      },'POST').then(res=>{
          console.log(res);
          wx.hideLoading({
            complete: (res) => {},
          });
<<<<<<< HEAD
     
          if(res.code==0){
            if(!/[0-9]/.test(res.data.info.transaction_price)){
              res.data.info.transaction_price='流拍'
            }
            if(res.data.info.size){
              res.data.info.size=res.data.info.size.replace(/&nbsp;/g,' ');
            }
        var bannerJy= res.data.pics.map((item,index)=>{
              if(item){
                console.log(item);
                item=item.replace(/\s/g,'%20');
                item=item.replace(/'/g,'%27');
                console.log(item);
                return item;
              }
            });
              console.log(res.data.pics)
              that.setData({
                bannerJy,
=======
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
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
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
<<<<<<< HEAD
    var that=this;
    if(!wx.getStorageSync('token')){
        that.setData({
          showZs:true,
          userInfo:null
        });
    }else{
      util.getUserInfo(res=>{
        console.log(res)
          that.setData({
            showZs:true,
            userInfo:res
          });
      });
    }

   
   
=======
    this.setData({
      userInfo:wx.getStorageSync('userInfo')
    });
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
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
<<<<<<< HEAD
    // this.setData({
    //   userInfo:wx.getStorageSync('userInfo')
    // });
=======
    this.setData({
      userInfo:wx.getStorageSync('userInfo')
    });
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
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