import util from "../../../utils/util";

// user/pages/certification/certification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      postData:{
          name:'',
          role_no:'',
          zm_card:'',
          fm_card:''
      }
  },
  submitEven(e){
    if(e.currentTarget.dataset.ok!='isOk'){
        return false;
    }
      wx.showLoading({
        title: '正在提交',
      });
      var that=this;
      var idCard = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if(!idCard.test(that.data.postData.role_no)){
        wx.showToast({
          title: '请输入正确的身份证号',
          icon:'none'
        });
          return false;
      }

      util.request('/users/v1.me/setRole',that.data.postData,'POST').then(res=>{
        wx.hideLoading();
          if(res.code==0){
            wx.showModal({
              title: '提示',
              showCancel:false,
              content: '实名认证已提交,请耐心等待审核结果',
              success (res) {
                if (res.confirm) {
                    wx.navigateBack({
                      delta:1
                    });
                }
              }
            });
               
          }else{
            wx.showToast({
              title: res.msg,
              icon:'none'
            });
          }

          console.log(res)
      });


  },
  inputEven(e){
    var event_=e.currentTarget.dataset;
    var obj=this.data.postData;
    obj[event_.name]=e.detail.value
    this.setData({
      postData :obj
    });

  },
  uploadCar(e){
    var that=this;
    util.uploadImg().then(res=>{
        var obj=that.data.postData;
        obj[e.currentTarget.dataset.name]=res.url;
        that.setData({
          postData:obj
        });
          console.log(res);
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.getUserInfo(res=>{
        if(res.is_role_now==1){
          wx.showModal({
            title: '提示',
            showCancel:false,
            content: '您已经提交了实名认证审核,请耐心等待审核结果',
            success (res) {
              if (res.confirm) {
                  wx.navigateBack({
                    delta:1
                  });
              }
            }
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