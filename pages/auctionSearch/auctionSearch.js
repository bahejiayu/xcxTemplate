
import util from '../../utils/util.js';
var page=1;
var limit=8;
var hasMore=true;
var postKey='';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    KeyWord:"",
    selData:{},
    ppData:[],
    pmhData:[],
    stateList:[],
    companyList:[],
    endYear:'',
    type1Data:{
      pai_city:"", //地区
      au_company: '', //公司
      years:"",   //年份 
      is_pass:"",   //状态 
      sort: "",
    },
    auctionType:1,
    showScreen:false,   //筛选的显示隐藏,
    showCity:false,   //地区显示隐藏
    indicator:0,
    yearData:[]
  },
  errImg(e){
        var list_=this.data.ppData;
        list_[e.currentTarget.dataset.index].logo='/images/showGood.png';
        this.setData({
          ppData:list_
        });

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
  postKey=keyWordTxt;
  var that=this;
  this.setData({
    type1Data:{
      pai_city:"", //地区
      au_company: '', //公司
      years:"",   //年份 
      is_pass:"",   //状态 
      sort: "",
    }
  })
  that.initPpData();

},
  imgErro(e){
    console.log(e)
      var index_=e.currentTarget.dataset.index;
      var data_=this.data[e.currentTarget.dataset.form];
      data_[index_].logo='/images/showGood.png';
      this.setData({
        [e.currentTarget.dataset.form]:data_
      });
  },
  togAuction(e){
      this.setData({
        auctionType:e.currentTarget.dataset.type,
        type1Data:{
          pai_city:"", //地区
          au_company: '', //公司
          years:"",   //年份 
          is_pass:"",   //状态 
          sort: "",
        },
      });
      this.togInitData();
  },
 togInitData(){
  if(this.data.auctionType==0){
    this.initPmhData();
}else{
  this.initPpData();
}

 },

  showCity(){
    this.setData({
      showCity:true
    });
  },
  cloaseCity(){
    this.setData({
      showCity:false
    });
  },
  closeRange(){
    this.setData({
      showScreen:false
    });
  },

  screenBtn(){
      this.setData({
        showScreen:true
      });
  },
  swiperChange(e){
    this.setData({
      indicator:e.detail.current
    });
},
  getCompany(){
    var that=this;
    util.request('/goods/v2.home/HuiCompany').then(res=>{
        console.log(res);
        if(res.code==0){
            that.setData({
              companyList:res.data.list
            });
        }
    });
  },
  getSelData(){
    var that=this;
    util.request('/goods/v1.pages/newSearchData').then(res=>{
        console.log(res.data);
        res.data.company.unshift({
            label:'全部',
            value:""
        });
        res.data.is_pass.unshift({
          label:'全部',
          value:""
      });
      res.data.paipin_addr.unshift({
        name:'全部',
    });
    console.log(res.data);
        if(res.code==0){
            that.setData({
              selData:res.data
            });
        }
    });
  },
  pickerChange(e){
    console.log(e)
      var obj= this.data.type1Data;
      var key_=e.currentTarget.dataset.key;
      if(key_=='years'){
        obj[key_]=this.data.yearData[e.detail.value];
      }else if(key_=='pai_city'){
        obj[key_]= this.data.selData.paipin_addr[e.detail.value].name ;
      }else if(key_=='au_company'){
        obj[key_] = this.data.companyList[e.detail.value].id;
      }else if(key_=='is_pass'){
        obj[key_]= this.data.selData.is_pass[e.detail.value].value ;
      }
      console.log(obj);
    

      this.setData({
        type1Data:obj
      });
      this.togInitData();
  },
  yearSort(){
    var obj=this.data.type1Data;
      if(obj.sort==''){
        obj.sort='desc';
      }else  if(obj.sort=='desc'){
        obj.sort='asc';
      }else if(obj.sort=='asc'){
        obj.sort='desc';
      }

      this.setData({
        type1Data:obj
      });
      this.togInitData();

  },
  initPmhData(){
    wx.showLoading({
      title: '加载中',
    });
    var data= this.data.type1Data;
    hasMore=true;
    page=1;
    var that=this;

    if(data.pai_city=='全部'){
      data.pai_city=''
    }
    if(data.years=='全部'){
      data.years=''

    }
    data.page=page;
    data.limit=limit;
  
      util.request('/goods/v2.home/newPaiMaiHui',data,'POST').then(res=>{
        wx.hideLoading({});
          if(res.code==0){
            res.data.list.map((item,index)=>{
              item.pass_time= util.formatTime2(new Date(item.pass_time.replace(/-/g,'/')).getTime());
                item.bean.map((item2)=>{
                  item2.pass_time= util.formatTime2(new Date(item2.pass_time.replace(/-/g,'/')).getTime(),'/');
                });
            });
            if(res.data.list.length!=limit){
                hasMore=false;
            }
              that.setData({
                pmhData:res.data.list
              });
          }
      });
  },
  morePmhData(){
    wx.showLoading({
      title: '加载更多',
    });
    var data= this.data.type1Data;
    if(data.pai_city=='全部'){
      data.pai_city=''
    }
    if(data.years=='全部'){
      data.years=''

    }
    var that=this;
    page++;
    data.page=page;
    data.limit=limit;
      util.request('/goods/v2.home/newPaiMaiHui',data,'POST').then(res=>{
        wx.hideLoading({});
          if(res.code==0){
            res.data.list.map((item,index)=>{
              item.pass_time= util.formatTime2(new Date(item.pass_time.replace(/-/g,'/')).getTime());
            });
            if(res.data.list.length!=limit){
                hasMore=false;
            }
              that.setData({
                pmhData:that.data.pmhData.concat(res.data.list)
              });
          }
      });
  },
  initPpData(){
    wx.showLoading({
      title: '加载中',
    });
    wx.pageScrollTo({
      scrollTop:0,
      duration:0
    });
    var data= this.data.type1Data;
    hasMore=true;
    page=1;
    var that=this;
    data.page=page;
    data.limit=limit;
    data.keyword=postKey;
    data.search_type=2;
      util.request('/setting/v1.set/search',data,'POST').then(res=>{
        console.log(res)
        wx.hideLoading();
          if(res.code==0){
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
             


            });
            if(res.data.list.length!=limit){
                hasMore=false;
            }
              that.setData({
                ppData:res.data.list
              });
          }
      });
  },
  morePpData(){
    wx.showLoading({
      title: '加载中',
    });
    var data= this.data.type1Data;
    var that=this;
    page++;
    data.page=page;
    data.limit=limit;
    data.keyword=postKey;
    data.search_type=2;
      util.request('/setting/v1.set/search',data,'POST').then(res=>{
        console.log(res)
        wx.hideLoading();
          if(res.code==0){
            res.data.list.map((item,index)=>{
              item.auction_time= util.formatTime2(new Date(item.auction_time.replace(/-/g,'/')).getTime(),'/');
              var price_=item.transaction_price;
              if(!/[0-9]/.test(price_)){
                item.transaction_price='流拍'
              }
            });


            if(res.data.list.length!=limit){
                hasMore=false;
            }
              that.setData({
                ppData: that.data.ppData.concat(res.data.list) 
              });
          }
      });
  },
  cancelBack(){
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     page=1;
    limit=8;
    console.log(options)
    hasMore=true;
        this.setData({
          KeyWord:options.keyword||'',
          endYear:new Date().getFullYear()
        });
        postKey=options.keyword||'';
        // 获取拍卖公司
        this.getCompany();
        //获取拍卖会数据
        this.initPpData();
        // 筛选条件
        this.getSelData();
          // 初始化 年分
        var  nowYear= new Date().getFullYear();
        var  yearArr=[]
        for(var i=1950;i<=nowYear;i++ ){
          yearArr.push(i);
        };
        yearArr=yearArr.sort(function(a,b){
          return b-a
        });
        yearArr.unshift('全部');
        this.setData({
          yearData:yearArr
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
    var that=this;
        if(hasMore){
            if(that.data.auctionType==0){
              that.morePmhData();
            }else{
              that.morePpData();
            }
        }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})