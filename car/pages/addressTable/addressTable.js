// car/pages/addressTable/addressTable.js
import util from '../../../utils/util.js'
var once_=true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo:{},
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  inputEven(e){
    var event_=e.currentTarget.dataset;
    var obj=this.data.addressInfo;
    obj[event_.name]=e.detail.value
    this.setData({
      addressInfo :obj
    });

  },

  onLoad: function (options) {
    once_=true;
      if(options.id){
            wx.setNavigationBarTitle({
              title: '编辑地址',
            });
            this.setData({
              addressInfo:wx.getStorageSync('addressInfo'),
              id:options.id
            })
      }else{
        wx.setNavigationBarTitle({
          title: '新建收货地址',
        });
        this.setData({
          addressInfo:{},
          id:''
        })
      }


  },
  submitEven(e){
    if(e.currentTarget.dataset.ok!='isOk'){
        return false;
    }
    if(!util.isPhone(this.data.addressInfo.mobile)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon:'none'
      });
    return false;
  }

    if(!once_){
        return false;
    }
    once_=false;

    wx.showLoading({
      title: '提交中',
    });
    var that=this;
    var postData=that.data.addressInfo;
    postData.addr_id=postData.id;
    util.request(that.data.id?'/users/v1.Address/saveAddress':'/users/v1.Address/addAddress',postData,'POST').then(res=>{
      wx.hideLoading();
        console.log(res);
        if(res.code==0){
          wx.showToast({
            title:that.data.id?'修改成功':'新建成功',
            icon:'none'
          });
          setTimeout(function(){
            once_=true;

            console.log(111)
            wx.navigateBack({
              delta: 1
            });
          },1000)


        }else{
          once_=true;

              wx.showToast({
                title: res.msg,
                icon:'none'
              });
        }
    });

  },
  addWxAddress(){
    var that=this;
    wx.chooseAddress({
      success (res) {
        var obj={
          name:res.userName,
          mobile:res.telNumber,
          province:`${res.provinceName}-${res.cityName}-${res.cityName}`,
          content:res.detailInfo
        };
        console.log(obj);
        that.setData({
          addressInfo:obj
        });
        
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },
  changeCity(e){
        console.log(e);
      var obj=this.data.addressInfo;
      console.log(e.detail.value.join('-'));
      obj.province=e.detail.value.join('-');
      this.setData({
        addressInfo:obj
      });

  },
  switch1Change(e){
      var obj=this.data.addressInfo;
      obj.default=e.detail.value?1:0;
      this.setData({
        addressInfo:obj
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