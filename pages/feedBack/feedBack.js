// pages/feedBack/feedBack.js
import util from '../../utils/util.js'
import api from "../../config/api";


var once = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postData: {
      content: '',
      mobile: '',
      pics: []
    },
    img_list2: []
  },
  inputEven(e) {
    var that = this;
    var event_ = e.currentTarget.dataset;
    var obj = this.data.postData;
    console.log(event_.name)

    // if (event_.name == 'mobile') {
    //   if (util.isPhone(e.detail.value)) {
    //     obj[event_.name] = e.detail.value;
    //     this.setData({
    //       postData: obj
    //     });
    //   }
    // } else {
    //   obj[event_.name] = e.detail.value;
    //   this.setData({
    //     postData: obj
    //   });
    // }
    obj[event_.name] = e.detail.value;
    this.setData({
      postData: obj
    });

 

  },

  delImg(e) {
    var index_ = e.currentTarget.dataset.index;
    var list_ = this.data.img_list2;
    list_.splice(index_, 1);
    this.setData({
      img_list2: list_
    });
  },
  upAllImg(list, index_) {
    var that = this;
    var curIndex_ = index_;
    if (index_ >= list.length) {
      curIndex_ = 0;
      wx.hideLoading();
      return false;
    } else {
      wx.uploadFile({
        url: `${api.WxApiRoot}/api/v1.utils/uploader`, // 仅为示例，非真实的接口地址
        filePath: list[curIndex_].path,
        name: 'file',
        formData: {
          user: 'file'
        },
        success(res) {
          console.log(JSON.parse(res.data))
          var data_ = JSON.parse(res.data)
          if (data_.code == 0) {
            that.setData({
              img_list2: that.data.img_list2.concat(data_.url)
            });

          } else {
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            });
          }
        }
      })


      curIndex_++;
      that.upAllImg(list, curIndex_);
    }
  },
  upImage() {
    var that = this;

    if (that.data.img_list2.length >= 4) {
      wx.showToast({
        title: '最多上传9张图片',
        icon: 'none'
      });
      return false;
    }
    that.setData({
      isShowTip: 0
    })
    wx.chooseImage({
      count: 4 - that.data.img_list2.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFiles = res.tempFiles

        wx.showLoading({
          title: '上传中',
        });
        that.upAllImg(tempFiles, 0)
      }
    })


  },
  submitEven(e) {
   
    var that=this;
    if (e.currentTarget.dataset.ok == 'isOk' && once) {
      if(!util.isPhone(this.data.postData.mobile)){
          wx.showToast({
            title: '请输入正确的手机号',
            icon:'none'
          });
        return false;
      }
      once = false;
      var obj = that.data.postData;
      obj.pics = that.data.img_list2.join(',');
      console.log(obj.pics);
      that.setData({
        postData: obj
      });
      wx.showLoading({
        title: '提交中',
      });
      util.request('/users/v1.my/fankui',that.data.postData,'POST').then(res=>{
        once=true;
        wx.hideLoading({
          complete: (res) => {},
        });
        if(res.code==0){
              wx.showToast({
                title: '提交成功',
                icon:'none'
              });
              that.setData({
                postData: {
                  content: '',
                  mobile: '',
                  pics: []
                },
                img_list2: []
              });


        }else{
          wx.showToast({
            title: res.msg,
            icon:'none'
          });
        }
        console.log(res);
      });
     

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    once = true;
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