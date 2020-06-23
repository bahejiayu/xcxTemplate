// pages/artNewDetail/artNewDetail.js
import util from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      newData:{},
      id:''
  },
  // 切换收藏
  togCollect(e){
    var that=this;
    util.isAouth();
    if(!util.isAouth()){
      return false;
    }
    var collectType=e.currentTarget.dataset.type;
          util.request('/news/v1.pages/setCollect',{
            id:that.data.id,
            iscollect:collectType==0?1:0
          },'POST').then(res=>{
                  console.log(res);
                  if(res.code==0){
                    var obj =that.data.newData;
                    obj.iscollect=collectType==0?1:0;
                    that.setData({
                      newData:obj
                    });
                      if(collectType==0){
                            wx.showToast({
                              title: '收藏成功',
                              icon:'none'
                            });
                      }else{
                        wx.showToast({
                          title: '取消成功',
                          icon:'none'
                        });
                      }

                  }else{
                        wx.showToast({
                          title: res.msg,
                          icon:'none'
                        });
                  }

          });

  },
   // 切换点赞
   togLike(e){
    var that=this;
    util.isAouth();
    if(!util.isAouth()){
      return false;
    }
    var collectType=e.currentTarget.dataset.type;
          util.request('/news/v1.pages/setLike',{
            id:that.data.id,
            islike:collectType==0?1:0
          },'POST').then(res=>{
                  console.log(res);
                  if(res.code==0){
                    var obj =that.data.newData;
                    obj.islike=collectType==0?1:0;
                    if( obj.islike==1){
                      obj.info.zan_num++
                    }else{
                      obj.info.zan_num--

                    }
                    that.setData({
                      newData:obj
                    });
                      if(collectType==0){
                            wx.showToast({
                              title: '已点赞',
                              icon:'none'
                            });
                      }else{
                        wx.showToast({
                          title: '已取消',
                          icon:'none'
                        });
                      }

                  }else{
                        wx.showToast({
                          title: res.msg,
                          icon:'none'
                        });
                  }

          });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    this.setData({
      id:options.id
    });
    var that=this;
      util.request('/news/v1.pages/detail',{
        id:options.id
      },'POST').then(res=>{
        wx.hideLoading({
          complete: (res) => {},
        });
          console.log(res);
          res.data.info.created_at=res.data.info.created_at.replace(/-/g,'/');
          res.data.info.updated_at=res.data.info.updated_at.replace(/-/g,'/');
          res.data.info.content=util.formatRichText( res.data.info.content);
          if(res.code==0){
              that.setData({
                  newData:res.data
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