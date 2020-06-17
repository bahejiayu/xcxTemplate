// car/pages/car/car.js
import util from '../../../utils/util.js'

var startX=0;
var startY=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      carList:[],
      left:false,
      allChk:false,
      totalPrice:0,
      start_:0
  },

  allChk(){
    var that=this;
    this.setData({
      allChk:!this.data.allChk
    });
    var carList=this.data.carList;
    carList.map((item,index)=>{
        item.chk=that.data.allChk
    });

      this.setData({
        carList
      });

  },
  togChk(e){
    var that=this;
    var index_=e.currentTarget.dataset.index;
    var carList=that.data.carList;
    carList[index_].chk=carList[index_].chk?false:true;
    var allChk=carList.every((item,index)=>{
        return item.chk;
    });
    this.setData({
      carList,
      allChk
    });

    that.computTotal();

  },
  getList(){
    var that=this;
     wx.showLoading({
       title: '加载中',
     });
     util.request('/users/v1.car/carList',{
     },'POST').then(res=>{
        wx.hideLoading({
          complete: (res) => {},
        });
        wx.stopPullDownRefresh({
          complete: (res) => {},
        });
        console.log(res);
          if(res.code==0){
            var pl=[]
            that.setData({
              carList:res.data.list
            });
            that.computTotal();
          }

     });


  },
  carPay(){
      var orderData=[];
     this.data.carList.forEach((item,index)=>{
          if(item.chk){
              var obj={};
              obj.doc_id=item.doc_id;
              obj.num=item.num;
              obj.name=item.name;
              obj.author=item.author;
              obj.cbs_id=item.cbs_name;
              obj.logo=item.logo;
              obj.price=item.discount_pice!='0.00'&&item.discount_pice?item.discount_pice:item.price;
              orderData.push(obj)
          }
      });
      if(orderData.length==0){
            wx.showToast({
              title: '请选择商品',
              icon:'none'
            });
            return false;
      }
      wx.setStorageSync('book_arr', orderData);
      wx.navigateTo({
        url: '../../../car/pages/order/order?type=2',
      });
  },
  st: function(e) {
  
    startX= e.touches[0].clientX;
    startY= e.touches[0].clientY;

  },
  end: function(e) {
    var that = this;
    var jianX = e.changedTouches[0].clientX - startX;
    var jianY = e.changedTouches[0].clientY - startY;
    var obj= this.data.carList;
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
      carList:obj
     });
  },
  delCarItem(e){
      var index_=e.currentTarget.dataset.index;
      var that=this;
      wx.showModal({
        title: '提示',
        content: '是否确认删除',
        success (res) {
          if (res.confirm) {
                util.request('/users/v1.car/deleteCar',{
                  id:e.currentTarget.dataset.id
                },'POST').then(res=>{
                      console.log(res);
                    if(res.code==0){
                          wx.showToast({
                            title: '删除成功',
                            icon:'none'
                          });
                        var arr=that.data.carList;
                      that.getList();
                    }else{
                      wx.showToast({
                        title: res.msg,
                        icon:'none'
                      });

                    }

                });


          } 
        }
      })


  },
  togNub(e){
    var that=this;
    var event_=e.currentTarget.dataset;
    var obj=this.data.carList;
      if(event_.type=='+'){
        obj[event_.index].num++;

          // if(obj[event_.index].num>=obj[event_.index].stock){
          //   obj[event_.index].num=obj[event_.index].stock
          //       wx.showToast({
          //         title: '不能超过库存',
          //         icon:'none'
          //       });
          // }else{
          //   obj[event_.index].num++;
          // }
      }else{
          if(  obj[event_.index].num>1){
              obj[event_.index].num--;
          }
          // if(obj[event_.index].num==1){
          //   obj[event_.index].num=1;
          // }else{
          //   obj[event_.index].num--;
          // }

      }
      that.setData({
        carList:obj
      });
      util.request('/users/v1.car/addNum',{
        id:e.currentTarget.dataset.id,
        num:obj[event_.index].num
      },'POST').then(res=>{
          console.log(res);
      });

      that.computTotal();
  },
  computTotal(){
      var list_=this.data.carList;
      var total_=0;
      list_.forEach((item,index)=>{
        if(item.chk){
          var price_=item.discount_pice&&item.discount_pice!='0.00'?item.discount_pice:item.price;
          total_+=price_*item.num;
        }
         
      });
      this.setData({
        totalPrice:(total_*1).toFixed(2)
      });
      console.log(total_);

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
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
    this.getList();
    this.setData({
      allChk:false
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
      this.getList();
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