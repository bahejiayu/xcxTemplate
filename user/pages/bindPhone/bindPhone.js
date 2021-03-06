// user/pages/registered/registered.js
import util from "../../../utils/util";
var phoneArea=util.phoneArea;
var codeOnce=true;
var reOnce=true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    checked_:true,
    inpType:'password',
    codeTxt:'获取验证码',
    phoneArea:phoneArea,
    areaIndex:0,
    codeOk:false,
    postData:{
      code:'',
      password:'',
      mobile:'',
      repassword:'',
    }
  },
  togChk(){
    this.setData({
      checked_:!this.data.checked_
    });
},
registBtn(e){
  var that=this;
   console.log(1)
  console.log(e.currentTarget.dataset.ok==='isOk');
    if(e.currentTarget.dataset.ok=='isOk'){
      console.log(2)
      
          if(!reOnce){
            return false;
        }
        reOnce=false;

          var postData=that.data.postData;
          postData.mobile_area=that.data.phoneArea.arr1[that.data.areaIndex];
          wx.showLoading({
            title: '提交中',
          });
          util.request('/users/v1.publics/saveMobile',postData,'POST').then(res=>{
            wx.hideLoading({
              complete: (res) => {},
            });
              if(res.code==0){
                  wx.showToast({
                    title:'绑定成功',
                    icon:'none'
                  });     
                
                    setTimeout(() => {
                      wx.navigateBack({
                        delta: 1
                      });
                    }, 1000);
             
              
                  reOnce=true;

              }else{
                reOnce=true;
                wx.showToast({
                  title: res.msg,
                  icon:'none'
                });     
              }
          });


    }


},
getCode(){
  var that=this;
  if(codeOnce){
    codeOnce=false;
    wx.showLoading({
      title: '正在发送',
      icon:'none'
    });
    util.request('/users/v1.publics/bingSMS',{
      mobile:that.data.postData.mobile,
      mobile_area:that.data.phoneArea.arr1[that.data.areaIndex]
    },'POST').then(res=>{
      wx.hideLoading({
        complete: (res) => {},
      });
        if(res.code==0){
              wx.showToast({
                title: '发送成功',
                icon:'none'
              });
              var codeTime=60;
            var codeDsq= setInterval(() => {
                codeTime--;
                if(codeTime<=0){
                      clearInterval(codeDsq);
                      that.setData({
                        codeTxt:'获取验证码'
                      });
                }else{
                  that.setData({
                    codeTxt:codeTime+'s重新获取'
                  });
                }

              }, 1000);


              codeOnce=true;
        }else{
              wx.showToast({
                title: res.msg,
                icon:'none'
              });
              codeOnce=true;

        }
        console.log(res);
    });
  }



},
inputEven(e){
  var that=this;
  var event_=e.currentTarget.dataset;
  var obj=this.data.postData;
  if(event_.name=='mobile'){

      if(util.isPhone(e.detail.value)){
        obj[event_.name]=e.detail.value;
        that.setData({
          codeOk:true
        });
      }else{
        that.setData({
          codeOk:false
        });
      }
  }else{
    obj[event_.name]=e.detail.value;
  }


  this.setData({
    postData :obj
  });

},
changeArea(e){
    console.log(e);
    this.setData({
      areaIndex:e.detail.value
    });
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
      this.setData({
        type:options.type||''
      });
    codeOnce=true;
    reOnce=true;
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