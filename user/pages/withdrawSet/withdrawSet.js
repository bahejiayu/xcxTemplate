// user/pages/withdrawSet/withdrawSet.js
import util from "../../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
      type:'',
      accInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        type:options.type
      });
      if(options.type=='editor'){
          this.setData({
            accInfo:wx.getStorageSync('acc')
          });
      }
  },
  switch1Change(e){
      console.log(e.detail.value);
    var obj=this.data.accInfo;
    obj.default=e.detail.value?1:0;
    this.setData({
      accInfo:obj
    });

  },
  inputEven(e){
    var event_=e.currentTarget.dataset;
    var obj=this.data.accInfo;
    obj[event_.name]=e.detail.value
    this.setData({
      accInfo :obj
    });

  },
  saveAcc(e){
    console.log(e.currentTarget.dataset.ok);
      if(!e.currentTarget.dataset.ok=='isOk'){
        console.log(1)
            return false;
      }

      var postData={};
      postData.open_name=this.data.accInfo.open_name;
      postData.account=this.data.accInfo.account;
      postData.default=this.data.accInfo.default;
      if(this.data.accInfo.id){
        postData.cash_id=this.data.accInfo.id;
      }
      postData.type=2;
      var that=this;
      if(!/[1-9]\d{12,18}/.test(postData.account)){
          wx.showToast({
            title: '请输入正确的账户',
            icon:'none'
          });
          console.log(2)

          return false;
      }
      console.log(3)

      var postUrl=this.data.type=='editor'?'/users/v1.me/updateMyCash':'/users/v1.me/setMyCash';
      wx.showLoading({
        title: '正在保存',
      });
      util.request(postUrl,postData,'POST').then(res=>{
        wx.hideLoading({
          complete: (res) => {},
        });
          console.log(res);
            if(res.code==0){
                  wx.showToast({
                    title:that.data.type=='editor'?'修改成功':'添加成功',
                    icon:'none'
                  });
                  if(that.data.type!='editor'){
                        setTimeout(() => {
                          wx.navigateBack({
                            delta: 1
                          });
                        }, 1500);
                  }

            }else{
              wx.showToast({
                title: res.msg,
                icon:'none'
              });
            }

      });


  },
  editorAcc(){
    var that=this;
      wx.showModal({
          title:'提示',
          content:'是否确认删除',
          success(res){
            if(res.confirm){
                util.request('/users/v1.me/deleteMyCash',{
                  cash_id:that.data.accInfo.id
                },'POST')
                  

            }
          }
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
    wx.removeStorageSync('acc');
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