//scale.js
//获取应用实例
import util from '../../../utils/util.js'
var page=1;
var limit=30;
var hasMore=true;
var app = getApp();
var once=true;
var pageLog=1;
var limitLog=30;
var hasMoreLog=true;
Page({
  data: {
    logList:[],
    showLog:false,
    isOk:true,
    pVal:'',
    curpage:0,
    zoomUlr:'/images/jpImg.png',
    showZoom:false,
    stv: {
      offsetX: 0,
      offsetY: 0,
      zoom: false, //是否缩放状态
      distance: 0,  //两指距离
      scale: 1,  //缩放倍数
      list:[],

    }
  },
  getLog(){
    var that=this;
    pageLog=1;
    hasMoreLog=true;
    util.request('/goods/v2.home/applet_catalog',{
      doc_id:that.data.bookId,
      page:1,
      limit:limitLog
    },'POST').then(res=>{
      wx.hideLoading();
      if(res.code==0){
      if(limit!=res.data.list.length){
        hasMoreLog=false;
      }
          that.setData({
            logList:res.data.list
          });

      }
      console.log(res);
    });
  },
  moreLog(){
    if(!hasMoreLog){
        return false;
    }
    var that=this;
    wx.showLoading({
      title: '加载更多',
    })
    pageLog++;
    util.request('/goods/v2.home/applet_catalog',{
      id:that.data.bookId,
      page:pageLog,
      limit:limitLog
    },'POST').then(res=>{
      wx.hideLoading();
      if(res.code==0){
      if(limit!=res.data.list.length){
        hasMoreLog=false;
      }
          that.setData({
            logList:that.data.logList.concat(res.data.list) 
          });

      }
      console.log(res);
    });
  },
  logEven(){
      this.setData({
        showLog:true
      });
  },
  foEven(){
      this.setData({
        isOk:false
      })
  },
  onLoad: function (options ) {
    console.log('onLoad');
    this.setData({
      bookId:options.id
    });
     pageLog=1;
     limitLog=30;
     hasMoreLog=true;

     page=1;
     limit=30;
     hasMore=true;
     once=true;
    wx.showLoading({
      title: '加载中',
    });
    this.getLog();
    var that=this;
    util.request('/doc/v1.pages/getMyDocLists',{
      id:that.data.bookId,
      page:1,
      limit:limit
    },'POST').then(res=>{
      wx.hideLoading();
      if(res.code==0){
      if(limit!=res.data.list.length){
          hasMore=false;
      }
        res.data.list.map((item,index)=>{
          if(index<=5){
              if(item){
                item.t=item.pic
              }
          }
        });
          that.setData({
            list:res.data.list
          });

      }
      console.log(res);
    });

  },
  moreList(){ 
    if(!hasMore){
        return false;
    }
    if(!once){
        return false;
    }
    once=false;
      page++;
      wx.showLoading({
        title: '加载更多',
      });
      var that=this;
      util.request('/doc/v1.pages/getMyDocLists',{
        id:that.data.bookId,
        page:page,
        limit:limit
      },'POST').then(res=>{
        once=true;
        wx.hideLoading();
        if(res.code==0){
        if(limit!=res.data.list.length){
            hasMore=false;
        }
  
          res.data.list.map((item,index)=>{
            if(index<=5){
                if(item){
                  item.t=item.pic
                }
  
            }
          });
            that.setData({
              list:that.data.list.concat(res.data.list) 
            });
  
        }
        console.log(res);
      });

  },
  swiperChange(e){
        console.log(e);
        var that=this;
      this.setData({
        curpage:e.detail.current
      });

      var list_=that.data.list;
      for(var i=1;i<=5;i++ ){
          if(list_[that.data.curpage+i]){
            list_[that.data.curpage+i].t=list_[that.data.curpage+i].pic?list_[that.data.curpage+i].pic:'/images/jpImg.png';
          }
          if(list_[that.data.curpage-i]){
            list_[that.data.curpage-i].t=list_[that.data.curpage-i].pic?list_[that.data.curpage-i].pic:'/images/jpImg.png';
          }
          that.setData({
            list:list_
          });

         if((that.data.list.length-1)-that.data.curpage<=10){
            console.log(111)
              that.moreList();
         } 
      }
  },
  viewImg(e){
    if(this.data.isOk){
      this.setData({
        showZoom:true,
        zoomUlr:e.currentTarget.dataset.url
      });
    }
  
      // wx.previewImage({
      //   urls: [e.currentTarget.dataset.url],
      //   current:e.currentTarget.dataset.url
      // });
  },
  closeView(){
      this.setData({
        showZoom:false,
        stv: {
          offsetX: 0,
          offsetY: 0,
          zoom: false, //是否缩放状态
          distance: 0,  //两指距离
          scale: 1,  //缩放倍数
          list:[],
    
        }
      });
  },
  tiaoye(ye){
      ye=ye*1;
      console.log(ye);
      var that=this;
      if(!isNaN(ye)){
          if(ye==0){
             wx.showToast({
               title: '页数不存在',
               icon:'none'
             });
             setTimeout(()=>{
                  that.setData({
                    isOk:true
                  })
             },1000 )
             return false;
          }else if(ye>10000){
            wx.showToast({
              title: '页数不存在',
              icon:'none'
            });
            setTimeout(()=>{
                 that.setData({
                   isOk:true
                 })
            },1000 )
            return false;
          }


      }


      var postYe=Math.ceil(ye/limit); 
      var postLimit=ye+(30-(ye%limit));
      console.log(postYe,postLimit);
      wx.showLoading({
        title: '加载中',
      });
      var that=this;
      util.request('/doc/v1.pages/getMyDocLists',{
        id:that.data.bookId,
        page:1,
        limit:postLimit
      },'POST').then(res=>{
        wx.hideLoading();
        if(res.code==0){
      
          for(var i=0;i<=5;i++ ){
            if(res.data.list[ye+i]){
              res.data.list[ye+i].t=res.data.list[ye+i].pic;
            }
            if(res.data.list[ye-i]){
              res.data.list[ye-i].t=res.data.list[ye-i].pic;
            }

          }
            page=postYe;
            that.setData({
              list:res.data.list,
              isOk:true,
              pVal:'',
              curpage:ye-1
            });
  
        }
        console.log(res);
      });



  },
  logTap(e){
    this.tiaoye((e.currentTarget.dataset.index*1)+1);
    this.setData({
        showLog:false
    })
  },
  goPage(e){

     this.tiaoye(e.detail.value);
        console.log(e);




  },
  togPage(e){
    var ePage=this.data.curpage;
    var that=this;
      if(e.currentTarget.dataset.type=='add'){
          if(ePage==that.data.list.length){
              return false;
          }
            ePage++
      }else{
        if(ePage<=0){
          return false;
      }
        ePage--;

      }
        that.setData({
          curpage:ePage
        });

  },
  //事件处理函数
  touchstartCallback: function(e) {
    //触摸开始
    console.log('touchstartCallback');
    console.log(e);

    if (e.touches.length === 1) {
      let {clientX, clientY} = e.touches[0];
      this.startX = clientX;
      this.startY = clientY;
      this.touchStartEvent = e.touches;
    } else {
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);
      this.setData({
        'stv.distance': distance,
        'stv.zoom': true, //缩放状态
      })
    }

  },
  touchmoveCallback: function(e) {
    //触摸移动中
    console.log('touchmoveCallback');
    console.log(e);

    if (e.touches.length === 1) {
      //单指移动
      if (this.data.stv.zoom) {
        //缩放状态，不处理单指
        return ;
      }
      let {clientX, clientY} = e.touches[0];
      let offsetX = clientX - this.startX;
      let offsetY = clientY- this.startY;
      this.startX = clientX;
      this.startY = clientY;
      let {stv} = this.data;
      stv.offsetX += offsetX;
      stv.offsetY += offsetY;
      stv.offsetLeftX = -stv.offsetX;
      stv.offsetLeftY = -stv.offsetLeftY;
      this.setData({
        stv: stv
      });

    } else {
      //双指缩放
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);

      let distanceDiff = distance - this.data.stv.distance;
      let newScale = this.data.stv.scale + 0.005 * distanceDiff;

      this.setData({
        'stv.distance': distance,
        'stv.scale': newScale,
      })
    }

  },
  touchendCallback: function(e) {
    //触摸结束
    console.log('touchendCallback');
    console.log(e);

    if (e.touches.length === 0) {
      this.setData({
        'stv.zoom': false, //重置缩放状态
      })
    }
  }
})
