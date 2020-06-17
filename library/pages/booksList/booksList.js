

import util from '../../../utils/util.js'
var page=1;
var limit=8;
var isFlag=true;
var hasMore=true;
var postKey='';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    postData:{
      cat_id:"",  //分类ID
      cbs_id:'', //出版社ID
      language_id:'', 
      cate_id:'', //书籍类别
      price:'',
      startTime:'',
      endTime:'',

      niandai:'', //图录年代的升降序
      paimai_city:'',//图录拍卖地区
      cbTime:''
    },
    paiCity:[],  //图录拍卖地区列表
    chkType:'综合',
    
    condBookData:{},
    pickerList:[],
    showScreen:false,   //筛选的显示隐藏,
    showPress:false, //出版社
    showBookType:false, //书籍分类
    libtype:"1",
    KeyWord:"",
    indicator:0,
    list:[],
    imgs:[],
    enTxt:''
  },
  goTxt(e){
    this.setData({
      enTxt:e.currentTarget.dataset.txt
    });
    wx.showToast({
      title: e.currentTarget.dataset.txt,
      icon:'none'
    });
    wx.vibrateShort();
},
  getPaiCity(){
    var that=this;
      util.request('/goods/v1.cats/searchTag',{},'POST').then(res=>{
        console.log(res);
          if(res.code==0){
              that.setData({
                paiCity:res.data.list
              });
          }
      });
  },
  changeXl(e){
    var that=this;
   
    this.clearData();
      this.setData({
        chkType:'系列'
      });
      var obj=that.data.postData;
      obj.price='';
      obj.cat_id=this.data.condBookData.cats[e.detail.value].value;

      that.setData({
        postData:obj
      });
      isFlag=false;
      that.initData();


  },
  togCateId(e){
    var obj= this.data.postData
    obj.cate_id=e.currentTarget.dataset.id;
    this.setData({
      postData:obj
    });
  },
  togLange(e){
    var obj= this.data.postData
    obj.language_id=e.currentTarget.dataset.id;
    this.setData({
      postData:obj
    });
  },
  togpaiCity(e){
    var obj= this.data.postData
    obj.paimai_city=e.currentTarget.dataset.id;
    this.setData({
      postData:obj
    });
  },
  togCatId(e){
    var obj= this.data.postData
    obj.cat_id=e.currentTarget.dataset.value;
    this.setData({
      postData:obj
    });
    isFlag=true;
  },
  preeBtn(e){
    var obj= this.data.postData
    obj.cbs_id=e.currentTarget.dataset.value;
    this.setData({
      postData:obj
    });
  },
  getTime(e){
    console.log(e)
    var obj=this.data.postData;
    obj[e.currentTarget.dataset.type]=e.detail.value;
      this.setData({
        postData:obj
      });
  },
  bindClose_(){
      if(this.data.showBookType){
          this.setData({
            showBookType:false
          });
      }else{
        this.setData({
          showBookType:false,
          showScreen:false

        });
      }
  },
  closeRange(){
    this.setData({
      showScreen:false
    });
  },
  closePress(e){
    if(e.currentTarget.dataset.txt=='取消'){
      var obj= this.data.postData
      obj.cbs_id='';
      this.setData({
        postData:obj
      });
    }else{

    }
   


    this.setData({
      showPress:false,
    });
  },
  showPress(){
    this.setData({
      showPress:true
    });
  },
  showBookType(){
      this.setData({
        showBookType:true
      });
  },
  closeBookType(e){
      if(e.currentTarget.dataset.txt=='取消'){
        var obj= this.data.postData
        obj.cat_id='';
        this.setData({
          postData:obj
        });
      }else{

      }

   
    this.setData({
      showBookType:false
    });
},
sureRange(){

  var obj=this.data.postData;

  obj.price='';
  if(!isFlag){
    obj.cat_id=''
  };
    this.setData({
      postData:obj,
      chkType:'筛选',
      showScreen:false
    });
    this.initData();

},
reSet(){
  var obj= this.data.postData;
  obj.cbs_id='';
  obj.language_id='';
  obj.cate_id='';
  // obj.price='';
  obj.startTime='';
  obj.endTime='';
  obj.paimai_city='';
  obj.cbTime='';
  this.setData({
    postData:obj
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
  postKey=keyWordTxt;
  var that=this;
  this.clearData();
  this.setData({
    chkType:'综合'
  });
  this.initData();

},
togType(e){
  var that=this;
  if(e.currentTarget.dataset.type=='综合'){
    this.clearData();
  }
    if(e.currentTarget.dataset.type=='价格'||e.currentTarget.dataset.type=='综合'||e.currentTarget.dataset.type=='年代'){
      this.setData({
        chkType:e.currentTarget.dataset.type
      });
      page=1;
    }
    if(e.currentTarget.dataset.type=='价格'){
      var obj=this.data.postData;
      for(var key in obj ){
          if(key!='price'){
              obj[key]=''
          }
      };
      this.setData({
        postData:obj
      });
        var priceTxt=that.data.postData;
        console.log(priceTxt.price)
        if(priceTxt.price==''){
          priceTxt.price='desc';
          that.initData();
        }else if(priceTxt.price=='desc'){
          priceTxt.price='asc';
        }else if(priceTxt.price=='asc'){
          priceTxt.price='desc';
        }
        that.setData({
          postData:priceTxt
        });
        that.initData();
        return false;
    }

    if(e.currentTarget.dataset.type=='年代'){
      var obj=this.data.postData;
      for(var key in obj ){
          if(key!='niandai'){
              obj[key]=''
          }
      };
      this.setData({
        postData:obj
      });
        var priceTxt=that.data.postData;
        console.log(priceTxt.niandai)
        if(priceTxt.niandai==''){
          priceTxt.niandai='desc';
          that.initData();
        }else if(priceTxt.niandai=='desc'){
          priceTxt.niandai='asc';
        }else if(priceTxt.niandai=='asc'){
          priceTxt.niandai='desc';
        }
        that.setData({
          postData:priceTxt
        });
        that.initData();
        return false;
    }



    if(e.currentTarget.dataset.type=='筛选'){
      that.setData({
        showScreen:true
      });
     
    };

      if(e.currentTarget.dataset.type=='综合'){
          // var obj=that.data.postData;
          // obj.price='';
          // that.setData({
          //   postData:obj
          // });
          that.initData();
      }

      
},
clearData(){
    var obj=this.data.postData;
    for(var key in obj ){
      obj[key]='';
    };
    this.setData({
      postData:obj
    });
},
  togLibType(e){
    
      this.setData({
        libtype:e.currentTarget.dataset.libtype,
        chkType:'综合'

      });
      this.clearData();
      this.initData();


  },
  changeKeyWord(e){
      this.setData({
        KeyWord:e.detail.value
      });
  },
  swiperChange(e){
    this.setData({
      indicator:e.detail.current
    });
},

//  获取图筛选条件
 getCondBook(){
   var that=this;
  util.request('/doc/v1.pages/getSearchData').then(res=>{
      console.log(res);
      if(res.code==0){
       
        that.setData({
          condBookData:res.data
        });
     
      }
  });
 },
 initData(){
   console.log(this.data.postData)
  //  this.data.postData
   var data=this.data.postData;
   var that=this;
   page=1;
   data.page=page;
   data.limit=limit;
   data.keyword=postKey;
   wx.pageScrollTo({
    scrollTop:0,
    duration:0
  });
   wx.showLoading({
     title: '加载中',
   });
   var url=this.data.libtype==0?"/doc/v1.pages/getTuDocList":"/doc/v1.pages/tuDocList";

    util.request(url,data,'POST').then(res=>{
        wx.hideLoading();
        hasMore=true;

        if(res.code==0){
          console.log(res)
          page=1;
          if(limit!=res.data.list.length){
            console.log(1111111111)
            hasMore=false;
        }
        // res.data.list.map((item,index)=>{
        //   item.publication_time=item.publication_time.split('-')[0];
        // });

            that.setData({
              list:res.data.list
            });
        }
    });
 },
 moreData(){
  console.log(this.data.postData)
 //  this.data.postData
  var data=this.data.postData;
  var that=this;
  page++;
  data.page=page;
  data.limit=limit;
  data.keyword=postKey;
  wx.showLoading({
    title: '加载更多',
  });
  var url=this.data.libtype==0?"/doc/v1.pages/getTuDocList":"/doc/v1.pages/tuDocList";
   util.request(url,data,'POST').then(res=>{
       wx.hideLoading();
       if(res.code==0){
         console.log(res)
          if(limit!=res.data.list.length){
              hasMore=false;
          }


           that.setData({
             list:that.data.list.concat(res.data.list) 
           });
       }
   });
},
//  获取banner
 getBookBanner(){
   var that=this;
    util.request('/setting/v1.Set/docBanner').then(res=>{
        console.log(res);
          if(res.code==0){
            
              that.setData({
                imgs:res.data.list
              });
          }
    });
 },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
         this.setData({
            libtype:options.type
          });
          if(options.type==1){
              wx.setNavigationBarTitle({
                title: '图录',
              })
          }
      


        this.getCondBook();
        this.initData();
        this.getBookBanner();
        this.getPaiCity()
         page=1;
         limit=8;
         isFlag=true;
         hasMore=true;
         postKey='';
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
    if(this.data.showScreen||this.data.showPress){
      wx.stopPullDownRefresh();
        return false;
    }
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