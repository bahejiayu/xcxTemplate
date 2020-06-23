

import util from '../../utils/util.js'
var page=1;
var limit=10;
var isFlag=true;
var hasMore=true;
var postKey='';


Page({
  /**
   * 页面的初始数据
   */
  data: {
    layerList:[
        '全新',
        '一成新',
        '二成新',
        '三成新',
        '四成新',
        '五成新',
        '六成新',
        '七成新',
        '八成新',
        '九成新',
    ],
    typeList:[
        {
          name:'一口价',
          id:1
        },
        {
          name:'拍卖',
          id:2
        }

    ],
    postData:{
      is_baoyou:'', //是否包邮
      type:'',  //一口价  拍卖
      created_at:"",  //最新
      degree:'',// 新旧层度
      cbs_id:'', //出版社ID
      price:'', 
      keyword:''
    },
    chkType:'综合',
    condBookData:{},
    pickerList:[],
    showScreen:false,   //筛选的显示隐藏,
    showPress:false, //出版社
    showBookType:false, //书籍分类
    libtype:"0",
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
  enterInp(e){
    var keyWordTxt= e.detail.value;
    // if(keyWordTxt.trim()==''){
    //     wx.showToast({
    //       title: '请输入关键字',
    //       icon:'none'
    //     });
    //     return false;
    // }
    var obj=this.data.postData;
    this.setData({
      chkType:'综合',
      postData:{
        is_baoyou:'', //是否包邮
        type:'',  //一口价  拍卖
        created_at:"",  //最新
        degree:'',// 新旧层度
        cbs_id:'', //出版社ID
        price:''
   
      },
    });
    postKey=keyWordTxt||'';

  this.initData();

  
  },
  closeRange(){
      console.log(111)
      this.setData({
        showScreen:false
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
    obj.type=e.currentTarget.dataset.id;
    this.setData({
      postData:obj
    });
  },
  togBao(e){
    var obj= this.data.postData
    obj.is_baoyou=e.currentTarget.dataset.id;
    this.setData({
      postData:obj
    });
  },
  togDegree(e){
    var obj= this.data.postData
    obj.degree=e.currentTarget.dataset.value;
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
    console.log(this.data.showBookType)
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
        obj.degree='';
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
  obj.created_at='';
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
  obj.degree='';
  obj.type='';
  obj.is_baoyou='';

  this.setData({
    postData:obj
  });
},
togType(e){
  var that=this;
  console.log(e.currentTarget.dataset.type)
  if(e.currentTarget.dataset.type=='综合'||e.currentTarget.dataset.type=='最新'){
    this.clearData();
  }

  if(e.currentTarget.dataset.type=='最新'){
    var obj=this.data.postData;
    obj.created_at='desc'
      this.setData({
        postData:obj
      });
      that.initData();

  }
  if(e.currentTarget.dataset.type!='筛选'){
    console.log(e.currentTarget.dataset.type);
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
          that.setData({
            postData:priceTxt
          });
          that.initData();
          return false;
        }
        if(priceTxt.price=='desc'){
          priceTxt.price='asc';
          that.setData({
            postData:priceTxt
          });
          that.initData();

          return false;
        }
        if(priceTxt.price=='asc'){
          priceTxt.price='desc';
          that.setData({
            postData:priceTxt
          });
          that.initData();
          return false;
        }
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
   wx.pageScrollTo({
     scrollTop:0,
     duration:0
   });
  //  this.data.postData
   var data=this.data.postData;
   var that=this;
   page=1;
   data.page=page;
   data.limit=limit;
   data.keyword=postKey;
   wx.showLoading({
     title: '加载中',
   });

    util.request('/market/v1.product/list',data,'POST').then(res=>{
        wx.hideLoading();
        wx.stopPullDownRefresh();
        hasMore=true;
        if(res.code==0){

          console.log(res)
          page=1;
          if(limit!=res.data.list.length){
            console.log(1111111111)
            hasMore=false;
        }
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
  
   util.request('/market/v1.product/list',data,'POST').then(res=>{
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        this.getCondBook();
        this.initData();
         page=1;
         limit=10;
         isFlag=true;
         hasMore=true;
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
    if(this.data.showScreen||this.data.showPress){
      wx.stopPullDownRefresh();
        return false;
    }
        this.setData({
          chkType:'综合',
          KeyWord:'',
          postData:{
            is_baoyou:'', //是否包邮
            type:'',  //一口价  拍卖
            created_at:"",  //最新
            degree:'',// 新旧层度
            cbs_id:'', //出版社ID
            price:''
            
          }
        });
        postKey='';
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