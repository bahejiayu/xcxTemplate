// user/pages/set/set.js
import util from "../../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo:null,
      sexList:['男','女'],
      postData:{
        gender:'男'
      },
      showXg:false,
      nameValue:''
  },
  usefInfo(e){
      console.log(e)
      var obj=this.data.postData;
      var that=this;
      if(e.detail.userInfo){
        obj.nickname=e.detail.userInfo.nickName;
        wx.showLoading({
          title: '修改中',
        });
        this.upUserInfo(res=>{
              wx.hideLoading({
                complete: (res) => {},
              });
              console.log(res)
              if(res.code==0){
                    wx.showToast({
                      title: '修改成功',
                      icon:'none'
                    });
                    that.setData({
                      showXg:false
                    });
              }
        });
      }
  },
  modHeadIcon(){
    var that=this;
      util.uploadImg().then(res=>{
        console.log(res);
        if(res.code==0){
                wx.showLoading({
                  title: '上传中',
                });
              var obj=that.data.postData;
              obj.avatar=res.url;
              console.log(obj);
              that.setData({
                postData:obj
              });
              that.upUserInfo();
        }
  });
  },
  changeName(e){
      this.setData({
        nameValue:e.detail.value
      });
  },
  xgName(){
      var obj=this.data.postData;
      var that=this;
        if(this.data.nameValue.trim().length==''){
            wx.showToast({
              title: '请输入昵称',
              icon:'none'
            });
            return false;
        }
      obj.nickname=this.data.nameValue;
      wx.showLoading({
        title: '修改中',
      });
      this.upUserInfo(res=>{
            wx.hideLoading({
              complete: (res) => {},
            });
            console.log(res)
            if(res.code==0){
                  wx.showToast({
                    title: '修改成功',
                    icon:'none'
                  });
                  that.setData({
                    showXg:false
                  });
            }
      });
  },
  xgEven(){
      this.setData({
        showXg:true
      });
  },
  closeXg(){
    this.setData({
      showXg:false
    });
  },
  getSex(e){
        console.log(e.detail.value);
    var sex_=e.detail.value==1?'女':'男';
    var obj=this.data.postData;
    var userInfo=this.data.userInfo;
    obj.gender=sex_;
    userInfo.gender=sex_;
    this.setData({
      postData:obj,
      userInfo:userInfo
    });
    this.upUserInfo();
  },
  upUserInfo(callback){
      var that=this;
     
      util.request('/users/v1.my/upUserInfo',this.data.postData,'POST').then(res=>{
        console.log(res);
        wx.hideLoading();
            if(res.code==0){
              callback&&callback(res);
                  util.getUserInfo(res=>{
                      that.setData({
                        userInfo:res
                      });
                  });
            }
      });

  },
  loginOut(){
    wx.clearStorage();
    wx.reLaunch({
      url: '/user/pages/login/login'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        var that=this;
        util.getUserInfo(res=>{
          console.log(res);
          var obj={};
          obj.avatar=res.avatar;
          obj.nickname=res.nickname;
          obj.gender=res.gender;
          that.setData({
            userInfo:res,
            postData:obj
          });
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
    var that=this;
      util.getUserInfo(res=>{
            that.setData({
              userInfo:res
            });
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