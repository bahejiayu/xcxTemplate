
import util from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据R
   */
  data: {
    indicator:0,
    bannerList:[],
    bookList:[{},{},{}],
    previewList:[{},{},{},{}],
    resultList:[{},{},{},{}],
    artNewList:[]
  },
<<<<<<< HEAD
  loadSuccess(e){
      console.log(e);
  },
=======
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
  goTabBar(e){
    util.wxRouter('switchTab',e.currentTarget.dataset.url)
  },
  goNav(e){
    util.wxRouter('navigateTo',e.currentTarget.dataset.url)
  },
  
  swiperChange(e){
   
      this.setData({
        indicator:e.detail.current
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 获取首页轮播图数据
  getBanner(){  
    var that=this;
      util.request('/api/v1.opt/home').then(res=>{
            if(res.code==0){
              res.data.banner.map((item,index)=>{
                  var wpUrl='';
                  if(item.path_type==1){
                    wpUrl='/library/pages/bookDetail/bookDetail?id='+item.path_id
                  }else if(item.path_type==2){
                        if(item.goods_url_type==1){
                          wpUrl='/auction/pages/auctionDetail/auctionDetail?id='+item.path_id
                        }else{
                          wpUrl='/auction/pages/lotDetail/lotDetail?id='+item.path_id
                        }
                  }else{
                    wpUrl='/pages/artNewDetail/artNewDetail?id='+item.path_id
                  }
                item.wpUrl=wpUrl;
              });
                that.setData({
                  bannerList:res.data.banner
                });
            }
      });
  },
    // 获取首页书籍数据
    getBookData(){  
      var that=this;
        util.request('/doc/v1.pages/getDocList').then(res=>{
              if(res.code==0){
                  that.setData({
                    bookList:res.data.list
                  });
              }
        });
    },
    errimg(e){
      console.log(e);
          util.errImg(e,this,'/images/jpImg.png','pics');
    },
    getPreview(){  
      var that=this;
        util.request('/doc/v1.pages/yuZhanGoodsList',{page:1,limit:4}).then(res=>{
              if(res.code==0){
                res.data.list.map((item,index)=>{
                  if(item.pics){
                    item.pics=item.pics.replace(/\s/g,'%20');
                    item.pics=item.pics.replace(/'/g,'%27');
                  }
<<<<<<< HEAD
                  item.cn_name=item.cn_name.trim();
=======
                 
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
                });

                  that.setData({
                    previewList:res.data.list
                  });
              }
        });
    },
    // 获取拍卖结果
    resultList(){
      var that=this;
      util.request('/doc/v1.pages/passGoodsList').then(res=>{
            if(res.code==0){
              res.data.list.map((item,index)=>{
<<<<<<< HEAD

=======
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
                if(item.pics){
                  item.pics=item.pics.replace(/\s/g,'%20');
                  item.pics=item.pics.replace(/'/g,'%27');
                }
<<<<<<< HEAD
                item.cn_name=item.cn_name.trim();
=======
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
             
              });

           
                that.setData({
                  resultList:res.data.list
                });
            }
      });
    },
    // 艺术资讯
    getArtNews(){
      var that=this;
      util.request('/doc/v1.pages/newsList',{
        page:1,
        limit:3
      },'POST').then(res=>{
            if(res.code==0){
              console.log(res)
             res.data.list.map((item,index)=>{
<<<<<<< HEAD
                item.created_at=  `${new Date(item.created_at.replace(/-/g,'/')).getMonth()}月${new Date(item.created_at.replace(/-/g,'/')).getDate()}日`
=======
                item.created_at=  `${new Date(item.created_at.replace(/-/g,'/')).getMonth()}月${new Date(item.created_at.replace(/-/g,'/')).getDay()}日`
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
              });
                that.setData({
                  artNewList:res.data.list
                });
            }
      });
    },
  onLoad: function (options) {
    // wx.setStorageSync('token', '1fa8ada1894ec2c36e78029e3da34ae6');
    util.request('/goods/v1.pages/newValueBeat',{
      goods_id: "38666"
    },'POST').then(res=>{
        console.log(res);
    });


 
 
      this.getBanner();
      this.getBookData();
      this.getPreview();
      this.resultList();
      this.getArtNews();
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
    wx.showTabBar();
    
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