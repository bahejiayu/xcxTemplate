// user/pages/user/user.js
import util from '../../utils/util.js'
<<<<<<< HEAD
var loginOnce=true;
=======

>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
<<<<<<< HEAD
    showLoading: true,
=======
    showLoading:true,
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
    serverNav: [{
        name: '电子书架',
        url: '../bookShelf/bookShelf'
      },
      {
        name: '我的钱包',
        url: '/pages/myWallet/myWallet'
      },
      {
        name: '收货地址',
        url: '/car/pages/addressList/addressList'
      },
      {
        name: '消息中心',
        url: '/user/pages/messageCenter/messageCenter'
      },


    ]

  },
<<<<<<< HEAD
  goUrl(e){
        wx.navigateTo({
          url: e.currentTarget.dataset.url,
        });
  },
  LoginBtn(e) {
    var that = this;
    console.log(e);
    if(!loginOnce){
        return false;
    }
    loginOnce=false;
  
    if (!e.detail.encryptedData) {
      wx.hideLoading();
      loginOnce=true;
      return false;
    }
    wx.showLoading({
      title: '登录中',
    });
    wx.login({
      success(res) {
  
        console.log(e.detail.encryptedData);
        util.request('/users/v1.publics/applet_log', {
          code: that.data.code_,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        }, 'POST').then(res => {
          console.log(res);
          if (res.code == 0) {
            // if(typeof res.data !='object'){
            //   wx.hideLoading();
            //       wx.showToast({
            //         title: 'code已过期,请重新登录',
            //         icon:'none'
            //       });
            //       return false;
            // }
            var phoneInfo = res.data
            console.log(phoneInfo);
            wx.login({
              success(res) {
                util.request('/users/v1.publics/applet_mobile', {
                  mobile: phoneInfo.phoneNumber,
                  mobile_area: '+' + phoneInfo.countryCode,
                  wxcode: res.code
                }, 'POST').then(res => {
                  console.log(res);
                  if (res.data) {
                    wx.setStorageSync('token', res.data.token);
                    wx.setStorageSync('userinfo', res.data.userinfo);
                    wx.showToast({
                      title: '登录成功',
                      icon: 'none'
                    });
                    loginOnce=true;
                    wx.hideLoading();

                    util.request(
                      '/users/v1.me/getUserInfo', {}, 'POST').then(res => {
                      that.setData({
                        userInfo: res.data || null,
                      });
                    });
                    // setTimeout(function(){
                    //   wx.switchTab({
                    //     url:'/pages/user/user'
                    //   });
                    // },1000)

                  } else {
                    loginOnce=true;
                    wx.hideLoading();

                    wx.navigateTo({
                      url: `/user/pages/setpassword/setpassword?phone=${ phoneInfo.phoneNumber}&area=${phoneInfo.countryCode}`,
                    });
                  }
                });
              }
            })

          }else{
            wx.hideLoading();

            loginOnce=true;

          }


        })
=======
  LoginBtn(e){
    var that=this;
console.log(e)
if(!e.detail.encryptedData){
  return false;
}
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
                                util.request(
                                  '/users/v1.me/getUserInfo', {}, 'POST').then(res => {
                                  that.setData({
                                    userInfo: res.data || null,
                                  });
                                });
                                // setTimeout(function(){
                                //   wx.switchTab({
                                //     url:'/pages/user/user'
                                //   });
                                // },1000)

                              }else{

                                  wx.navigateTo({
                                    url: `/user/pages/setpassword/setpassword?phone=${ phoneInfo.phoneNumber}&area=${phoneInfo.countryCode}`,
                                  });
                              }
                        });
                      }
                   })
                 
                }


          })
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe

      }
    })
  },
<<<<<<< HEAD
  goLogin_() {
=======
  goLogin_(){
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
    wx.reLaunch({
      url: '../../user/pages/login/login'
    });
  },
  memberGo() {

    if (this.data.userInfo) {
      wx.navigateTo({
        url: '/user/pages/set/set',
      });
    } else {
      wx.navigateTo({
        url: '../../user/pages/login/login',
      });

    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
<<<<<<< HEAD
    loginOnce=true;
=======

>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
    wx.showTabBar();
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
<<<<<<< HEAD
    wx.showTabBar();

    var that = this;
    wx.login({
      success(res) {
        that.setData({
          code_: res.code
        });
      }
    });
    console.log(111)

    if (wx.getStorageSync('token')) {
      util.request('/users/v1.me/getUserInfo', {}, 'POST').then(res => {
        console.log(res)
        that.setData({
          userInfo: res.data || null,
        });
        util.closeL(that, 1000);
      });
    } else {
      that.setData({
        userInfo: null,
      });

    }


    // if(wx.getStorageSync('token')){

    // }else{
    //   util.closeL(that,1000);
    //   that.setData({
    //     userInfo:null,
    //   });
    //   util.closeL(that,1000);
    //   that.setData({
    //     showLoading:false
    //   });
    // }

=======
    var that = this;
    wx.login({
      success(res){
         that.setData({
           code_:res.code
         });
      }
     });
    if(wx.getStorageSync('token')){
      util.request(
        '/users/v1.me/getUserInfo', {}, 'POST').then(res => {
        that.setData({
          userInfo: res.data || null,
        });
        util.closeL(that,1000);
      });
    }else{
      util.closeL(that,1000);
      that.setData({
        userInfo:null,
      });
    }
    
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
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