// 以下是业务服务器API地址
// 本机开发时使用
//var WxApiRoot = 'http://192.168.0.183:8082/sf/';
//var WxSocketRoot = 'ws://192.168.0.102:8082/sf/';
// 云平台部署时使用
var WxApiRoot = 'https://banma.laoyeshow.cn/sf/';
var WxSocketRoot = 'wss://banma.laoyeshow.cn/sf/';

module.exports = {
  globalData: {
    rankRefresh: 0,
    rankPageNum: 1
  },
  GetUserData: WxApiRoot + 'user/getUserData' //首页数据接口

};