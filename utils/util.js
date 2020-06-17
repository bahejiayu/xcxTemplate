var api = require('../config/api.js');
var app = getApp();

//正常时间格式化，yyyy/mm/dd hh:mm
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':') //, second
}

const vipTime = date => {
  var date= new Date(date);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-'); //, second
}

//正常时间格式化，yyyy-mm-dd hh:mm:ss
const formatTime5 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':') //, second
}
//时间格式化 mm-dd hh:mm
const formatTimeNotYear = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':') //, second
}
//时间格式化 yyyy-mm-dd
const formatTime2 = (date, txt = '-') => {
  var date = new Date(date);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join(txt)
}
const formatTime6 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  return [year, month].map(formatNumber).join('.')
}
//时间格式化，刚刚 x分钟前 x小时前  mm-dd hh:mm
const formatTime3 = datetime => {
  var now = new Date().getTime();
  var dateDiffTime = now - datetime;
  if (dateDiffTime < 60000) {
    return "刚刚";
  } else if (dateDiffTime < 1000 * 60 * 60) { //显示分钟
    return parseInt(dateDiffTime / 1000 / 60) + "分钟前";
  } else if (dateDiffTime < 1000 * 60 * 60 * 24) { //显示小时
    return parseInt(dateDiffTime / 1000 / 60 / 60) + "小时前";
  } else { //显示mm-dd hh:mm
    return formatTimeNotYear(new Date(datetime));
  }

  return "刚刚";
}
//时间格式化 hh:mm mm:dd
const formatTime4 = datetime => {
  var targetDate = new Date(datetime);
  var year = targetDate.getFullYear()
  var month = targetDate.getMonth() + 1
  var day = targetDate.getDate()
  var hour = targetDate.getHours()
  var minute = targetDate.getMinutes()
  var year2 = new Date().getFullYear()
  var month2 = new Date().getMonth() + 1
  var day2 = new Date().getDate()
  if (year + "-" + month + "-" + day == year2 + "-" + month2 + "-" + day2) {
    //如果是当天消息，显示hh:mm
    //补0
    hour = hour >= 10 ? hour : "0" + hour
    minute = minute >= 10 ? minute : "0" + minute
    return hour + ":" + minute
  } else {
    //显示mm:dd
    //补0
    month = month >= 10 ? month : "0" + month
    day = day >= 10 ? day : "0" + day
    hour = hour >= 10 ? hour : "0" + hour
    minute = minute >= 10 ? minute : "0" + minute
    return month + "-" + day + " " + hour + ":" + minute
  }
  return "00:00";

  // var now = new Date().getTime();
  // var dateDiffTime = now - datetime;
  // if (dateDiffTime < 60000) {
  //   return "刚刚";
  // }
  // else if (dateDiffTime < 1000 * 60 * 60) {//显示分钟
  //   return parseInt(dateDiffTime / 1000 / 60) + "分钟前";
  // }
  // else if (dateDiffTime < 1000 * 60 * 60 * 24) {//显示小时
  //   return parseInt(dateDiffTime / 1000 / 60 / 60) + "小时前";
  // }
  // else {//显示mm-dd hh:mm
  //   return formatTimeNotYear(new Date(datetime));
  // }

  // return "刚刚";
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const orderStatus = n => {
  //  status_0 = 0;//未支付
  //  status_1 = 1;//已支付，待接单
  //  status_2 = 2;//已接单，待完成
  //  status_3 = 3;//订单完成
  //  status_4 = 4;//取消
  //  status_5 = 5;//5退款
  //  status_6 = 6;//6退款完成，关闭订单
  //  status_7 = 7;//订单无人接单，超出接单有效期
  //  status_8 = 8;//评价完成
  if (n == 0) {
    return "未支付";
  } else if (n == 1) {
    return "待接单";
  } else if (n == 2) {
    return "进行中";
  } else if (n == 3) {
    return "进行中";
  } else if (n == 4) {
    return "已取消";
  } else if (n == 5) {
    return "申请退款";
  } else if (n == 6) {
    return "退款完成";
  } else if (n == 7) {
    return "已超时";
  } else if (n == 8) {
    return "已完成";
  } else if (n == 9) {
    return "已完成";
  }
  return "进行中";
}


/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET", header = 'application/json') {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('token')) {
      data.token = wx.getStorageSync('token');

    }
    wx.request({
      url: api.WxApiRoot + url,
      data: data,
      method: method,
      header: {
        'Content-Type': header,
        'X-Litemall-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 45000) {
            //登录超时
            // 清除登录相关内容
            wx.showToast({
              title: '登录超时,请重新登陆',
              icon:'none'
            });
            wx.showTabBar();
            var vipflag=false;
            if(wx.getStorageSync('vips')){
              vipflag=true;
            }
            wx.clearStorage();
            if(vipflag){
                wx.setStorageSync('vips', 1);
            }
            setTimeout(function(){
              wx.switchTab({
                url:'/pages/user/user'
              });
            },1000);
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function (err) {
        wx.showToast({
          title: '服务器打瞌睡了',
          icon: 'success',
          image: '/images/icon_error.png',
          duration: 2000
        })
        reject(err)
      }
    })
  });
}

