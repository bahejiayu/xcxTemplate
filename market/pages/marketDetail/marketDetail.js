// market/pages/marketDetail/marketDetail.js
import util from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading:true,
    showModule:false,
      showBidAll:true,
      showAddPrice:false,
      showBid:false,
      dataInfo:{},
      id:"",
      showAll:false,
      lookMan:[],
      wnub:0,
      bidList:[],
      curPrice:0,
      inpPrice:0,
      endTime:''
  },
  marketPay(){
    util.isAouth();
<<<<<<< HEAD
    if(!util.isAouth()){
      return false;
    }
=======
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
    var that=this;
    var data_=that.data.dataInfo;
      var orderData=[{
        doc_id:that.data.id,
        num:1,
        name:data_.title,
        author:data_.author,
        cbs_id:data_.cbs,
        logo:data_.logo,
        price:data_.discount_pice&&data_.discount_pice!='0.00'?data_.discount_pice:data_.price
      }]
      
      wx.setStorageSync('book_arr', orderData);
      wx.navigateTo({
        url: '../../../car/pages/order/order?type=4&mk=1&yf='+that.data.dataInfo.freight,
      });
  },
  closeAll(){
    this.setData({
      showAuctionxQ:false,
      showModule:false
    });
  },
  showModuleEven(e){
    var that=this;
    var title_=e.currentTarget.dataset.title;
    var html_='';
    if(title_=='拍卖说明'){
      html_=util.formatRichText(that.data.smHtml||'');
    }else if(title_=='交易说明'){
      html_=util.formatRichText(that.data.jyHtml||'');
    }

      this.setData({
        showModule:true,
        moduleData:{
          title:title_,
          html:html_
        }
      });
  },
  readingAll(){
      this.setData({
        showAll:true
      });
  },
  readingMore(){
    this.setData({
      showBidAll:false
    });
  },
  prvImg(e){
    var that=this;
      wx.previewImage({
        urls: that.data.dataInfo.pics,
        current:e.currentTarget.dataset.url
      });
  },
  bidData(){
      var that=this;
      util.request('/market/v1.product/outPriceList',{
        book_id:that.data.id
      },'POST').then(res=>{
          console.log(res);
          if(res.code==0){
            res.data.list.map((item,index)=>{
                  item.created_at=item.created_at.replace(/-/g,'/');
            });
              that.setData({
                bidList:res.data.list
              });
          }

      });


  },
  lookData(){
    var that=this;
      util.request('/market/v1.product/getAllCollect',{
        book_id:that.data.id
      },'POST').then(res=>{
          console.log(res);
          if(res.code==0){
              if(res.data.list.length>3){
                res.data.list=res.data.list.slice(0,3);
                res.data.list.push({
                  avatar:'/images/moreIcon.png'
                });
              }
              that.setData({
                lookMan:res.data.list,
                wnub:res.data.count
              });
          }
      });
  },
   // 切换收藏
   togCollect(e){
    var that=this;
    util.isAouth();
<<<<<<< HEAD
    if(!util.isAouth()){
      return false;
    }
=======
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
    var is_collect=e.currentTarget.dataset.type;
          util.request('/market/v1.product/collect',{
            book_id:that.data.id,
            is_collect:is_collect==0?1:0
          },'POST').then(res=>{
                  console.log(res);
                  if(res.code==0){
                    var obj =that.data.dataInfo;
                    obj.is_collect=is_collect==0?1:0;
                    that.setData({
                      dataInfo:obj
                    });
                      if(is_collect==0){
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
  rangeEven(e){
      var that=this;
      var event_=e.currentTarget.dataset;
      var cur_=this.data.inpPrice*1;
      if(event_.type=='+'){
        cur_+=(that.data.dataInfo.plus_price*1);
      }else{
          if(event_.no!='hAll'){
            cur_-=(that.data.dataInfo.plus_price*1);
            if(cur_<that.data.dataInfo.price){
              cur_=that.data.dataInfo.price*1
            }
            console.log(cur_)
          }
      }
      this.setData({
        inpPrice:cur_.toFixed(2)
      });

  },
  changePrice(e){
    var priceValue=e.detail.value;
    if(priceValue<this.data.dataInfo.price){
      priceValue=this.data.dataInfo.price+'';
    }
    priceValue= priceValue*1
    this.setData({
      inpPrice:priceValue.toFixed(2)
    });
  },
  initData(){
    var that=this;
    // wx.showLoading({
    //   title: '加载中',
    // });
    util.request('/market/v1.product/bookInfo',{
      book_id:that.data.id
    },'POST').then(res=>{
        console.log(res);
        wx.hideLoading();
        if(res.code==0){
          res.data.pics= res.data.pics.split(',');
          res.data.totalPricea=(( res.data.discount_pice!='0.00'&& res.data.discount_pice?res.data.discount_pice: res.data.price)*1+( res.data.freight*1)).toFixed(2);
          res.data.pics.pop();
            that.setData({
              dataInfo:res.data,
              inpPrice:res.data.price
            });
            util.closeL(that,0);

          
            if(res.data.end_time){
              var nowTime= new Date().getTime();
              // var endTime= new Date(res.data.end_time.replace(/-/g,'/')).getTime();
              var endTime= new Date(res.data.end_time.replace(/-/g,'/')).getTime();
              var duTime= endTime-nowTime;
              if(that.dsq){
                  clearInterval(that.dsq);
              }
            that.dsq=setInterval(() => {
                duTime-=1000;
                that.setData({
                  endTime:util.toHHmmss(duTime)
                });
              }, 1000);
            }
        }
    });
  },
  bidEven(){
    util.isAouth();
<<<<<<< HEAD
    if(!util.isAouth()){
      return false;
    }
=======
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
      this.setData({
        showAddPrice:true
      });
  },
  oncePay(){
    var that=this;
      if(that.data.inpPrice<((that.data.dataInfo.price*1)+(that.data.dataInfo.plus_price*1))){
        wx.showModal({
          title: '提示',
          content: '最少加价'+that.data.dataInfo.price+'元',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }


      wx.showLoading({
        title: '出价中',
      });
      util.request('/market/v1.price/out_price',{
        price:that.data.inpPrice,
        book_id:that.data.id
      },'POST').then(res=>{
            wx.hideLoading();
            console.log(res);
          if(res.code=0){
                wx.showToast({
                  title: '出价成功',
                });
                that.setData({
                  showAddPrice:false
                }); 
                that.initData();
                that.bidData();

          }else{
                wx.showToast({
                  title: res.msg,
                  icon:'none'
                });
          }

      });

  },
  closeAddPrice(){
    this.setData({
      showAddPrice:false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
      this.setData({
        id:options.id
      });
      this.initData();
      this.lookData();
      this.bidData();
      this.getHtml(9,'smHtml');
      this.getHtml(8,'jyHtml');

  },
   getHtml(id,obj){
        var that=this;
        util.request('/setting/v1.set/agreement',{
            id:id
        },'POST').then(res=>{
            console.log(res)
            if(res.code==0){
                that.setData({
                  [obj]:res.data
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
    var that=this;
    if(that.dsq){
      clearInterval(that.dsq);

    }

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