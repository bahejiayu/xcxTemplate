// pages/chooseAccount/chooseAccount.js
import util from '../../utils/util.js'
var startX=0;
var startY=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      type:'',
      accList:[],
      curId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // type=1时是选择
      this.setData({
        type:options.type,
        curId:options.id||''
      });
      wx.showLoading({
        title: '加载中',
      });
      this.initList();
  },
  st: function(e) {
  
    startX= e.touches[0].clientX;
    startY= e.touches[0].clientY;

  },
  end: function(e) {
    var that = this;
    var jianX = e.changedTouches[0].clientX - startX;
    var jianY = e.changedTouches[0].clientY - startY;
    console.log(jianX)
    var obj= this.data.accList;
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
      accList:obj
     });
  },
  accEven(e){
    
    if(this.data.type!=1){
          wx.setStorageSync('acc', this.data.accList[e.currentTarget.dataset.index]);
          wx.navigateTo({
            url: '../../user/pages/withdrawSet/withdrawSet?type=editor',
          });
    }else{
      wx.setStorageSync('chkAcc', this.data.accList[e.currentTarget.dataset.index]);
      wx.navigateBack({
        delta: 1
      });
      
    }

  },
  delItem(e){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '是否确认删除',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
          });
              util.request('/users/v1.me/deleteMyCash',{
                cash_id:e.currentTarget.dataset.id
              },'POST').then(res=>{
                  if(res.code==0){
                          wx.showToast({
                            title: '删除成功',
                            icon:'none'
                          }); 
                      var arr=that.data.accList;
                      arr.splice(e.currentTarget.dataset.index,1);
                      that.setData({
                        accList:arr
                      });

                  }
              });

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },
  initList(){
    var that=this;
      
      util.request('/users/v1.me/getCashList',{},'POST').then(res=>{
        wx.hideLoading({
          complete: (res) => {},
        });
          if(res.code==0){
              that.setData({
                accList:res.data.list
              });
          }
        
      });


  },
  submitEven(){
      wx.navigateTo({
        url: '../../user/pages/withdrawSet/withdrawSet?type=add',
      })
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
    this.initList();

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