function redirect(url) {

  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

function wxRouter(type = 'navigateTo', url) {
  wx[type]({
    url: url,
  });
}

function getUserInfo(callBack, go) {
  if(!wx.getStorageSync('token')){
      return null;
  }

  request('/users/v1.me/getUserInfo', {}, 'POST').then(res => {
    console.log(res);
    if (res.code == 0) {
      callBack && callBack(res.data);
      wx.setStorageSync('userInfo', res.data)
    } else {
      wx.removeStorageSync('token');
      wx.removeStorageSync('userInfo');
      // 用户未登陆
      // if(go){

      // }

    }
  });

}

function formatRichText(html) {
  let newContent = html.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
  return newContent;
}

function errImg(e, a, url = '/images/showGood.png',key_='logo') {
  var target_ = e.currentTarget.dataset;
  var obj = a.data[target_.obj];
  obj[target_.index][key_] = url;
  a.setData({
    [target_.obj]: obj
  });
}


var toHHmmss = function (data) {
  if (data <= 0) {
    return '拍卖已结束'
  }
  var time = parseFloat(data) / 1000;
  if (null != time && "" != time) {
    if (time > 60 && time < 60 * 60) {
      time = parseInt(time / 60.0) + "分" + parseInt((parseFloat(time / 60.0) -
        parseInt(time / 60.0)) * 60) + "秒";
    }
    // else if (time >= 60 * 60 && time < 60 * 60 * 24) {
    else if (time >= 60 * 60) {
      time = parseInt(time / 3600.0) + "时" + parseInt((parseFloat(time / 3600.0) -
          parseInt(time / 3600.0)) * 60) + "分" +
        parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
          parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
    } else {
      time = parseInt(time) + "秒";
    }
  }
  return time;
}


function getBox(id, callBack) {

  wx.getSystemInfo({
    success: function (res) {
      console.log(res);
      var width_ = res.windowWidth;
      var height_ = res.windowHeight;
      var query = wx.createSelectorQuery();
      //选择id
      var that = this;
      query.select(id).boundingClientRect(function (rect) {
        callBack && callBack(height_ - rect.height);
      }).exec();
    }
  })
}

function getBoxInfo(id, callBack) {

      //选择id
      var that = this;
      var query = wx.createSelectorQuery();
      query.select(id).boundingClientRect(function (rect) {
        callBack && callBack(rect);
      }).exec();
}

function uploadImg() {

  return new Promise(function (resolve, reject) {
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          title: '上传中',
        });
        wx.uploadFile({
          count: 1,
          url: api.WxApiRoot + '/api/v1.utils/uploader', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            wx.hideLoading();
            var data =JSON.parse(res.data);
            console.log(data);
            if(data.code==0){
              resolve(data);
            }else{
              wx.showToast({
                title: '上传失败',
                icon:'none'
              });
              reject(data);
            }

            
            //do something
          },
          fail(res) {
            console.log(res);
          }
        })
      }
    });

  });



}

