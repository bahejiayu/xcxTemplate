  import util from "../../../utils/util";

  Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  LoginBtn(e){
    var that=this;

    wx.login({
      success(res){
        wx.showLoading({
          title: '登录中',
        });
        console.log(e.detail.encryptedData);
          util.request('/users/v1.publics/applet_log',{
            code:that.data.code_,
            encryptedData:e.detail.encryptedData,
            iv:e.detail.iv
          },'POST').then(res=>{
              console.log(res);
                if(res.code==0){
                    // if(typeof res.data !='object'){
                    //   wx.hideLoading();
                    //       wx.showToast({
                    //         title: 'code已过期,请重新登录',
                    //         icon:'none'
                    //       });
                    //       return false;
                    // }
                  var phoneInfo=res.data
                  console.log(phoneInfo);
                   wx.login({
                      success(res){
                        util.request('/users/v1.publics/applet_mobile',{
                          mobile: phoneInfo.phoneNumber,
                          mobile_area:'+'+phoneInfo.countryCode,
                          wxcode: res.code
                        },'POST').then(res=>{
                            console.log(res);
                            wx.hideLoading();
                              if(res.data){

                                wx.setStorageSync('token', res.data.token);
                                wx.setStorageSync('userinfo', res.data.userinfo);
                                wx.showToast({
                                  title: '登录成功',
                                  icon:'none'
                                });
                                setTimeout(function(){
                                  wx.switchTab({
                                    url:'/pages/user/user'
                                  });
                                },1000)

                              }else{

                                  wx.navigateTo({
                                    url: `../setpassword/setpassword?phone=${ phoneInfo.phoneNumber}&area=${phoneInfo.countryCode}`,
                                  });
                              }
                        });
                      }
                   })
                 
                }


          })

      }
    })
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
    var that=this;
        wx.login({
         success(res){
            that.setData({
              code_:res.code
            });
         }
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