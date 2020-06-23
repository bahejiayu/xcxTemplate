// car/pages/addressList/addressList.js
import util from '../../../utils/util.js'
var startX=0;
var startY=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[]
  },
  delItem(e){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确认删除',
      success (res) {
        if (res.confirm) {
              util.request('/users/v1.Address/deleteAddress',{
                id:e.currentTarget.dataset.cid
              },'POST').then(res=>{
                    console.log(res);
                  if(res.code==0){
                        wx.showToast({
                          title: '删除成功',
                          icon:'none'
                        });
                       that.getAddressList();
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
    console.log(jianX)
    var obj= this.data.addressList;
    var index_=e.currentTarget.dataset.index;
    if (jianX < 0 && jianX < -10) {
        if(Math.abs(jianY)<40){
          obj[index_].left=true;
        }
    }else if(jianX > 0 && jianX > 10){
      if(Math.abs(jianY)<40){
        obj[index_].left=false;
      }
    }
     that.setData({
      addressList:obj
     });
  },
  goEditor(e){
    wx.setStorageSync('addressInfo',this.data.addressList[e.currentTarget.dataset.index])
      wx.navigateTo({
        url:e.currentTarget.dataset.url,
      });
  },
  getAddressList(){
    var that=this;
      util.request('/users/v1.Address/carList',{},'POST').then(res=>{
          console.log(res);
          if(res.code==0){
            res.data.list.map((item,index)=>{
                item.adTxt=item.province.replace(/-/g,"");
            });
              that.setData({
                addressList:res.data.list
              });
          }
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.getAddressList();

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