function wxPay(qm) {
  console.log(qm)
  return new Promise(function (resolve, reject) {
    wx.requestPayment({
      appId: qm.appId,
      timeStamp: qm.timeStamp + '',
      nonceStr: qm.nonceStr,
      package: qm.package,
      signType: 'MD5',
      paySign: qm.paySign,
      success(res) {
        wx.showToast({
          title: '支付成功',
          icon: 'none'
        });
        resolve(res);
      },
      fail(res) {
        wx.showToast({
          title: '支付失败',
          icon: 'none'
        });
        reject(res);
      }
    });
  });
}

function sf(time) {
  console.log(time)
  if (time <= 0) {
    return '已截至'
  }
  var hours = parseInt((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = parseInt((time % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = (time % (1000 * 60)) / 1000;
  return hours + '时' + minutes + '分后截至';
  console.log(hours + '时' + minutes + '分');
}

var phoneArea = {
  arr1: [
    '+86',
    '+852',
    '+853',
    '+886',
    '+87',
    '+88',
    '+89',
    '+90'
  ],
  arr2: [
    '中国',
    '中国香港',
    '中国澳门',
    '中国台湾',
    '法国',
    '德国',
    '意大利',
    '美国'
  ]
}

function isPhone(phone) {
  return /^1[3456789]\d{9}$/.test(phone)
}

function closeL(that, time = 0) {
  setTimeout(() => {
    that.setData({
      showLoading: false
    }, time);
  });
}

function isAouth(){
    if(!wx.getStorageSync('token')){
        wx.showToast({
           title: '用户未登陆',
            icon:'none'
      });
          wx.reLaunch({
            url: '/user/pages/login/login',
          });
    }
}


export default {
  isAouth,
  getBoxInfo,
  vipTime,
  closeL,
  isPhone,
  phoneArea,
  sf,
  wxPay,
  uploadImg,
  getBox,
  toHHmmss,
  errImg,
  formatRichText,
  getUserInfo,
  wxRouter,
  formatTime,
  formatTime2,
  formatTime3,
  formatTime4,
  formatTime5,
  formatTime6,
  formatTimeNotYear,
  request,
  redirect,
  showErrorToast,
  dateDiff,
  orderStatus,
  nto,
  getWeekDay
}

function dateDiff(timeLong) {
  var now = new Date().getTime();
  if (timeLong < now) return -1;
  var diffLong = timeLong - now;
  var dayDiff = 1000 * 60 * 60 * 24;
  return parseInt(diffLong / dayDiff)
}

function strCheck(str) {
  var strFormat = "0123456789";
  for (var i = 0; i < str.length; i++) {
    if (strFormat.indexOf(str.substr(i, 1)) == -1) {
      return false;
    }
  }
  return true;
}

function nto(str) {
  if (str == undefined) {
    return '';
  }
  // console.log(str)
  var a = new Array();
  var b = "";
  var k = 0;
  for (var i = 0; i < str.length; i++) {
    a[i] = str.substr(i, 1);
    if (strCheck(a[i])) {
      k++;
    } else {
      k = 0;
    }
    if (k >= 4) {
      for (var j = i - 1; j <= i; j++) {
        a[j] = '*';
      }
    }
  }
  for (var i = 0; i < str.length; i++) {
    b += a[i]
  }
  return b;
}

function getWeekDay(date) {
  var week = date.getDay();
  var str = "";
  if (week == 0) {
    str = "星期日";
  } else if (week == 1) {
    str = "星期一";
  } else if (week == 2) {
    str = "星期二";
  } else if (week == 3) {
    str = "星期三";
  } else if (week == 4) {
    str = "星期四";
  } else if (week == 5) {
    str = "星期五";
  } else if (week == 6) {
    str = "星期六";
  }
  return str;
}