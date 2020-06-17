// user/pages/sell/sell.js
import dateTimePicker from '../../../utils/dateTimePicker.js';
import util from "../../../utils/util";
import api from "../../../config/api";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    postData:{
      // token: "c5ec85787e24fccc9c159b71e3ce9262",
      type: '',
      logo: "",
      title: "",
      author: "",
      cbs: "",
      price: "",
      discount_pice: "",
      num: '1',
      freight: "",
      degree: '',
      pics: "",
      isbn: "",
      desc: "",
      send_addr: "",
      flag:1,

      starting_price: '',
      plus_price: '',
      start_time: '',
      end_time: "" 
  },

    sellType1:false,
    sellType2:false,

    img_list2:[],
    dateTimeArray1: null,
    dateTime1: null,
    startYear: null,
    endYear: null,
    dragList:[
        {
          name:'全新',
          value:0
        },
        {
          name:'九成新',
          value:9
        },
        {
          name:'八成新',
          value:8
        },
        {
          name:'七成新',
          value:7
        },
        {
          name:'六成新',
          value:6
        },
        {
          name:'五成新',
          value:5
        },
        {
          name:'四成新',
          value:4
        },
        {
          name:'三成新',
          value:3
        },
        {
          name:'二成新',
          value:2
        },
        {
          name:'一成新',
          value:1
        }
    ]
  },
  cityChange(e){
    console.log(e);
    var obj=this.data.postData;
    var cityArr=e.detail.value;
    obj.send_addr=cityArr.join(' ');
    this.setData({
      postData:obj
    });
  },
  dragChange(e){
    var obj=this.data.postData;
    obj.degree=this.data.dragList[e.detail.value].value;
    console.log(this.data.dragList[e.detail.value])
    this.setData({
      postData:obj
    });
},
  upBookLogo(){
    var that=this;
      util.uploadImg().then(res=>{
          console.log(res);
          var obj=that.data.postData;
          obj.logo=res.url;
          that.setData({
            postData:obj
          });
      });
  },
  delImg(e){
      var index_=e.currentTarget.dataset.index;
      var list_=this.data.img_list2;
      list_.splice(index_,1);
      this.setData({
        img_list2:list_
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

    if (that.data.img_list2.length >= 8) {
      wx.showToast({
        title: '最多上传9张图片',
        icon: 'none'
      });
      return false;
    }
    that.setData({
      isShowTip:0
    })
    wx.chooseImage({
      count: 8 - that.data.img_list2.length,
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
  
  pmSubmit(e){
    var that=this;
      this.partTime(()=>{

           var obj=that.data.postData
           obj.type=2;
           that.setData({
            postData:obj,
            sellType2:false
           });
      });



  },
  ykjSubmit(e){
      console.log(e.detail.value.price);
      if(e.detail.value.price.trim()==''){
          wx.showToast({
            title: '请输入价格',
            icon:'none'
          });
          return false;
      }
      var obj=this.data.postData;
      obj.discount_pice=e.detail.value.price;
      obj.type=1;
      this.setData({
        postData:obj,
        sellType1:false
      });



  },
  sellType1(){
      this.setData({
        sellType1:true
      });
  },
  closeSellType1(){
    this.setData({
      sellType1:false
    });
  },
  sellType2(){
    this.setData({
      sellType2:true
    });
},
closeSellType2(){
  this.setData({
    sellType2:false
  });
},
inputEven(e){
  var that=this;
  var event_=e.currentTarget.dataset;
  var obj=this.data.postData;

    obj[event_.name]=e.detail.value;
  this.setData({
    postData :obj
  });

},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
   
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    //var lastArray = obj1.dateTimeArray.pop();
    //var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });


      this.initAddress();
      wx.showLoading({
        title: '加载中',
      });
    util.request('/users/v1.me/releaseDetails',{
      id:options.id
    },'POST').then(res=>{
        console.log(res);
        wx.hideLoading();
        if(res.code==0){
          console.log(res.data.pics);
          console.log(res.data.pics.split(','));
            that.setData({
              postData:res.data,
            });
            if(res.data.pics!=''){
                that.setData({
                  img_list2:res.data.pics.split(',')
                });
            }
        }
    });


  },
  successSubmit(e){
    var that=this;
      this.verificationForm(()=>{
        var data_=that.data.postData;
        data_.flag=e.currentTarget.dataset.flag;
          wx.showLoading({
            title: '提交中',
          });
            util.request('/users/v1.me/releaseUpate',data_,'POST').then(res=>{
                  wx.hideLoading({
                    complete: (res) => {},
                  });
                  if(res.code==0){
                      if(e.currentTarget.dataset.flag==1){
                        wx.showModal({
                          title: '提示',
                          showCancel:false,
                          content: '已提交,请耐心等待审核!',
                          success (res) {
                            if (res.confirm) {
                              console.log('用户点击确定')
                            }
                          }
                        });
                      }else{
                          wx.showToast({
                            title: '存为草稿成功',
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

      });
  },
  verificationForm(callBack){
    var formData=this.data.postData;
    if(formData.title.trim()==''){
        wx.showToast({
          title: '请填写书名',
          icon:'none'
        });
        return false;
    }
    if(formData.author.trim()==''){
      wx.showToast({
        title: '请填写作者',
        icon:'none'
      });
      return false;
  }
    if(formData.freight.trim()==''){
      wx.showToast({
        title: '请填写运费',
        icon:'none'
      });
      return false;
  }
  if((formData.degree+'').trim()==''){
    wx.showToast({
      title: '请选择新旧程度',
      icon:'none'
    });
    return false;
  }
  if(formData.desc.trim()==''&&this.data.img_list2.length==0){
    wx.showToast({
      title: '请完善内容',
      icon:'none'
    });
    return false;
  }

  if(formData.send_addr.trim()==''){
    wx.showToast({
      title: '请填写发货地',
      icon:'none'
    });
    return false;
  }
  if(formData.type==''){
    wx.showToast({
      title: '请选择售卖方式',
      icon:'none'
    });
    return false;
  }
  if(formData.logo==''){
    wx.showToast({
      title: '请添加封面',
      icon:'none'
    });
    return false;
  }
  
  var obj=this.data.postData;
  obj.pics=this.data.img_list2.join(',');
  this.setData({
    postData:obj
  });
  callBack&&callBack();
  },
  initAddress(){
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        console.log(res);
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
      }
     })
  },
  erCode(){
    var that=this;
    wx.scanCode({
      success (res) {
        console.log(res);
          if(res.result){
            var obj=that.data.postData;
            obj.isbn=res.result;
            that.setData({
              postData:obj
            });
          }else{
              wx.showToast({
                title: '无法识别',
                icon:'none'
              });
          }
      },
      fail(){
        wx.showToast({
          title: '无法识别',
          icon:'none'
        });
      }
    })
  },
  partTime(callBack){
      var start_time=this.data.postData.start_time;
      var end_time=this.data.postData.end_time;
      console.log(1111)
      if(start_time&&end_time){
        console.log(start_time,end_time)
         var ksc= new Date(start_time.replace(/-/g,'/')).getTime();
          var jsc=new Date(end_time.replace(/-/g,'/')).getTime();
          console.log(ksc,jsc)

          var onDay=24*60*60*1000;
          if(ksc>jsc){
              wx.showToast({
                title: '开始时间不能大于结束时间',
                icon:'none'
              });
              return false;
          }else if((jsc-ksc)<onDay){
            wx.showModal({
              title: '提示',
              content: '竞拍时间最少为一天',
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            });
            return false;

          };
          callBack&&callBack();
      }
  },
   // 选择日期时间
   changeDateTime1(e) {
    this.setData({
      dateTime1: e.detail.value
    });
    var dateValue=[];
    var timeValue=[];
    for( var i=0;i<=5;i++){
        if(i<=2){
          dateValue.push(this.data.dateTimeArray1[i][this.data.dateTime1[i]]);
        }else{
          timeValue.push(this.data.dateTimeArray1[i][this.data.dateTime1[i]]);
        }
    }
    var selTimeValue=dateValue.join('-')+' '+timeValue.join(':');
    console.log(selTimeValue);
    var obj=this.data.postData;
    console.log(e.currentTarget.dataset.name)
    obj[e.currentTarget.dataset.name]=selTimeValue;
    this.setData({
      postData:obj
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
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