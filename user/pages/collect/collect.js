// user/pages/collect/collect.js
import util from '../../../utils/util.js';
var page = 1;
var limit = 8;
var hasMore = true;
var startX=0;
var startY=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:true,
    collectType: 3,
    collectList: []
  },
  addCar(e){
    var that=this;
    wx.showLoading({
      title: '加入中',
    });
    util.request('/users/v1.car/addCar',{
      doc_id:e.currentTarget.dataset.id
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
  addBookSelf(e){
    var that=this;
    wx.showLoading({
      title: '加入中',
    });
    util.request('/users/v1.me/addBookShelf',{
      doc_id:e.currentTarget.dataset.id
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
  delItem(e){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确认删除',
      success (res) {
        if (res.confirm) {
              util.request('/users/v1.me/delCollect',{
                collect_id:e.currentTarget.dataset.cid
              },'POST').then(res=>{
                    console.log(res);
                  if(res.code==0){
                        wx.showToast({
                          title: '删除成功',
                          icon:'none'
                        });
                        that.initData();
                 

                  }else{
                        wx.showToast({
                          title: res.msg,
                          icon:"none"
                        });
                  }

              });
        } 
      }
    })
  },
  st: function(e) {
  
    startX= e.touches[0].clientX;
    startY= e.touches[0].clientY;

  },
  end: function(e) {
    var that = this;
    var jianX = e.changedTouches[0].clientX - startX;
    var jianY = e.changedTouches[0].clientY - startY;
    var obj= this.data.collectList;
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
      collectList:obj
     });
  },
  togCollect(e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration:0
    });
    this.setData({
      collectType: e.currentTarget.dataset.type,
      isShow:false
    });
     this.initData();
  },
  errImg(e){
      util.errImg(e,this);
   
  },
  initData() {
    // 0=资讯
    // 1=拍品
    // 2=市集
    // 3=图书
    wx.showLoading({
      title: '加载中',
    });
    wx.pageScrollTo({
      pageScrollTo:0,
      duration:0
    });
    var that = this;
    page=1;
    util.request('/users/v1.me/collect', {
      page,
      limit,
      type: that.data.collectType
    }, 'POST').then(res => {
      console.log(res);
      hasMore=true;
      wx.stopPullDownRefresh({
        complete: (res) => {},
      });
      wx.hideLoading({
        complete: (res) => {},
      });
      setTimeout(() => {
        that.setData({
          isShow:true
         });
      }, 100);
      if (res.code == 0) {
          if(that.data.collectType==1){
              res.data.list.map((item,index)=>{
                item.auction_time= util.formatTime2(new Date(item.auction_time.replace(/-/g,'/')).getTime(),'/');
                var price_=item.transaction_price;
                if(!/[0-9]/.test(price_)){
                  item.transaction_price='流拍'
                }
                if(item.logo){
                  item.logo=item.logo.replace(/\s/g,'%20');
                  item.logo=item.logo.replace(/'/g,'%27');
                }
                item.cn_name=item.cn_name.trim();
              }); 
          }
          if(that.data.collectType==0){
            res.data.list.map((item,index)=>{
              item.created_at=  `${new Date(item.created_at.replace(/-/g,'/')).getMonth()}月${new Date(item.created_at.replace(/-/g,'/')).getDate()}日`
            });
          }

          if(limit!=res.data.list.length){
              hasMore=false;
          }
        that.setData({
          collectList: res.data.list
        });
      }
    });
  },
  moreData() {
    wx.showLoading({
      title: '加载更多',
    });
    var that = this;
    page++;
    util.request('/users/v1.me/collect', {
      page,
      limit,
      type: that.data.collectType
    }, 'POST').then(res => {
      console.log(res);
      wx.hideLoading({
        complete: (res) => {},
      });
      if (res.code == 0) {
          if(limit!=res.data.list.length){
              hasMore=false;
          }

          if(that.data.collectType==1){
            res.data.list.map((item,index)=>{
              item.auction_time= util.formatTime2(new Date(item.auction_time.replace(/-/g,'/')).getTime(),'/');
              var price_=item.transaction_price;
              if(!/[0-9]/.test(price_)){
                item.transaction_price='流拍'
              }
              if(item.logo){
                item.logo=item.logo.replace(/\s/g,'%20');
                item.logo=item.logo.replace(/'/g,'%27');
              }
              item.cn_name=item.cn_name.trim();
            }); 
        }
        if(that.data.collectType==0){
          res.data.list.map((item,index)=>{
            item.created_at=  `${new Date(item.created_at.replace(/-/g,'/')).getMonth()}月${new Date(item.created_at.replace(/-/g,'/')).getDate()}日`
          });

        }

        that.setData({
          collectList:that.data.collectList.concat(res.data.list) 
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    page = 1;
    limit = 8;
    hasMore = true;
    that.initData();


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
      console.log(hasMore);
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